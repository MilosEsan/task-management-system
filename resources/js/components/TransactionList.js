import React, { useState, useEffect } from 'react';
import { Transaction } from './Transaction';
import axios from 'axios';
import {redirect, useNavigate} from 'react-router-dom';

import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {

  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate()

const getTransactions = () => {
  axios.get('/api/transactions') 
  .then(response=> {
    setTransactions(response.data)
  })
}

const addTransaction = () => {
  navigate('/add-transaction')
}

useEffect(()=> {
    getTransactions()
}, [])

  return (
    <>
      <ul className="list">
        {transactions.map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))}
      </ul>

      <button className='btn btn-dark' onClick={addTransaction}>Add Transaction</button>
    </>
  )
}
