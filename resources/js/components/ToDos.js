import React, { useState, useEffect } from 'react';
import axios  from 'axios';
// import Transaction from './Transaction'
import Modal from "react-bootstrap/Modal";

export const ToDos = () => {
  
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null);
    const [openModal, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [todoName, setTodoName] = useState('');
    const [todoDetails, setTodoDetails] = useState('');
    const [error, setError] = useState('');
    const [record_count, setRecordCount] = useState(0);
    const [is_completed, setIsCompleted] = useState(0);
    const [created_by, setCreatedBy] = useState('');

    const showModal = () => {
      setIsModalOpen(true)
    };

    const hideModal = () => {
      setIsModalOpen(false)
      getTodos(null)
      setIsEditing(false)
      setEditId(null)
      setError('')
    };

    const saveTodo = (e) => {
      e.preventDefault()
      let params = {
        title: todoName,
        description: todoDetails,
        created_by: localStorage.getItem("user_name"),
      }
      axios.post('/api/todos/', 
        params
      )
      .then((response)=> {
        console.log(response)
        getTodos(null)
        hideModal()
      })
      .catch(err=> {
        setError(err.response.data.message)
      })
    };

    const saveEdit = (e) => {
      axios.put('/api/todos/'+editId, {
        "title": todoName,
        "description": todoDetails
      })
        .then(res=> {
          hideModal()
        })
        .catch(err=> {
          console.log('test err: ', err)
        })
    }

    const setProgress = (operator) => {
      let newCompleted;

      if (operator === '+' && is_completed < 2) {
        newCompleted = is_completed + 1;
      } else if (operator === '-' && is_completed > 0) {
        newCompleted = is_completed - 1;
      } else {
        return;
      }
    
      setIsCompleted(newCompleted);
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
        if (!id) {
          setTodos(res.data.todos)
          setRecordCount(res.data.record_count)
        } else {
          setIsCompleted(res.data.progress)
          console.log(is_completed)
        }
        if (!isEditing) {
          setTodoDetails(res.data.description); 
          setTodoName(res.data.title);
          setCreatedBy(res.data.created_by);
        } else {
          // setTodoDetails(null); 
          // setTodoName(null)
          console.log(todoName)
          console.log(todoDetails)
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

    if (editId !== null) {
      axios.put(`/api/todos/${editId}`, {
        progress: is_completed,
      })
      .catch((error) => {
        console.log(error);
      });
    }

  }, [editId, is_completed]);

  return (
    <div className='container d-flex justify-content-between flex-column' style={openModal ? {display: 'none'} : null}>
        <ul className="list mb-1">
          {todos.length ? todos.map((todo, index) => (
            <li key={todo.id}>
             <div style={todo.progress===1 ? {gap: '50px'} : null} className='d-flex flex-row w-100 justify content-between'>
                <p>
                  {todo.title}
                </p>
                {
                  todo.progress===1 ? <small className='badge badge-info'>IN PROGRESS</small> : 
                  todo.progress===2 ? <small className='badge badge-success'>COMPLETED</small> :
                  <small className='badge badge-warning'>Backlog</small>
                }
             </div>
             {todo.created_by && <p>Created by: {todo.created_by}</p>}
              <button onClick={() => deleteTodo(todo.id)} className="delete-btn">delete</button>
              <button onClick={() => editTodo(todo.id)} className="edit-btn">edit</button>
            </li>
            )).reverse(): null}
        </ul>
        <p className={record_count > 15 ? 'text-danger' : 'text-warning'}>
          The number of records for today: {record_count} ({20 - record_count} places left)
        </p>
        <button style={{width: '250px', marginLeft: 'auto', height: '40px'}} type="button w-25" className="btn btn-dark" onClick={() => { showModal(); setIsEditing(true);}}>
          Add ToDo
        </button>

        <Modal show={openModal} onHide={hideModal}>

        <Modal.Header style={{display: 'flex'}}>
            {editId &&          
              <div className='d-flex flex-column'>
                <div className='d-flex flex-row w-100 align-items-center justify-content-center'>
                  <button type="button" onClick={() => setProgress('-')}>-</button>
                  <button type="button" onClick={() => setProgress('+')}>+</button>  
                  <p className='ml-auto mr-auto'>
                    {is_completed === 0 ? 'to do' : 
                    is_completed === 1 ? 'in progress' : 
                    is_completed === 2 ? 'completed' : 
                    null}
                  </p>  
                </div>
              </div>
            }
            <button style={{cursor: 'pointer'}} className="close-modal-btn" onClick={hideModal}>X</button>
        </Modal.Header>

          

          <Modal.Body>
                <form onSubmit={processPostRequest}>
                  <div className="form-group">
                    <label htmlFor="recipient-name" className="col-form-label">Title:</label>

                    <input type="text" className="form-control" id="todo_name" onChange={(e)=>setTodoName(e.target.value)} value={todoName}/>
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
                      <br/>
                    {error.length > 0 &&
                        <small className='text-danger'>{error}</small>
                      }
                  </div>
                </form>
          </Modal.Body>

          {/* <Modal.Footer>This is the footer</Modal.Footer> */}

        </Modal>
    </div>
  )
}