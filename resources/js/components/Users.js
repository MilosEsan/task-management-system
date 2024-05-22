import React, {useState, useEffect } from 'react';
import axios  from 'axios';
// import Transaction from './Transaction'
// import Modal from "react-bootstrap/Modal";

export const Users = () => {

const [users, setUsers] = useState([]);

const getUsers = () => {
    axios.get('/api/users')
    .then(res=> {
        setUsers(res.data)
    })
}

useEffect(() => {
    console.log('::')
    console.log(localStorage.getItem("user_name"))
    getUsers();

  }, []);


  return (
    <div className='container'>
        {/* <button onClick={login} className='btn btn-light'>Login</button> */}
        <table className="table">
            <thead className="thead-dark">
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date Added</th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((user)=>
                        (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.created_at}</td>
                            </tr>
                        )
                    )
                }
            </tbody>
        </table>
    </div>
  )
}