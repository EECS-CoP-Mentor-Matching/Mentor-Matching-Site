import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import TopNav from './nav/TopNav';
import CreateAccount from './createAccount/CreateAccount';
import MenteePortal from './menteePortal/MenteePortal';
import UpdateUserProfile from './updateUserProfile/UpdateUserProfile'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from "./theme";
import Home from './Home';
import Footer from './footer/Footer';
import PrivacyPolicy from './footer/privacyPolicy/PrivacyPolicy';
import TermsAndConditions from './footer/termsAndConditions/TermsAndConditions';
import ContactUs from './footer/ContactUs/ContactUs';
import MentorPortal from "./mentorPortal/MentorPortal";
import AdminPortal from './adminPortal/AdminPortal';
import ManageUserProfile from './adminPortal/components/manageUsers/ManageUserProfile';
import FeedbackPortal from './feedbackPortal/FeedbackPortal';
import UserServiceAgreement from './footer/userServiceAgreement/userServiceAgreement'; // Import the component for the user service agreement page
import { useEffect, useState } from 'react';
import { updateProfile } from '../redux/reducers/userProfileReducer';
import { useAppDispatch } from '../redux/hooks';
import authService from '../service/authService';
import userService from '../service/userService';
import DocuSignButton from './createAccount/components/DocuSign/DocuSignButton';
import VerifyEmail from "./createAccount/components/VerifyEmail";
import NewUserProfile from "./createAccount/components/newUserProfile/NewUserProfile";
import {initUserProfile, UserProfile} from "../types/userProfile";
import MenteeMessageForm from './menteePortal/components/menteeMessages/MenteeMessageForm';
import { Box, CircularProgress, Typography, Fade } from '@mui/material'; // Add these to your MUI imports

function App() {
  
// 1. Add a local loading state
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const currentUser = await authService.getSignedInUser();
        if (currentUser && currentUser.emailVerified) {
          let userProfile: UserProfile;
          try {
            userProfile = await userService.getUserProfile(currentUser.uid);
          } catch (error) {
            await authService.refreshToken();
            userProfile = await userService.getUserProfile(currentUser.uid);
          }
          dispatch(updateProfile(userProfile));
        }
      } catch (error) {
        console.error("Auth error", error);
      } finally {
        // 2. IMPORTANT: Set loading to false only after the attempt is done
        setIsAuthLoading(false);
      }
    };
    loadUserProfile();
  }, [dispatch]);

  // 3. BLOCK RENDERING until we know who the user is that way we avoid rendering wrong nav links
  if (isAuthLoading) {
  return (
    <ThemeProvider theme={theme}>
      <Fade in={true} timeout={800}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor="background.default"
        >
          {/* OSU Orange Spinner */}
          <CircularProgress size={60} thickness={4} sx={{ color: '#D73F09', mb: 3 }} />
          
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Loading Portals...
          </Typography>
        </Box>
      </Fade>
    </ThemeProvider>
  );
}


return (
    <ThemeProvider theme={theme} >
    <CssBaseline />
    <BrowserRouter>
        <div className="App">
        <TopNav />
          <div style={{ flex: 1 }}> {/* Wraps the main content */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/new-profile" element={<NewUserProfile />} />
            <Route path="/mentee-portal" element={<MenteePortal />} />
            <Route path="/send-message" element={<MenteeMessageForm />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="/admin-portal/edit-user/:userID" element={<ManageUserProfile />} />
            <Route path="/mentor-portal" element={<MentorPortal />} />
            <Route path="/update-profile" element={<UpdateUserProfile />} />
            <Route path="/feedback-portal" element={<FeedbackPortal />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/user-service-agreement" element={<UserServiceAgreement />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/docusign" element={<DocuSignButton />} />
          </Routes>
          </div>
        <Footer />
        </div>
    </BrowserRouter>
  </ThemeProvider>
);
}

export default App;