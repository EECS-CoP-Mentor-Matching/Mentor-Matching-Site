import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
// import MenteePortal from './menteePortal/MenteePortal';
import TopNav from './nav/TopNav';
import SideNav from './nav/SideNav';
import CreateAccount from './createAccount/CreateAccount';
import MenteePortal from './menteePortal/MenteePortal';
import UpdateUserProfile from './updateUserProfile/UpdateUserProfile'
import { ThemeProvider } from '@emotion/react';
import theme from "./theme";
import { useEffect, useState } from 'react';
import authService from '../service/authService';
import Home from './Home';
import Footer from '../Footer.js';
import MentorPortal from "./mentorPortal/MentorPortal";
import AdminPortal from './adminPortal/AdminPortal';
import FeedbackPortal from './feedbackPortal/FeedbackPortal';
import ReduxProvider from '../redux/store';

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
      <ReduxProvider>
        <div className="App">
          <div>
            <TopNav />
            <SideNav />
          </div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/mentee-portal" element={<MenteePortal />} />
              <Route path="/admin-portal" element={<AdminPortal />} />
              <Route path="/mentor-portal" element={<MentorPortal />} />
              <Route path="/update-profile" element={<UpdateUserProfile />} />
              <Route path="/feedback-portal" element={<FeedbackPortal userEmail={"temp"}/>} />
            </Routes>
          </BrowserRouter>
          <Footer />
        </div>
      </ReduxProvider>
    </ThemeProvider>
  );
}

export default App;
