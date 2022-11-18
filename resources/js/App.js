import React from 'react';
import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TestRoute';
import { AddTransaction } from './components/AddTransaction';
import { ToDos } from './components/ToDos';

import { GlobalProvider } from './context/GlobalState';

import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// const router = createBrowserRouter([
//  <Route path='todos' element={<ToDos/>} exact/>
// ]);

import './App.css';
import TestRoute from './components/TestRoute';

function App() {
  return (
    <GlobalProvider>
      <div className='container'>
        <BrowserRouter>
          <div className=''>
            {/* <Header /> */}
          </div>
          <Routes>
              <Route path='/' element={<ToDos/>}/>
              <Route path='/transactions' element={<TestRoute/>}/>

              {/* <Route path='/' component={Layout} />
                  <IndexRoute component={MyComponent} />
                  <Route path='/users' component={MyComponent}>
                      <Route path='user/:id' component={MyComponent} />
                      <Route path='*' component={UsersNotFound} />
                  </Route>
                  <Route path='/settings' component={MyComponent} />
                  <Route path='*' exact={true} component={GenericNotFound} />
              </Route> */}

            </Routes>
        </BrowserRouter>
      </div>
    </GlobalProvider>
  );
}

export default App;
