import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
// import MenteePortal from './menteePortal/MenteePortal';
import TopNav from './nav/TopNav';
import SideNav from './nav/SideNav';
import CreateAccount from './createAccount/CreateAccount';
import MenteePortal from './menteePortal/MenteePortal';
import ViewUserProfile from './userProfile/ViewUserProfile';
import { ThemeProvider } from '@emotion/react';
import theme from "./theme";
import { useEffect, useState } from 'react';
import authService from '../service/authService';
import Home from './Home';
import MentorPortal from "./mentorPortal/MentorPortal";
import AdminPortal from './adminPortal/AdminPortal';
import NewUserProfile from './createAccount/newUserProfile/NewUserProfile';

function App() {
  const [signedin, setSignedIn] = useState(false);

  useEffect(() => {
    const checkSignedIn = async () => {
      const user = await authService.getSignedInUser();
      if (user !== null) {
        setSignedIn(true);
      }
    }
    checkSignedIn();
  });

  return (
    <ThemeProvider theme={theme} >
      <div className="App">
        <div>
          <TopNav signedIn={signedin} />
          <SideNav />
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element = {<Home/>} />
            <Route path="/login" element = {<Login setSignedIn={setSignedIn} />}/>
            <Route path="/create-account" element = {<CreateAccount setSignedIn={setSignedIn} />}/>
            <Route path="/mentee-portal" element = {<MenteePortal />}/>
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="/mentor-portal" element = {<MentorPortal />}/>
            <Route path="/profile" element = {<ViewUserProfile />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
