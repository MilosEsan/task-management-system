import React, { useState } from 'react';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";


export const Login = (props) => {

function showModal() {
  setIsModalOpen(true)
}

function hideModal() {
  setIsModalOpen(false)
}

function login(e) {
  e.preventDefault();
    let params = {
      email: email,
      password: password
    }
    axios.post(`/api/login`, params)
    .then(response=> {
      let token = localStorage.setItem('token', response.data.token);
      props.onLogin(token) 
      localStorage.setItem('user_name', response.data.user.name)
      localStorage.setItem('user_role', response.data.user.role)
    })
    .catch(err=> {
      console.error(err)
    })
  }

  function validateUsersCreation(pass, confirm_pass) {
    if (pass === confirm_pass) return true;
    else alert(alert('Your password doesnt match'))
  }

  function createUser(e) {
    e.preventDefault()
    let formData = new FormData();
    formData.append('name', e.target[0].value)
    formData.append('email', e.target[1].value)
    formData.append('password', e.target[3].value)

    if (validateUsersCreation(e.target[2].value, e.target[3].value)) {
      axios.post('/api/user/create', formData) 
      .then(alert(`User ${e.target[0].value} created successfully`))
      .catch(err=> console.error(err))
    } 
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openModal, setIsModalOpen] = useState(false);


  return (
    <div className='login-pg'>
      <h1 className='mb-5'>Task Manager</h1>
      <form className='d-flex flex-column' onSubmit={login}>
        <div>
          <label htmlFor="username">Email:</label>
          <input type="text" id="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='d-flex flex-column mb-4'>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='d-flex justify-content-center'>
          <button className='btn btn-dark m-auto login-btn' type="submit">SIGN IN</button>
          <button className='btn btn-dark m-auto login-btn' onClick={()=>showModal()}>SIGN UP</button>
        </div>
      </form>
      <Modal show={openModal} onHide={hideModal}>

        <Modal.Header style={{display: 'flex'}}>
            <button style={{cursor: 'pointer'}} className="close-modal-btn" onClick={hideModal}>X</button>
        </Modal.Header>

          <Modal.Body>
            <form onSubmit={createUser}>
                  <div className="form-group">
                    <label htmlFor="recipient-name" className="col-form-label">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name='name'
                      placeholder='ENTER NAME'
                    />
                  </div>
                  <div className="form-group mb-5 fg-fix">
                  <label htmlFor="recipient-name" className="col-form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name='email'
                      placeholder='ENTER EMAIL'
                    />
                  </div>
                  <div className="form-group fg-fix w-50">
                  <label htmlFor="recipient-name" className="col-form-label">Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name='password'
                      placeholder='ENTER PASSWORD'
                    />
                  </div>
                  <div className="form-group mb-5 fg-fix w-50">
                  <label htmlFor="recipient-name" className="col-form-label"></label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirm_password"
                      name='confirm_password'
                      placeholder='CONFIRM PASSWORD'
                    />
                  </div>

                  <div className='w-100 text-center'>

                    <button type='submit' className='btn btn-success'>
                      SAVE 
                    </button>
                  </div>
              </form>
          </Modal.Body>

        </Modal>
    </div>
  );
};
