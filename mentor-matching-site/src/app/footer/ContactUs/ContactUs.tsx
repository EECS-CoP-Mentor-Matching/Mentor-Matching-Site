import React from 'react';
import './ContactUs.css'; 

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <h1>Contact Us</h1>
      <section>
        <h2>About Our Site</h2>
        <p>Welcome to the Mentor-Matching Site at Oregon State University. The EECS Community of Practice (CoP) Mentor Matching site at Oregon State University (OSU) aims to connect students with mentors who can guide them in both their technical and professional development. By aligning interests, demographics, and geographic locations, we strive to increase the success rates of these connections, assisting students in navigating their degree programs effectively.</p>
      </section>
      <section>
        <h2>Meet Our Developers</h2>
        <p>Our site is developed by a dedicated team at OSU. Feel free to contact any of our team members:</p>
        <div className="developer-list">
          <p><strong>Philip Tasabia</strong> <a href="mailto:tasabiap@oregonstate.edu">tasabiap@oregonstate.edu</a></p>
          <p><strong>Caymene Jones</strong> <a href="mailto:jonescay@oregonstate.edu">jonescay@oregonstate.edu</a></p>
          <p><strong>Hana Alizai</strong> <a href="mailto:alizaih@oregonstate.edu">alizaih@oregonstate.edu</a></p>
          <p><strong>Ariel Meshorer</strong> <a href="mailto:meshorea@oregonstate.edu">meshorea@oregonstate.edu</a></p>
        </div>
      </section>
      <h2>Meet Our Project Partner</h2>
        <p>Our project partner oversaw and guided this project. Feel free to reach out to her if you need help navigating the site:</p>
        <div className="partner-list">
          <p><strong>Dr Rachael Cate</strong> <a href="mailto:rachael.cate@oregonstate.edu">rachael.cate@oregonstate.edu</a></p>
        </div>
    </div>
  );
}

export default ContactUs;