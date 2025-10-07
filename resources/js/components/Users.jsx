
import React, { Component } from 'react';
import axios from 'axios';

export class Users extends Component {
  constructor(props) {
    super(props);
    this.getUsers = this.getUsers.bind(this);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
        axios.get('/api/users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    
            }
        })
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
