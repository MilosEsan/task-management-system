import React, { useContext, useState, useEffect } from 'react';
import axios  from 'axios';
import Transaction from './Transaction'
import Modal from "react-bootstrap/Modal";

export default function TestRoute () {
    const [todos, setTodos] = useState([]);
    const [openModal, setIsModalOpen] = useState(false);

    const [todoName, setTodoName] = useState('')
    const [todoDetails, setTodoDetails] = useState('')

    const showModal = () => {
      setIsModalOpen(true)
    };

    const hideModal = () => {
      setIsModalOpen(false)
    };

    const saveTodo = (e) => {
      e.preventDefault()
      let params = {
        title: todoName,
        description: todoDetails
      }
      console.log(params)
      axios.post('/api/todos/', 
        params
      )
      .then(()=> {
        getTodos()
        hideModal()
      })
      .catch(err=> {
        console.log(err)
      })
    }

    const deleteTodo = (id) => {
      axios.delete('/api/todos/'+id)
      .then(()=> {
        getTodos()
      })
      .catch(err=> {
        console.log(err)
      })
    };
    
    const getTodos = () => {
      axios.get('/api/todos')
      .then(res=> {
        setTodos(res.data)
      })
    }

  useEffect(() => {

    getTodos();

  }, []);

  return (
    <div>
      <h3>Test Route Hello</h3>
    </div>
  )
}