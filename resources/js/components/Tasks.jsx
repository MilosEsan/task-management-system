import React from 'react';
import axios  from 'axios';
import SweetAlert2 from 'react-sweetalert2';
import Modal from "react-bootstrap/Modal";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backlog: [],
      in_progress: [],
      completed: [],
      editId: null,
      openModal: false,
      isEditing: false,
      taskName: '',
      assignedUser: null,
      taskDetails: '',
      error: '',
      record_count: 0,
      userRole: '',
      users: [],
      swal: {}
    }
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.saveTask = this.saveTask.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.setProgress = this.setProgress.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.assignUser = this.assignUser.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.processPostRequest = this.processPostRequest.bind(this);
    this.setConfirmation = this.setConfirmation.bind(this);
  }

  showModal() {
    this.setState({ openModal: true });
    if (!this.state.isEditing) {
      this.setState({
        taskName: '',
        taskDetails: '',
        assignedUser: null
      });
    }
  }

  hideModal() {
    this.setState({ openModal: false });
    if (this.state.editId) this.getTasks(null);
    this.setState({
      isEditing: false,
      editId: null,
      error: ''
    });
  }

  saveTask(e) {
    let params = {
      title: this.state.taskName,
      description: this.state.taskDetails,
      created_by: localStorage.getItem("user_name"),
      assigned_to: Number(e.target[0].value) !== 0 ? Number(e.target[0].value) : null
    }
    axios.post('/api/tasks/',
      params,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      }
    )
    .then((response)=> {
      this.getTasks(null);
      this.hideModal();
    })
    .catch(err=> {
      this.setState({ error: err.response.data.message });
    })
  }

  saveEdit(e) {
    axios.put('/api/tasks/'+this.state.editId,
      {
        "title": this.state.taskName,
        "description": this.state.taskDetails
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      }
    )
    .then(res=> {
      this.hideModal();
    })
    .catch(err=> {
      console.log('test err: ', err);
    })
  }

  setProgress(operator, id, progress) {
    let newCompleted = progress;

    if (operator === '+' && newCompleted < 2) {
      newCompleted = newCompleted + 1;
    } else if (operator === '-' && newCompleted > 0) {
      newCompleted = newCompleted - 1;
    } else {
      return;
    }

    axios.put(`/api/tasks/${id}`,
      {
        progress: newCompleted,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      }
    )
    .then(()=> {
      setTimeout(() => {
        this.getTasks(null);
      }, 100);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  deleteTask(id, title) {
    this.setState({
      swal: {
        title: `Do you want to delete the task <b style="color: #b07e09">"${title}"</b>?`,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        icon: 'warning',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        },
        show: true,
        onConfirm: () => {
          axios.delete('/api/tasks/'+id,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
              }
            }
          )
          .then(res=> {
            this.hideModal();
            this.getTasks(null);

            this.setConfirmation(`Task <b>"${title}"</b> deleted !`);
          })
          this.setState({ swal: {} });
        },
        onResolve: () => {
          this.setState({ swal: {} });
        }
      }
    })
  }

  editTask(id) {
    this.setState(
      { editId: id, isEditing: true },
      () => {
        this.showModal();
        this.getTasks(id);
      }
    );
  }

  assignUser(id, taskId) {
    axios.put(`/api/tasks/${taskId}`, {
      assigned_to: Number(id)
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      }
    }
  )
    .then(()=> {
      fetch('/api/users/'+Number(id), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      })
      .then(res=> res.json())
      .then(data=> {
          this.setState({
            swal: {
                show: true,
                title: 'Task Reassigned',
                text: `New assignee: ${data.name}`,
                onConfirm: () => {
                  this.setState({ swal: {} });
                  this.hideModal();
                },
            }
        });
        this.getTasks(taskId);
      })
    })
    .catch(error=> console.log(error))
  }

  getTasks(id) {
    axios.get(id ? `/api/tasks/${id}` : '/api/tasks',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      }
    )
    .then(res=> {
      console.log('res: ', res);
      if (id) {
        this.setState({
          taskName: res.data.title,
          taskDetails: res.data.description,
          assignedUser: res.data.user?.name || null
        });
      } else {
        this.setState({
          backlog: res.data.backlog,
          in_progress: res.data.in_progress,
          completed: res.data.completed,
          record_count: res.data.record_count
        });
      }
    })
  }

  processPostRequest(e) { 
    e.preventDefault();
    if (!this.state.editId) {
      this.saveTask(e);
    } else {
      setTimeout(() => {
        this.saveEdit(this.state.editId);
      }, 500);
    }
  }

  setConfirmation(msg) {
    this.setState({
      swal: {
        icon: 'success',
        title: msg,
        show: true,
        confirmButtonText: 'OK',
        onConfirm: () => this.setState({ swal: {} }),
        didClose: () => this.setState({ swal: {} }),
      }
    })
  }

  componentDidMount() {
    this.setState({ userRole: localStorage.getItem('user_role') });
    this.getTasks(null);
    
    if (localStorage.getItem('user_role')==='super_admin') {
      axios.get('/api/users', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      })
      .then((res)=> {
        this.setState({ users: res.data });
      })
    }
  }

  render() {
    return (
      <div className='d-flex p-3 justify-content-between flex-column' style={this.state.openModal ? {display: 'none'} : null}>
          <div className="d-flex mb-5 justify-content-between w-100 align-items-center">
            <p className={this.state.record_count > 15 ? 'text-danger' : 'text-warning'}>
              The number of records for today: {this.state.record_count} ({20 - this.state.record_count} places left)
            </p>
            <button style={{width: '250px', height: '40px'}} type="button w-25" className="btn btn-dark" onClick={() => { this.showModal(); this.setState({ isEditing: false });}}>
              Add Task
            </button>
          </div>
          <div className='task_grid'>
            <div>
              <h2 className='text-warning'>BACKLOG</h2>
              <ul className="list mb-1">
                {this.state.backlog.length ? this.state.backlog.map((task, index) => (
                  <li key={task.id}>
                  <div style={{gap: '50px'}} className='d-flex flex-row w-100 justify content-between'>
                      <h1 className='task-title'>
                        {task.title}
                      </h1>
                      {this.state.userRole==='super_admin' && 
                      <div className='mb-2'>
                        <i className='mr-1'>Set Progress: </i>
                        {task.progress > 0 &&                  
                          <button type="button" onClick={() => this.setProgress('-', task.id, task.progress)}>{'<'}</button>
                        }
                        {task.progress < 2 &&
                          <button style={{marginLeft: '3px'}} type="button" onClick={() => this.setProgress('+', task.id, task.progress)}> {'>'} </button> 
                        }
                        <br></br>
                        {
                          task.progress === 0 ? (
                            <small className="badge badge-warning">BACKLOG</small>
                          ) : task.progress === 1 ? (
                            <small className="badge badge-info">IN PROGRESS</small>
                          ) : (
                            <small className="badge badge-success">COMPLETED</small>
                          )
                        }
                      </div>}
                  </div>
                    <div className="d-flex justify-content-between created-assigned">
                      {task.created_by && <p><i>Created By:</i> {task.created_by}</p>}
                      {task.user && (
                          <p className='assigned_to'><i>Assigned To:</i> {task.user.name || 'Loading...'}</p>
                        )}
                    </div>
                  <p className='text-center mb-3'>{task.description}</p>
                      <div className='d-flex justify-content-center'>
                        <button onClick={() => this.deleteTask(task.id, task.title)} className="delete-btn">delete</button>
                        <button onClick={() => this.editTask(task.id)} className="edit-btn">edit</button>
                      </div>
                  </li>
                  )).reverse(): null}
              </ul>
            </div>
            <div>
              <h2 className='text-info'>IN PROGRESS</h2>
                <ul className="list mb-1">
                  {this.state.in_progress.length ? this.state.in_progress.map((task, index) => (
                    <li key={task.id}>
                    <div style={{gap: '50px'}} className='d-flex flex-row w-100 justify content-between'>
                      <h1 className='task-title'>
                        {task.title}
                      </h1>
                      {this.state.userRole==='super_admin' && 
                      <div className='mb-2'>
                        <i className='mr-1'>Set Progress: </i>
                        {task.progress > 0 &&                  
                          <button type="button" onClick={() => this.setProgress('-', task.id, task.progress)}>{'<'}</button>
                        }
                        {task.progress < 2 &&
                          <button style={{marginLeft: '3px'}} type="button" onClick={() => this.setProgress('+', task.id, task.progress)}> {'>'} </button> 
                        }
                        <br></br>
                        {
                          task.progress === 0 ? (
                            <small className="badge badge-warning">BACKLOG</small>
                          ) : task.progress === 1 ? (
                            <small className="badge badge-info">IN PROGRESS</small>
                          ) : (
                            <small className="badge badge-success">COMPLETED</small>
                          )
                        }
                      </div>}
                  </div>
                    <div className="d-flex justify-content-between created-assigned">
                      {task.created_by && <p><i>Created By:</i> {task.created_by}</p>}
                      {task.user && (
                          <p className='assigned_to'><i>Assigned To:</i> {task.user.name || 'Loading...'}</p>
                        )}
                    </div>
                  <p className='text-center mb-3'>{task.description}</p>
                      <div className='d-flex justify-content-center'>
                        <button onClick={() => this.deleteTask(task.id, task.title)} className="delete-btn">delete</button>
                        <button onClick={() => this.editTask(task.id)} className="edit-btn">edit</button>
                      </div>
                  </li>
                  )).reverse(): null}
              </ul>
            </div>
            <div>
              <h2 className='text-success'>COMPLETED</h2>
                <ul className="list mb-1">
                  {this.state.completed.length ? this.state.completed.map((task, index) => (
                    <li key={task.id}>
                    <div style={{gap: '50px'}} className='d-flex flex-row w-100 justify content-between'>
                      <h1 className='task-title'>
                        {task.title}
                      </h1>
                      {this.state.userRole==='super_admin' && 
                      <div className='mb-2'>
                        <i className='mr-1'>Set Progress: </i>
                        {task.progress > 0 &&                  
                          <button type="button" onClick={() => this.setProgress('-', task.id, task.progress)}>{'<'}</button>
                        }
                        {task.progress < 2 &&
                          <button style={{marginLeft: '3px'}} type="button" onClick={() => this.setProgress('+', task.id, task.progress)}> {'>'} </button> 
                        }
                        <br></br>
                        {
                          task.progress === 0 ? (
                            <small className="badge badge-warning">BACKLOG</small>
                          ) : task.progress === 1 ? (
                            <small className="badge badge-info">IN PROGRESS</small>
                          ) : (
                            <small className="badge badge-success">COMPLETED</small>
                          )
                        }
                      </div>}
                  </div>
                    <div className="d-flex justify-content-between created-assigned">
                      {task.created_by && <p><i>Created By:</i> {task.created_by}</p>}
                      {task.user && (
                          <p className='assigned_to'><i>Assigned To:</i> {task.user.name || 'Loading...'}</p>
                        )}
                    </div>
                  <p className='text-center mb-3'>{task.description}</p>
                      <div className='d-flex justify-content-center'>
                        <button onClick={() => this.deleteTask(task.id, task.title)} className="delete-btn">delete</button>
                        <button onClick={() => this.editTask(task.id)} className="edit-btn">edit</button>
                      </div>
                  </li>
                  )).reverse(): null}
              </ul>
            </div>
          </div>
          <Modal show={this.state.openModal} onHide={this.hideModal}>
          <Modal.Header style={{display: 'flex'}}>
              <button style={{cursor: 'pointer'}} className="close-modal-btn" onClick={this.hideModal}>X</button>
          </Modal.Header>

          <Modal.Body>
            {
              this.state.userRole==='super_admin' && 
              <div>
                {this.state.editId &&
                  <select onChange={(e)=> {this.assignUser(e.target.value, this.state.editId)}} className="form-select" aria-label="Default select example">
                    <option value="" hidden>Assign a team member</option>
                    {
                      this.state.users.map(user=>(
                        <option value={user.id} key={user.id}>{user.name}</option>
                      ))
                    }
                  </select>}
                {(this.state.assignedUser && this.state.editId) && <div style={{fontWeight:'bold', color:'purple'}} className='text-center'>Assigned to: {this.state.assignedUser}</div>}
              </div>
            }
                <form onSubmit={this.processPostRequest}>
                  {(this.state.userRole==='super_admin' && !this.state.editId)&&
                    <div className='form-group'>
                      <select className="form-select" aria-label="Default select example">
                        <option value="" hidden>Add a team member</option>
                        {
                          this.state.users.map(user=>(
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
                      id="task_name"
                      onChange={(e) => this.setState({ taskName: e.target.value})}
                      value={this.state.taskName ?? ''}
                    />
                  </div>
                  <div className="form-group mb-5 fg-fix">
                    <label htmlFor="message-text" className="col-form-label">Description:</label>
                    <textarea
                      rows="6"
                      className="form-control"
                      id="message-text"
                      onChange={(e) => this.setState({ taskDetails: e.target.value})}
                      value={this.state.taskDetails ?? ''}
                    />
                  </div>

                  <div className='w-100 text-center'>

                    <button type='submit' className='btn btn-success'>
                      SAVE 
                    </button>
                      <br/>
                    {this.state.error.length > 0 &&
                        <small className='text-danger'>{this.state.error}</small>
                      }
                  </div>
                </form>
          </Modal.Body>

        </Modal>
        <SweetAlert2 {...this.state.swal} />
      </div>
    )
  }
}

export default Tasks;