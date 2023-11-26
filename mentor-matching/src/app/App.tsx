import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import MenteePortal from './menteePortal/MenteePortal';

function App() {
  return (
    <div className="App">
      <div>
        This is the top level of the application.
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {<MenteePortal />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
