
import React, { Component } from 'react';
import {privateApi} from '../API/api';
import axios from 'axios';

export class Users extends Component {
  constructor(props) {
    super(props);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
        privateApi.getUsers()
        .then(res=> {
            this.setState({
                users: res.data
            })
        })
    }

    render(){
        return (
            <div className='container'>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Date Added</th>
                            <th>Available Funds</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map((user)=>
                                (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.created_at}</td>
                                        <td>{user.balance} EUR</td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }

}
