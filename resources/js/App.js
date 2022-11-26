import React from 'react';
// import { Header } from './components/Header';
// import { Balance } from './components/Balance';
// import { IncomeExpenses } from './components/IncomeExpenses';
// import { TransactionList } from './components/TestRoute';
// import { AddTransaction } from './components/AddTransaction';
import { ToDos } from './components/ToDos';

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ToDos />} />
        <Route path="/trans" element={<TestRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
