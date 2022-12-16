import React from 'react'
import { Link, useLocation } from "react-router-dom"

export const Header = () => {

  // LINK IMPORT AND check

  const location = useLocation();

  let pathnameSplitted = location.pathname.split('/')

  console.log('hash', location.hash);
  console.log('pathname', location.pathname);
  console.log('search', location.search);

  return (
    <div className='mb-5'>
      <Link to={'/users'}>Users</Link>
      <Link style={{marginLeft: '30px'}} to={'/todos'}>Todos</Link>
      <Link style={{marginLeft: '30px'}} to={'/transactions'}>Trasactions</Link>
      <h2>
        {pathnameSplitted[1].toUpperCase()}
      </h2>
    </div>
  )
}
