import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
// import MenteePortal from './menteePortal/MenteePortal';
import TopNav from './nav/TopNav';
import SideNav from './nav/SideNav';
import CreateAccount from './login/CreateAccount';
import MenteePortal from './menteePortal/MenteePortal';
import UserProfile from './userProfile/UserProfile';
import { ThemeProvider } from '@emotion/react';
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme} >
      <div className="App">
        <div>
          <TopNav />
          <SideNav />
        </div>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element = {<Login />}/>
            <Route path='/create-account' element = {<CreateAccount />}/>
            <Route path='/mentee-portal' element = {<MenteePortal />}/>
            <Route path='/profile' element = {<UserProfile />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>

  );
}

export default App;
