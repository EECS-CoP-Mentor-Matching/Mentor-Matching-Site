import React from 'react';
import './Footer.css'; 
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <a href="/User Service Agreement">User Service Agreement</a>
          <a href="/Terms and Conditions">Terms and Conditions</a>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
