import React, { useState } from 'react';
import axios from 'axios';

export const Login = (props) => {

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
    })
    .catch(err=> {
      console.log(err)
      console.log("ERRORRRR")
    })
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


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
        <button className='btn btn-dark m-auto login-btn' type="submit">SIGN IN</button>
      </form>
    </div>
  );
};
