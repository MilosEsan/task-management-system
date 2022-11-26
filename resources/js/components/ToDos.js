import React, { useContext, useState, useEffect } from 'react';
import axios  from 'axios';
// import Transaction from './Transaction'
import Modal from "react-bootstrap/Modal";

export const ToDos = () => {
  
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null)
    const [openModal, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [todoName, setTodoName] = useState('');
    const [todoDetails, setTodoDetails] = useState('');

    const showModal = () => {
      setIsModalOpen(true)
    };

    const hideModal = () => {
      setIsModalOpen(false)
      getTodos(null)
      setIsEditing(false)
      setEditId(null)
    };

    const saveTodo = (e) => {
      e.preventDefault()
      let params = {
        title: todoName,
        description: todoDetails
      }
      axios.post('/api/todos/', 
        params
      )
      .then(()=> {
        getTodos(null)
        hideModal()
      })
      .catch(err=> {
        console.log(err)
      })
    };

    const saveEdit = (e) => {
      axios.put('/api/todos/'+editId, {
        "title": todoName ? todoName : null,
        "description": todoDetails ? todoDetails : null
      })
        .then(res=> {
          hideModal()
          console.log(res)
        })
    }

    const deleteTodo = (id) => {
      axios.delete('/api/todos/'+id)
      .then(()=> {
        getTodos(null)
      })
      .catch(err=> {
        console.log(err)
      })
    };

    const editTodo = (id) => {
      setIsEditing(true)
      getTodos(id)
      showModal()
      setEditId(id)
    }
    
    const getTodos = (id) => {
      axios.get(id ? `/api/todos/${id}` : '/api/todos')
      .then(res=> {
        setTodos(res.data)
        if (!isEditing) {
          setTodoDetails(res.data.description); 
          setTodoName(res.data.title)
        } else {
          setTodoDetails(null); 
          setTodoName(null)
        }
      })
    }

  function processPostRequest(e) {
    e.preventDefault()
    if (!editId) {
      saveTodo(e)
    } else {
      setTimeout(() => {
        saveEdit(editId)
      }, 500);
    }

  }

  useEffect(() => {

    getTodos(null);

  }, []);

  return (
    <div style={openModal ? {display: 'none'} : null}>
      <h3>ToDo Section</h3>
        <ul className="list mb-1">
          {todos.length ? todos.map(todo => (
            <li key={todo.id}>
              {todo.title}
              <button onClick={() => deleteTodo(todo.id)} className="delete-btn">delete</button>
              <button onClick={() => editTodo(todo.id)} className="edit-btn">edit</button>
            </li>
            )).reverse(): null}
        </ul>
        <button type="button" className="btn btn-dark" onClick={() => { showModal(); setIsEditing(true);}}>
          Add ToDo
        </button>

        <Modal show={openModal} onHide={hideModal}>

          <Modal.Header style={{display: 'flex'}}><button style={{cursor: 'pointer'}} className="close-modal-btn" onClick={hideModal}>X</button></Modal.Header>
          

          <Modal.Body>
                <form onSubmit={processPostRequest}>
                  <div className="form-group">
                    <label htmlFor="recipient-name" className="col-form-label">Title:</label>
                    {!isEditing ?                     
                        <input type="text" className="form-control" id="todo_name" onChange={(e)=>setTodoName(e.target.value)} value={todoName}/>
                        :
                        <input type="text" className="form-control" id="todo_name" onChange={(e)=>setTodoName(e.target.value)} value={todoName}/>
                    }
                  </div>
                  <div className="form-group mb-5 fg-fix">
                    <label htmlFor="message-text" className="col-form-label">Description:</label>
                      {!isEditing ?                     
                        <textarea rows="6" className="form-control" id="message-text" onChange={(e)=>setTodoDetails(e.target.value)} value={todoDetails}>
                        </textarea> :
                        <textarea rows="6" className="form-control" id="message-text" onChange={(e)=>setTodoDetails(e.target.value)} value={todoDetails}>
                          {todoDetails}
                        </textarea>
                      }
                  </div>

                  <div className='w-100 text-center'>
                    <button type='submit' className='btn btn-success'>
                      SAVE
                    </button>
                  </div>
                </form>
          </Modal.Body>

          {/* <Modal.Footer>This is the footer</Modal.Footer> */}

        </Modal>
    </div>
  )
}