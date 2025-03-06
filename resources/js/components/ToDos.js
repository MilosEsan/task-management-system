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
    const [assignedUser, setAssignedUser] = useState(null);
    const [error, setError] = useState('');
    const [record_count, setRecordCount] = useState(0);
    const [assignedUsers, setAssignedUsers] = useState({});
    const [userRole, setUserRole] = useState('')
    const [users, setUsers] = useState([])

    const showModal = () => {
      setIsModalOpen(true)
      if (!editId) {
        setTodoName('')
        setTodoDetails('')
      }
    };

    const hideModal = () => {
      setIsModalOpen(false)
      if (editId) getTodos(null)
      setIsEditing(false)
      setEditId(null)
      setError('')
    };

    const saveTodo = (e) => {
      console.log(e.target[0].value)
      let params = {
        title: todoName,
        description: todoDetails,
        created_by: localStorage.getItem("user_name"),
        assigned_to: Number(e.target[0].value) !== 0 ? Number(e.target[0].value) : null
      }
      axios.post('/api/todos/', 
        params
      )
      .then((response)=> {
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

    const setProgress = (operator, id, progress) => {
      let newCompleted = progress;

      if (operator === '+' && newCompleted < 2) {
        newCompleted = newCompleted + 1;
      } else if (operator === '-' && newCompleted > 0) {
        newCompleted = newCompleted - 1;
      } else {
        return;
      }

      axios.put(`/api/todos/${id}`, {
        progress: newCompleted,
      })
      .then(()=> {
        setTimeout(() => {
          getTodos(null)
        }, 100);
      })
      .catch((error) => {
        console.log(error);
      });
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

    function assignUser(id, taskId) {
      axios.put(`/api/todos/${taskId}`, {
        assigned_to: Number(id)
      })
      .then(()=> {
        alert('Task Assigned ')
        hideModal()
      })
      .catch(error=> console.log(error))
    }
    
    const getTodos = (id) => {
      axios.get(id ? `/api/todos/${id}` : '/api/todos')
      .then(res=> {
        if (!id) {
          setTodos(res.data.todos)
          markAssignedUsers(res.data.todos)
          setRecordCount(res.data.record_count)
        } 
        if (!isEditing) {
          setTodoDetails(res.data.description); 
          setTodoName(res.data.title);
        } 
        if (id) {
          axios.get('/api/users/'+res.data.assigned_to)
          .then((res) => setAssignedUser(res.data.name))
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

  function markAssignedUsers(users) {
    users.forEach(todo => {
      if (todo.assigned_to && !assignedUsers[todo.assigned_to]) {
        axios.get(`/api/users/${todo.assigned_to}`)
          .then(res => {
            setAssignedUsers(prev => ({
              ...prev, 
              [todo.assigned_to]: res.data.name
            }));
          })
          .catch(err => console.log(err)); 
      }
    });
  }

  useEffect(() => {

    setUserRole(localStorage.getItem('user_role'))
    getTodos(null);
    
    if (localStorage.getItem('user_role')==='super_admin') {
      axios.get('/api/users')
      .then((res)=> {
        setUsers(res.data)
      })
    }
  }, []);

  return (
    <div className='container d-flex justify-content-between flex-column' style={openModal ? {display: 'none'} : null}>
        <ul className="list mb-1">
          {todos.length ? todos.map((todo, index) => (
            <li key={todo.id}>
             <div style={{gap: '50px'}} className='d-flex flex-row w-100 justify content-between'>
                <h1 className='todo-title'>
                  {todo.title}
                </h1>
                {userRole==='super_admin' && 
                <div className='mb-2'>
                  <i className='mr-1'>Set Progress: </i>
                  {todo.progress > 0 &&                  
                    <button type="button" onClick={() => setProgress('-', todo.id, todo.progress)}>{'<'}</button>
                  }
                  {todo.progress < 2 &&
                    <button style={{marginLeft: '3px'}} type="button" onClick={() => setProgress('+', todo.id, todo.progress)}> {'>'} </button> 
                  }
                  <br></br>
                  {
                    todo.progress === 0 ? (
                      <small className="badge badge-warning">BACKLOG</small>
                    ) : todo.progress === 1 ? (
                      <small className="badge badge-info">IN PROGRESS</small>
                    ) : (
                      <small className="badge badge-success">COMPLETED</small>
                    )
                  }
                </div>}
             </div>
              <div className="d-flex justify-content-between created-assigned">
                {todo.created_by && <p><i>Created By:</i> {todo.created_by}</p>}
                {todo.assigned_to && (
                    <p className='assigned_to'><i>Assigned To:</i> {assignedUsers[todo.assigned_to] || 'Loading...'}</p>
                  )}
              </div>
             <p className='text-center mb-3'>{todo.description}</p>
                <div className='d-flex justify-content-center'>
                  <button onClick={() => deleteTodo(todo.id)} className="delete-btn">delete</button>
                  <button onClick={() => editTodo(todo.id)} className="edit-btn">edit</button>
                </div>
            </li>
            )).reverse(): null}
        </ul>
        <p className={record_count > 15 ? 'text-danger' : 'text-warning'}>
          The number of records for today: {record_count} ({20 - record_count} places left)
        </p>
        <button style={{width: '250px', marginLeft: 'auto', height: '40px'}} type="button w-25" className="btn btn-dark" onClick={() => { showModal(); setIsEditing(false);}}>
          Add ToDo
        </button>

        <Modal show={openModal} onHide={hideModal}>

        <Modal.Header style={{display: 'flex'}}>
            <button style={{cursor: 'pointer'}} className="close-modal-btn" onClick={hideModal}>X</button>
        </Modal.Header>

          

          <Modal.Body>
            {
              userRole==='super_admin' && 
              <div>
                {editId &&
                  <select onChange={(e)=> {assignUser(e.target.value, editId)}} className="form-select" aria-label="Default select example">
                    <option value="" hidden>Assign a team member</option>
                    {
                      users.map(user=>(
                        <option value={user.id} key={user.id}>{user.name}</option>
                      ))
                    }
                  </select>}
                {(assignedUser && editId) && <div style={{fontWeight:'bold', color:'purple'}} className='text-center'>Assigned to: {assignedUser}</div>}
              </div>
            }
                <form onSubmit={processPostRequest}>
                  {(userRole==='super_admin' && !editId)&&
                    <div className='form-group'>
                      <select className="form-select" aria-label="Default select example">
                        <option value="" hidden>Add a team member</option>
                        {
                          users.map(user=>(
                            <option value={user.id} key={user.id}>{user.name}</option>
                          ))
                        }
                      </select>
                    </div>}
                    <div className="form-group">
                    <label htmlFor="recipient-name" className="col-form-label">Title:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="todo_name"
                      onChange={(e) => setTodoName(e.target.value)}
                      value={todoName ?? ''}
                    />
                  </div>
                  <div className="form-group mb-5 fg-fix">
                    <label htmlFor="message-text" className="col-form-label">Description:</label>
                    <textarea
                      rows="6"
                      className="form-control"
                      id="message-text"
                      onChange={(e) => setTodoDetails(e.target.value)}
                      value={todoDetails ?? ''}
                    />
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

        </Modal>
    </div>
  )
}