import React from 'react';
import './PrivacyPolicy.css'; 
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <section>
        <h2>1. Introduction</h2>
        <p>Welcome to the Mentor-Matching Site at Oregon State University. We respect your privacy and are committed to protecting your personal information. This policy outlines our practices regarding the collection, use, and disclosure of your information through the use of our site, which is compliant with the Family Educational Rights and Privacy Act (FERPA) and the principles of Firebase Firestore security.</p>
      </section>
      <section>
        <h2>2. Information Collection</h2>
        <p>Personal Information: We collect personal information you provide to us when you register, including, but not limited to, name, email address, academic interests, technical and professional goals.</p>
        <p>Technical Information: Usage data such as IP address, browser type, and interaction with the site may be collected to improve service functionality.</p>
      </section>
      <section>
        <h2>3. Use of Information</h2>
        <p>Your information is used to facilitate the mentor-mentee matching process, provide support, improve our services, and comply with legal obligations. We also use information to maintain a secure and culturally inclusive environment.</p>
      </section>
      <section>
        <h2>4. Sharing and Disclosure</h2>
        <p>With Consent: We do not share personal information with third parties without your explicit consent, except as required by law.</p>
        <p>Legal Requirements: We may disclose information if legally required or to protect our rights and safety.</p>
        <p>Anonymized Data: Aggregate or anonymized data may be shared for research or statistical purposes without direct identification.</p>
      </section>
      <section>
        <h2>5. Data Security</h2>
        <p>We implement technical and organizational measures to protect your data against unauthorized access, alteration, and loss. However, no internet-based site can be 100% secure, so we encourage caution.</p>
      </section>
      <section>
        <h2>6. User Rights</h2>
        <p>Under FERPA, you have the right to access and control your personal information, including requesting amendment and limiting disclosure of directory information.</p>
      </section>
      <section>
        <h2>7. Third-Party Services</h2>
        <p>Our site may use third-party services for functionality (e.g., Firebase Firestore). While we ensure compliance with our privacy standards, their policies also apply to their services.</p>
      </section>
      <section>
        <h2>8. Changes to Privacy Policy</h2>
        <p>We may update this policy to reflect changes in our practices or legal requirements. Notice of amendments will be posted on our site.</p>
      </section>
      <section>
        <h2>9. Contact Information</h2>
        <p>For questions about this policy or your personal information, please contact xxx@xxxx.com.</p>
      </section>
      <section>
        <h2>10. Compliance with FERPA</h2>
        <p>We adhere to FERPA regulations, ensuring the confidentiality of educational records and allowing students to inspect and request amendments to their records.</p>
      </section>
      <section>
        <h2>11. Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar tracking technologies to track activity on our site and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. They are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service. This addition provides users with information about how cookies are used on the site and offers guidance on managing them, aligning with the practices outlined in the OSU Connections Privacy Policy.</p>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
