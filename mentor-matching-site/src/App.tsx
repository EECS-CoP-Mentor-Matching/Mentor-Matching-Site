import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';

function App() {
  return (
    <div className="App">
      <div>
        This is the top level of the application.
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {<Login />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
