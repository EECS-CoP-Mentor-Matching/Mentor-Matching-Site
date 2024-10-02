import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import AuthenticatedView from '../common/auth/AuthenticatedView';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <Link to="/user-service-agreement">User Service Agreement</Link>
          <Link to="/terms-and-conditions">Terms and Conditions</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <AuthenticatedView>
            <Link to="/contact-us">Contact Us</Link>
            <Link to="/feedback-portal">Give us some Feedback!</Link>
          </AuthenticatedView>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
