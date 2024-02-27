import React from 'react';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <a href="/User Service Agreement">User Service Agreement</a>
          <a href="/Terms and Conditions">Terms and Conditions</a>
          <a href="/Privacy Policy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
