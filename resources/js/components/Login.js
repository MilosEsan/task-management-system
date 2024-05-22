// import React, { useContext, useState, useEffect } from 'react';
// import axios  from 'axios';
// // import Transaction from './Transaction'
// import Modal from "react-bootstrap/Modal";
// import { MainContext } from '../App';

// export const Login = ({logIn}) => {

// const [email, setEmail] = useState('');
// const [password, setPassword] = useState('');

// const [token, setToken] = useState('');

// function log(data) {
//   logIn(data)
// }

// function login(e) {
//   e.preventDefault();
//     let params = {
//       email: email,
//       password: password
//     }
//     axios.post(`/api/login`, params)
//     .then(response=> {
//       console.log(response.data.user.name) 
//       localStorage.setItem('user_name', response.data.user.name)
//       log(response.data.token)   

//     })
//     .catch(err=> {
//       console.log(err)
//       console.log("ERRORRRR")
//     })
//   }

//   const logout = async () => {
//     try {
//         await axios.post('/api/logout');
//         // Ovde možete obaviti dodatne radnje nakon odjavljivanja, npr. ažuriranje stanja komponente ili preusmeravanje korisnika na drugu stranicu
//         localStorage.removeItem('token')
//         } catch (error) {
//             console.error(error);
//         }
//     };

// useEffect(() => {
//   }, []);


//   return (
//     <div className=''>
//         <form onSubmit={login}>
//           <input onInput={e=> setEmail(e.target.value)} placeholder='email' type='email'/>
//           <input onInput={e=> setPassword(e.target.value)} placeholder='password' type='password'/>
//           <button type='submit'>
//             Login
//           </button>
//         </form>

//         <button onClick={logout} type='submit'>
//             Logout
//           </button>
//     </div>
//   )
// }
import React, { useState } from 'react';
import axios from 'axios';

export const Login = (props) => {

// const handleSubmit = (e) => {
//     e.preventDefault();
//     // Pozivamo funkciju za prijavljivanje sa unetim korisničkim imenom i lozinkom
//     onLogin(token);
// };

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
    <div>
      <h2>Prijavite se</h2>
      <form onSubmit={login}>
        <div>
          <label htmlFor="username">Korisničko ime:</label>
          <input type="text" id="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Lozinka:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Prijavite se</button>
      </form>
      {/* {isAuthenticated && <p>Uspešno ste prijavljeni!</p>} */}
    </div>
  );
};
