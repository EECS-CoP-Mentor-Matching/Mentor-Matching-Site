import React from 'react';
import './ContactUs.css';
import AuthenticatedView from "../../common/auth/AuthenticatedView";

const ContactUs = () => {
  return (
      <AuthenticatedView>
        <div className="contact-us-container">
          <h1>Contact Us</h1>
          <section>
            <h2>About Our Site</h2>
            <p>Welcome to the Mentor-Matching Site at Oregon State University. The EECS Community of Practice (CoP) Mentor Matching site at Oregon State University (OSU) aims to connect students with mentors who can guide them in both their technical and professional development. By aligning interests, demographics, and geographic locations, we strive to increase the success rates of these connections, assisting students in navigating their degree programs effectively.</p>
          </section>
          <h2>Meet Our Project Partner</h2>
            <p>Our project partner oversaw and guided this project. Feel free to reach out to her if you need help navigating the site:</p>
            <div className="partner-list">
              <p><strong>Dr Rachael Cate</strong> <a href="mailto:rachael.cate@oregonstate.edu">rachael.cate@oregonstate.edu</a></p>
            </div>
        </div>
      </AuthenticatedView>
  );
}

export default ContactUs;