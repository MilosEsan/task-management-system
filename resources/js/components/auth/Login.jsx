import React, { useState } from 'react';
import axios from 'axios';
import { publicApi } from '../../API/api';
import Modal from "react-bootstrap/Modal";
import SweetAlert2 from 'react-sweetalert2';



export const Login = (props) => {

function showModal() {
  setIsModalOpen(true)
}

function hideModal() {
  setIsModalOpen(false)
}

function makeLogin(email, password) {
    publicApi.login(email, password)
    .then(response=> {
      let token = localStorage.setItem('token', response.data.token);
      props.onLogin(token) 
      localStorage.setItem('user_name', response.data.user.name)
      localStorage.setItem('user_role', response.data.user.role)
      localStorage.setItem('uid', response.data.user.id)
    })
    .catch(err=> {
      console.error(err)
      setSwal({
        show: true,
        title: 'Error',
        icon: 'error',
        showConfirmButton: false,
        text: err.response.data.message,
        })

        setTimeout(() => {
          setSwal({ swal: {} });
        }, 5000);
    })
}

function login(e) {
  e.preventDefault();
    let params = {
      email: email,
      password: password
    }
    makeLogin(params.email, params.password)
  }

  function validateUsersCreation(pass, confirm_pass) {
    if (pass === confirm_pass) return true;
    else {
        setSwal({
          show: true,
          title: 'Error',
          icon: 'error',
          showConfirmButton: false,
          text: "Your password doesn't match with the confirmation",
        })

        setTimeout(() => {
          setSwal({ swal: {} });
        }, 5000);
    }
  }

  function createUser(e) {
    e.preventDefault()
    let formData = new FormData();
    formData.append('name', e.target[0].value)
    formData.append('email', email)
    formData.append('password', e.target[3].value)

    if (validateUsersCreation(e.target[2].value, e.target[3].value)) {
      publicApi.signUp(formData) 
      .then(()=> {
            setIsModalOpen(false)
            setSwal({
              show: true,
              title: 'Welcome!',
              icon: 'success',
              showConfirmButton: false,
              text: `User ${e.target[0].value} created successfully`,
            })
            setTimeout(() => {
              makeLogin(email, password)
              setSwal({ swal: {} });
            }, 3000);
    })
      .catch(err=> {
          setSwal({
            show: true,
            title: 'Error',
            icon: 'error',
            showConfirmButton: false,
            text: err.response.data.message,
          })

          setTimeout(() => {
            setSwal({ swal: {} });
          }, 5000);
      })
    } 
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openModal, setIsModalOpen] = useState(false);
  const [swal, setSwal] = useState({})


  return (
    <div className='login-pg d-flex flex-column align-items-center'>
      <h1 className='mb-5'>Task Manager</h1>
      <form className='d-flex flex-column' onSubmit={login}>
        <div>
          <label htmlFor="username">Email:</label>
          <input type="text" id="username" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div className='d-flex flex-column mb-4'>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <div className='d-flex justify-content-center'>
          <button className='btn btn-dark m-auto login-btn' type="submit">SIGN IN</button>
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
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
        <button className='btn btn-light ml-auto mr-auto login-btn' onClick={()=>showModal()}>REGISTER</button>
                <SweetAlert2 
                  {...swal}
                    didClose={() => setSwal({ show: false })}
                />
    </div>
  );
};
