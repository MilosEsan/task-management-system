import React from 'react';
import { Header } from './components/Header';
// import { Balance } from './components/Balance';
// import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
// import { AddTransaction } from './components/AddTransaction';
import { ToDos } from './components/ToDos';
import { Users } from './components/Users';



// Microservices are an architectural and 
// organizational approach to software development where software 
// is composed of small independent services 
// that communicate over well-defined APIs. 
// These services are owned by small, self-contained teams.

// Services in a microservice architecture are often processes that communicate over 
// a network to fulfill a goal using technology-agnostic 
// protocols such as HTTP. Services are organized around business capabilities.



// import { GlobalProvider } from './context/GlobalState';

import {
  // createBrowserRouter,
  // RouterProvider,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// const router = createBrowserRouter([
//  <Route path='todos' element={<ToDos/>} exact/>
// ]);

import './App.css';
import TestRoute from './components/TestRoute';

function App() {
  return (
    <div className='container'>
      <Header/>
        <Routes>
          <Route exact path="/todos" element={<ToDos />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/users" element={<Users />} />
        </Routes>
    </div>
  );
}

export default App;
