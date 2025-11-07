import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
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
import TermsAndConditions from './footer/termsAndConditions/TermsAndConditions';
import ContactUs from './footer/ContactUs/ContactUs';
import MentorPortal from "./mentorPortal/MentorPortal";
import AdminPortal from './adminPortal/AdminPortal';
import FeedbackPortal from './feedbackPortal/FeedbackPortal';
import UserServiceAgreement from './footer/userServiceAgreement/userServiceAgreement'; // Import the component for the user service agreement page
import { useEffect } from 'react';
import { updateProfile } from '../redux/reducers/userProfileReducer';
import { useAppDispatch } from '../redux/hooks';
import authService from '../service/authService';
import userService from '../service/userService';
import DocuSignButton from './createAccount/components/DocuSign/DocuSignButton';
import VerifyEmail from "./createAccount/components/VerifyEmail";
import NewUserProfile from "./createAccount/components/newUserProfile/NewUserProfile";
import {initUserProfile, UserProfile} from "../types/userProfile";

let userName; // Initialize user name, to be used to greet the user later

async function getUserInfo() {
  const currentUser = await authService.getSignedInUser();
      if (currentUser && currentUser.emailVerified) {
        let userProfile: UserProfile;
        try {
          userProfile = await userService.getUserProfile(currentUser.uid);
          userName = userProfile.contact.displayName;
          console.log(userName);
          return userProfile.contact.displayName;
        } catch (error) {
          // reload recently verified email token
          await authService.refreshToken()
          userProfile = await userService.getUserProfile(currentUser.uid);
          return userProfile;
        }
      }
    }


function App() {
  
  // set the user profile redux store on refresh
  const dispatch = useAppDispatch();
  useEffect(() => {
    // get the current signed in user
    const loadUserProfile = async () => {
      const currentUser = await authService.getSignedInUser();
      if (currentUser && currentUser.emailVerified) {
        let userProfile: UserProfile;
        try {
          userProfile = await userService.getUserProfile(currentUser.uid);
          userName = userProfile.contact.displayName;
          return userProfile;
        } catch (error) {
          // reload recently verified email token
          await authService.refreshToken()
          userProfile = await userService.getUserProfile(currentUser.uid);
        }
        dispatch(updateProfile(userProfile));
      }
    };
    loadUserProfile();
  }, [dispatch]);

//userName = getUserInfo();
//console.log("Username: " + userName)

  return (
    <ThemeProvider theme={theme} >
      <BrowserRouter>
        <div className="App">
          <TopNav />
          <SideNav />
          <Routes>
            <Route path="/" element={<Home name={"Charles Testing"} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/new-profile" element={<NewUserProfile />} />
            <Route path="/mentee-portal" element={<MenteePortal />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="/mentor-portal" element={<MentorPortal />} />
            <Route path="/update-profile" element={<UpdateUserProfile />} />
            <Route path="/feedback-portal" element={<FeedbackPortal />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/user-service-agreement" element={<UserServiceAgreement />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/docusign" element={<DocuSignButton />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;