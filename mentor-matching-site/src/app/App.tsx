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
import Home from './Home';
import Footer from './footer/Footer';
import PrivacyPolicy from './footer/privacyPolicy/PrivacyPolicy';
import MentorPortal from "./mentorPortal/MentorPortal";
import AdminPortal from './adminPortal/AdminPortal';
import FeedbackPortal from './feedbackPortal/FeedbackPortal';
import ReduxProvider from '../redux/store';


function App() {
  return (
    <ThemeProvider theme={theme} >
      <ReduxProvider>
        <BrowserRouter>
          <div className="App">
            <TopNav />
            <SideNav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/mentee-portal" element={<MenteePortal />} />
              <Route path="/admin-portal" element={<AdminPortal />} />
              <Route path="/mentor-portal" element={<MentorPortal />} />
              <Route path="/update-profile" element={<UpdateUserProfile />} />
              <Route path="/feedback-portal" element={<FeedbackPortal userEmail={"temp"} />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </ReduxProvider>
    </ThemeProvider>
  );
}

export default App;