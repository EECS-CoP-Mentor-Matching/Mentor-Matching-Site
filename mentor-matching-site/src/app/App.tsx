import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import MenteePortal from './menteePortal/MenteePortal';
import TopNav from './nav/TopNav';
import SideNav from './nav/SideNav';

function App() {
  return (
    <div className="App">
      <div>
        <TopNav />
        <SideNav />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element = {<Login />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
