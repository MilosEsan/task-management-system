import React, { useContext, useState, useEffect } from 'react';
import axios  from 'axios';
import Transaction from './Transaction'
import Modal from "react-bootstrap/Modal";

export const ToDos = () => {
    const [todos, setTodos] = useState([]);
    const [openModal, setIsModalOpen] = useState(false);

    const [todoName, setTodoName] = useState('')
    const [todoDetails, setTodoDetails] = useState('')

    const showModal = () => {
      setIsModalOpen(true)
    };

    const hideModal = () => {
      setIsModalOpen(false)
    };

    const saveTodo = (e) => {
      e.preventDefault()
      let params = {
        title: todoName,
        description: todoDetails
      }
      console.log(params)
      axios.post('/api/todos/', 
        params
      )
      .then(()=> {
        getTodos()
        hideModal()
      })
      .catch(err=> {
        console.log(err)
      })
    }

    const deleteTodo = (id) => {
      axios.delete('/api/todos/'+id)
      .then(()=> {
        getTodos()
      })
      .catch(err=> {
        console.log(err)
      })
    };
    
    const getTodos = () => {
      axios.get('/api/todos')
      .then(res=> {
        setTodos(res.data)
      })
    }

  useEffect(() => {

    getTodos();

  }, []);

  return (
    <div style={openModal ? {display: 'none'} : null}>
      <h3>ToDo Section</h3>
        <ul className="list mb-1">
          {todos.map(todo => (
            <li key={todo.id}>
              {todo.title}
              <button onClick={() => deleteTodo(todo.id)} className="delete-btn">delete</button>
              <button onClick={() => deleteTodo(todo.id)} className="edit-btn">edit</button>
            </li>
            )).reverse()}
        </ul>
        <button type="button" className="btn btn-dark" onClick={showModal}>Add ToDo</button>

        <Modal show={openModal} onHide={hideModal}>

          <Modal.Header><button class="close-modal-btn" onClick={hideModal}>X</button></Modal.Header>
          

          <Modal.Body>
                <form onSubmit={saveTodo}>
                  <div className="form-group">
                    <label htmlFor="recipient-name" className="col-form-label">Title:</label>
                    <input type="text" className="form-control" id="todo_name" onChange={(e)=>setTodoName(e.target.value)} value={todoName}/>
                  </div>
                  <div className="form-group mb-5 fg-fix">
                    <label htmlFor="message-text" className="col-form-label">Description:</label>
                    <textarea rows="6" className="form-control" id="message-text" onChange={(e)=>setTodoDetails(e.target.value)} value={todoDetails}></textarea>
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