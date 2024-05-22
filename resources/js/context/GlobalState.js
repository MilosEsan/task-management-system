// import axios from 'axios';
// import React, { createContext, useReducer } from 'react';
// import AppReducer from './AppReducer';

// // Initial state
// const initialState = {
//   transactions: []
// }

// axios.get('/api/transactions') 
// .then(response=> {
//   initialState.transactions = response.data
//   console.log(initialState.transactions)
// })

// // Create context
// export const GlobalContext = createContext(initialState);

// // Provider component
// export const GlobalProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(AppReducer, initialState);

//   // Actions
//   function deleteTransaction(id) {
//     dispatch({
//       type: 'DELETE_TRANSACTION',
//       payload: id
//     });
//   }

//   function addTransaction(transaction) {
//     dispatch({
//       type: 'ADD_TRANSACTION',
//       payload: transaction
//     });
//   }

//   return (<GlobalContext.Provider value={{
//     transactions: state.transactions,
//     deleteTransaction,
//     addTransaction
//   }}>
//     {children}
//   </GlobalContext.Provider>);
// }
import React, { useState, useEffect, useContext } from "react";

export const GlobalContext = React.createContext();

export function GlobalProvider() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // async function fetchData() {
    //   const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    //   const json = await response.json();
    //   setData(json);
    //   setTimeout(() => {
    //     console.log('test:::')
    //     // console.log(data)
    //   }, 500);
    // }
    // fetchData();
  }, []);
}