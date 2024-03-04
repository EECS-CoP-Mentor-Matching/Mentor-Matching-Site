import React from 'react';
import './userServiceAgreement.css'; 

const userServiceAgreement = () => {
  return (
    <div className="user-service-agreement-container">
      <h1>User Service Agreement</h1>
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using our services, you agree to comply with this User Agreement, which may be updated from time to time.</p>
      </section>
      <section>
        <h2>2. Access to Services</h2>
        <p>Services are available to mentors who are at least 18 years of age.</p>
        <p>For mentees under 18, parental authorization may be required to ensure FERPA compliance and the protection of minors.</p>
      </section>
      <section>
        <h2>3. User Code of Conduct</h2>
        <p>Users are expected to respect the community and not engage in behavior that is insulting, defamatory, harassing, threatening, or discriminatory.</p>
        <p>Encouraging illegal activities or sharing personal information with third parties is strictly prohibited.</p>
      </section>
      <section>
        <h2>4. Registration to the Services</h2>
        <p>Upon successful matching, users may choose to share their names, contact information, and general location (via time zone) with their mentor or mentee.</p>
      </section>
      <section>
        <h2>5. Use of the Sites</h2>
        <p>You must not misuse our services in any way that prevents others from accessing them or that involves transmitting unlawful content.</p>
      </section>
      <section>
        <h2>6. Data Privacy and FERPA Compliance</h2>
        <p>We are committed to protecting the privacy of our users and adhering to FERPA regulations regarding the handling of educational records.</p>
      </section>
      <section>
        <h2>7. Right to Terminate Account</h2>
        <p>We reserve the right to terminate your access to the services if you fail to adhere to these terms.</p>
      </section>
    </div>
  );
}

export default userServiceAgreement;
