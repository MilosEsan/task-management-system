import React from 'react';
import Header from './components/Header';
import {useState, useEffect} from 'react'
import { TransactionList } from './components/TransactionList';
import { Login } from './components/auth/Login';
import { AddTransaction } from './components/AddTransaction';
import  ToDos  from './components/ToDos';
import { Users } from './components/Users';


import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";

import './app.css';

function App() {

  const [token, setToken] = useState('');

  const handleLogin = (t) => {
    // Ovde možete izvršiti proveru korisničkog imena i lozinke
    // Na primer, možete proveriti u bazi podataka ili nekom drugom sistemu
    // U ovom primeru, proveravamo samo da li je korisničko ime 'admin' i lozinka 'password'
      setToken(t)

      console.log(token)
  };

  const handleLogout = () => {
    setToken(null)
  }

  useEffect(()=> {
    setToken(localStorage.getItem('token'))
  }, [token])

  return (
    <Router>
        <div className='container w-100' id='app-container' style={{ margin: 0, maxWidth: '100%', padding: '100px 0px 30px 0px', paddingBottom: '30px' }}>
          {token && <Header onLogout={handleLogout} />}
          <Routes>
                <Route path="/todos" element={token ?<ToDos /> : <Navigate to='/login'/>} />
                <Route path="/add-transaction" element={token ? <AddTransaction /> : <Navigate to='/login'/>} />
                <Route path="/transactions" element={token ? <TransactionList /> : <Navigate to='/login'/>} />
                <Route path="/users" element={token ? <Users /> : <Navigate to='/login'/>} />
                <Route path='/login' element={token ? <Navigate to='/todos'/> : <Login onLogin={handleLogin}/>}/>
          </Routes>
        </div>
    </Router>
  );
}

export default App;