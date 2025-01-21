import React from 'react'
import { Link, Navigate, useLocation } from "react-router-dom"
import axios  from 'axios';

export const Header = ({onLogout}) => {

  // LINK IMPORT AND check

  const logout = () => {
         axios.post('/api/logout')
         .then(()=> {
          onLogout()
          console.log('logged out successfully')
          localStorage.removeItem('token')
         })
         .catch(err=>console.log(err))
        // Ovde možete obaviti dodatne radnje nakon odjavljivanja, npr. ažuriranje stanja komponente ili preusmeravanje korisnika na drugu stranicu
    };

  const location = useLocation();

  let pathnameSplitted = location.pathname.split('/')

  // console.log('hash', location.hash);
  // console.log('pathname', location.pathname);
  // console.log('search', location.search);

  return (
    <header className='mb-5 w-100 d-flex justify-content-around'>
        <div style={{marginRight: 'auto'}}>
          <Link to={'/users'}>Users</Link>
          <Link style={{marginLeft: '30px'}} to={'/todos'}>Todos</Link>
          <Link style={{marginLeft: '30px'}} to={'/transactions'}>Trasactions</Link>
        </div>
        <h2>
          {pathnameSplitted[1].toUpperCase()}
        </h2>

      <button style={{marginLeft: 'auto'}} onClick={logout}>
          logout
      </button>
    </header>
  )
}
