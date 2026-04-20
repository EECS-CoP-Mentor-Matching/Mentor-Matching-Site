import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

function Footer() {
  const userRole = useAppSelector(state => state.userProfile.userProfile?.preferences?.role);
  const isAdmin = userRole === 'Admin';
  const canLeaveFeedback = userRole === 'Mentor' || userRole === 'Mentee' || userRole === 'Both';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <Link to="/user-service-agreement">User Service Agreement</Link>
          <Link to="/terms-and-conditions">Terms and Conditions</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          {!isAdmin && <Link to="/contact-us">Contact Us</Link>}
          {canLeaveFeedback && (
            <Link to="/feedback-portal">Give us some Feedback!</Link>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
