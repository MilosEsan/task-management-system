import React, { useState, useEffect, useRef } from 'react';
import { privateApi } from '../API/api';
import SweetAlert2 from 'react-sweetalert2';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { CloseButton } from 'react-bootstrap';

export const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [swal, setSwal] = useState({})

  const selectedTaskTitle = useRef(null)
  const getTransactions = () => {
    privateApi.getTransactions()
        .then(response=> {
          setUsers(response.data.connected_data.users)
          setTasks(response.data.connected_data.tasks)
          setTransactions(response.data.transactions);
        })
        .then(()=>       console.log(transactions)
    );
  }

  function createTransaction(e) {
    e.preventDefault()
    const params = {}
    params.task_id = Number(e.target[0].value)
    params.to_user_id = Number(e.target[1].value != 0) ? Number(e.target[1].value) : null
    params.amount = Number(e.target[2].value) 
    params.text = e.target[3].value
    params.from_user_id = Number(localStorage.getItem('uid'))
    privateApi.createTransaction(params)
    .then((response)=> {
      getTransactions();
            setSwal({
              show: true,
              showCloseButton: true,
              title: 'Welcome!',
              icon: 'success',
              showConfirmButton: false,
              text: `Transaction for 
              "${selectedTaskTitle.current.selectedOptions[0].text}" 
              created successfully`,
            })

          setTimeout(() => {
            hideModal();
          }, 1000);
    })
    .catch(err=> {
        setSwal({
          show: true,
          showCloseButton: true,
          title: 'Error',
          icon: 'error',
          showConfirmButton: false,
          text: err.response.data.message,
        })
    })
  }

  function hideModal() {
    setShowModal(false)
  }

  useEffect(()=> {
        console.log(transactions)
    getTransactions();
  }, []);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={e => createTransaction(e)}>
            <select ref={selectedTaskTitle} onChange={(e)=> {}} className="form-select mb-2" aria-label="Default select example">
                      <option value="" hidden>Assign To The Task</option>
                      {
                        tasks.map(task=>(
                          <option value={task.id} key={task.id}>{task.title}</option>
                        ))
                      }
            </select>
            <select onChange={(e)=> {}} className="form-select mb-2" aria-label="Default select example">
                      <option value="" hidden>Assign To The Contractor ( optional )</option>
                      {
                        users.map(user=>(
                          <option value={user.id} key={user.id}>{user.name}</option>
                        ))
                      }
            </select>
            <select onChange={(e)=> {}} className="form-select mb-2" aria-label="Default select example">
                      <option value="" hidden>Set Amount ( fixed )</option>
                      <option value={100}>100 EUR</option>
                      <option value={200}>200 EUR</option>
                      <option value={300}>300 EUR</option>
                      <option value={400}>400 EUR</option>
                      <option value={500}>500 EUR</option>
                      <option value={600}>600 EUR</option>
            </select>
            <input
              type="text"
              placeholder='Description/Note'
              className="form-control mb-4"
              id="transaction_text"
              onChange={(e) => {}}
            />
            <Button type='submit' variant="primary">
              Save
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

              <div className='container'>
                <Button className='ml-auto mr-auto' onClick={() => setShowModal(true)}>Add new transaction</Button>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>Text/Description</th>
                            <th>Amount</th>
                            <th className='text-success'>Base Task</th>
                            <th>Sender</th>
                            <th>Recipient</th>
                            <th>Date Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transactions.length > 0 && transactions.map((transaction)=>
                                (
                                    <tr key={transaction.id}>
                                        <td>{transaction.text}</td>
                                        <td>{transaction.amount}.00 EUR</td>
                                        <td className='text-success'>{transaction.task && transaction.task.title}</td>
                                        <td style={{color: !transaction.senders.length && 'lightgray'}}>{transaction.senders.length && transaction.senders[0].name ? transaction.senders[0].name : 'N/A'}</td>
                                        <td style={{color: !transaction.recipients.length && 'lightgray'}}>{transaction.recipients.length && transaction.recipients[0].name ? transaction.recipients[0].name : 'N/A'}</td>
                                        <td>{transaction.created_at}</td>
                                    </tr>
                                )
                            ).reverse()
                        }
                    </tbody>
                </table>
            </div>
        <SweetAlert2 
        {...swal}
          didClose={() => setSwal({ show: false })}
        />
    </>
  )
}

export default TransactionList;

