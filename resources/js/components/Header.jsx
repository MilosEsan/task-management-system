import React, { Component } from 'react';
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';

class Header extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);

    // State nije potreban jer ne koristimo lokalno stanje u ovoj komponenti
  }

  componentDidMount() {
    console.log('Header component mounted');
  }

  componentWillUnmount() {
    console.log('Header component unmounted');
  }

  logout() {
    axios.post('/api/logout')
      .then(() => {
        this.props.onLogout(); 
        console.log('logged out successfully');
        localStorage.removeItem('token');
      })
      .catch(err => console.log(err));
  }

  render() {
    const pathnameSplitted = this.props.location.pathname.split('/');

    return (
      <header className='mb-5 w-100 d-flex justify-content-around'>
        <div style={{ marginRight: 'auto' }}>
          <Link to={'/users'}>Users</Link>
          <Link style={{ marginLeft: '30px' }} to={'/tasks'}>Tasks</Link>
          <Link style={{ marginLeft: '30px' }} to={'/transactions'}>Transactions</Link>
        </div>
        <h2>
          {pathnameSplitted[1]?.toUpperCase() || ''}
        </h2>
        <button
          className='btn btn-warning'
          style={{ marginLeft: 'auto', width: '100px' }}
          onClick={this.logout}
        >
          logout
        </button>
      </header>
    );
  }
}

// Funkcionalni wrapper za koristenje useLocation u klasi komponenti header
const HeaderWithLocation = (props) => {
  const location = useLocation();
  return <Header {...props} location={location} />;
};

export default HeaderWithLocation;