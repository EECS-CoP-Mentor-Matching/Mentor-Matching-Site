import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
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
import UserServiceAgreement from './footer/userServiceAgreement/userServiceAgreement';
import { useEffect, useState } from 'react';
import { updateProfile } from '../redux/reducers/userProfileReducer';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import authService from '../service/authService';
import userService from '../service/userService';
import DocuSignButton from './createAccount/components/DocuSign/DocuSignButton';
import VerifyEmail from "./createAccount/components/VerifyEmail";
import NewUserProfile from "./createAccount/components/newUserProfile/NewUserProfile";
import { UserProfile } from "../types/userProfile";
import SendMessageForm from './common/messaging/SendMessageForm';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { AdminMatchRole, MatchRole } from '../types/matchProfile';
import TestMatchDbComponent from './adminPortal/components/testing/TestMatchDbComponent';
import TestMatchingComponent from './adminPortal/components/testing/TestMatchingComponent';
import ApprovePendingUsers from './adminPortal/components/manageUsers/ApprovePendingUsers';

// For product demonstrations (such as a school expo),
// allow certain components to run in "demo mode."
// This mode should only be used for demonstrations of the site,
// and normally should not be used in production.

const demoMode: boolean = true;

// --- PROTECTED ROUTE COMPONENT ---
interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: AdminMatchRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);
  const userRole = userProfile?.preferences?.role;

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = allowedRoles.includes(userRole as AdminMatchRole);

  if (!isAuthorized) {
    if (userRole === AdminMatchRole.admin) return <Navigate to="/admin-portal" replace />;
    if (userRole === AdminMatchRole.mentor) return <Navigate to="/mentor-portal" replace />;
    if (userRole === AdminMatchRole.mentee) return <Navigate to="/mentee-portal" replace />;
    if (userRole === AdminMatchRole.both) return <Navigate to="/mentee-portal" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
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
        setIsAuthLoading(false);
      }
    };
    loadUserProfile();
  }, [dispatch]);

  if (isAuthLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Fade in={true} timeout={800}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="background.default">
            <CircularProgress size={60} thickness={4} sx={{ color: '#D73F09', mb: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary' }}>Loading Portals...</Typography>
          </Box>
        </Fade>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="App">
          <TopNav />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/new-profile" element={<NewUserProfile demoMode={demoMode}/>} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/user-service-agreement" element={<UserServiceAgreement />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/docusign" element={<DocuSignButton />} />
              <Route path="/update-profile" element={<UpdateUserProfile />} />

              {/* Protected Admin Routes */}
              <Route path="/admin-portal" element={
                <ProtectedRoute allowedRoles={[AdminMatchRole.admin]}>
                  <AdminPortal />
                </ProtectedRoute>
              } />
              <Route path="/admin-portal/edit-user/:userID" element={
                <ProtectedRoute allowedRoles={[AdminMatchRole.admin]}>
                  <ManageUserProfile />
                </ProtectedRoute>
              } />
              <Route path="/admin-portal/pending-users" element={
                <ProtectedRoute allowedRoles={[AdminMatchRole.admin]}>
                  <ApprovePendingUsers />
                </ProtectedRoute>
              } />
              <Route path="/test-db" element={
                <ProtectedRoute allowedRoles={[AdminMatchRole.admin]}>
                  <TestMatchDbComponent />
                </ProtectedRoute>
              } />
              <Route path="/test-matching" element={
                <ProtectedRoute allowedRoles={[AdminMatchRole.admin]}>
                  <TestMatchingComponent />
                </ProtectedRoute>
              } />

              {/* Protected Mentee Routes */}
              <Route path="/mentee-portal" element={
                <ProtectedRoute allowedRoles={[AdminMatchRole.mentee, AdminMatchRole.both]}>
                  <MenteePortal />
                </ProtectedRoute>
              } />
              <Route path="/send-message" element={
                <ProtectedRoute allowedRoles={[AdminMatchRole.mentee, AdminMatchRole.mentor, AdminMatchRole.both]}>
                  <SendMessageForm />
                </ProtectedRoute>
              } />

              {/* Protected Mentor Routes */}
              <Route path="/mentor-portal" element={
                <ProtectedRoute allowedRoles={[AdminMatchRole.mentor, AdminMatchRole.both]}>
                  <MentorPortal />
                </ProtectedRoute>
              } />

              {/* Protected Feedback Route — Mentor, Mentee, and Both only */}
              <Route path="/feedback-portal" element={
                <ProtectedRoute allowedRoles={[AdminMatchRole.mentor, AdminMatchRole.mentee, AdminMatchRole.both]}>
                  <FeedbackPortal />
                </ProtectedRoute>
              } />

            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
