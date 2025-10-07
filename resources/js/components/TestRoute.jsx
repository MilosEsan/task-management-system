import React, { useContext, useState, useEffect } from 'react';
import axios  from 'axios';
import Transaction from './Transaction'
import Modal from "react-bootstrap/Modal";

export default function TestRoute () {
    const [tasks, setTasks] = useState([]);
    const [openModal, setIsModalOpen] = useState(false);

    const [taskName, setTaskName] = useState('')
    const [taskDetails, setTaskDetails] = useState('')

    const showModal = () => {
      setIsModalOpen(true)
    };

    const hideModal = () => {
      setIsModalOpen(false)
    };

    const saveTask = (e) => {
      e.preventDefault()
      let params = {
        title: taskName,
        description: taskDetails
      }
      console.log(params)
      axios.post('/api/tasks/', 
        params
      )
      .then(()=> {
        getTasks()
        hideModal()
      })
      .catch(err=> {
        console.log(err)
      })
    }

    const deleteTask = (id) => {
      axios.delete('/api/tasks/'+id)
      .then(()=> {
        getTasks()
      })
      .catch(err=> {
        console.log(err)
      })
    };
    
    const getTasks = () => {
      axios.get('/api/tasks')
      .then(res=> {
        setTasks(res.data)
      })
    }

  useEffect(() => {

    getTasks();

  }, []);

  return (
    <div>
      <h3>Test Route Hello</h3>
    </div>
  )
}