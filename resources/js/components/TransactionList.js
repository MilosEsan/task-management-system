import React, { useState, useEffect } from 'react';
import { Transaction } from './Transaction';
import axios from 'axios';

import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {

  const [transactions, setTransactions] = useState([]);

const getTransactions = () => {
  axios.get('/api/transactions') 
  .then(response=> {
    setTransactions(response.data)
  })
}

useEffect(()=> {
    getTransactions()
}, [])

  return (
    <>
      <ul className="list">
        {transactions.map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))}
      </ul>
    </>
  )
}
