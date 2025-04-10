import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const TransactionList = () => {

  const [transactions, setTransactions] = useState([]);

const getTransactions = () => {
  axios.get('/api/transactions',
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  ) 
  .then(response=> {
    setTransactions(response.data)
  })
}

useEffect(()=> {
    getTransactions()
}, [])

  return (
    <>
      <h1>Component in progress</h1>
    </>
  )
}

export default TransactionList;
