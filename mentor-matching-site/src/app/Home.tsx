import LoadingMessage from "./common/forms/modals/LoadingMessage";
<<<<<<< HEAD
import { useAppSelector } from '../redux/hooks';


function Home() {
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);
  console.log('Redux state userProfile:', userProfile);
  return (
    <div className="Home">
      <h3>Welcome to MentorMatch</h3>
      <p>The guidance you need, just a click away!</p>
      <h3>Hello {userProfile?.contact?.displayName}</h3>
    </div>
  );
}
=======
import './Home.css';
import happyGroup from './happyGroup.png';
import fakeMentor from './fakeMentorImg.png';
import fakeMentee from './fakeMenteeImg.png';
// Functional Component Definition
const Home: React.FC = () => {
    // Placeholder image paths - replace these with your actual imported images or static paths
    const logoSrc = "osu-logo.png";

    return (
        <> {/* React Fragment to wrap all elements */}
            
            {/* Main Title */}
            <h1 className="main-title">EECS Mentor Match</h1>
>>>>>>> main

            {/* 2. WELCOME TEXT SECTION (White Background) */}
            <section className="intro-section">
                <img 
                    src={happyGroup} 
                    alt="Mentors and Mentees meeting" 
                    className="intro-image" 
                />
                
                <div className="welcome-text">
                    <h2>Welcome to Mentor Match</h2>
                    <p>It is our goal to provide students the opportunity to connect with mentors to create impactful relationships that will further their career goals and help them feel connected to their chosen industry.</p>
                </div>
            </section>

            {/* 3. START YOUR JOURNEY SECTION (Light Grey Background) */}
            <section className="call-to-action-section light-grey-bg">
                <a href="/create-account" className="start-journey-button">Start Your Journey</a>
            </section>

            {/* 4. REVIEWS SECTION (Two-Column Layout) */}
            <section className="reviews-section">
                <h2 className="section-heading">Meet Our Mentors & Mentees</h2>
                
                <div className="user-cards-container">
                    
                    {/* user Card 1 */}
                    <div className="user-card">
                        <img src={fakeMentor} alt="Dr. Anya Sharma" className="profile-pic" />
                        <h3>Dr. Anya Sharma</h3>
                        <p className="title">Senior Software Engineer, MadeUP Tech</p>
                        <div className="description-block">
                            <h4>Mentorship</h4>
                            <p>I appreciate being able to find and work with so many talented and motivated individuals.  It is wonderful to meet these students and help them build their careers towards our industry standards.</p>
                        </div>
                    </div>

                    {/* User Card 2 */}
                    <div className="user-card">
                        <img src={fakeMentee} alt="Hiroki Izami" className="profile-pic" />
                        <h3>Hiroki Izami</h3>
                        <p className="title">Software Engineering Student, Senior Year</p>
                        <div className="description-block">
                            <h4>Connection</h4>
                            <p>Mentor match connected me to real industry mentors.  I was able to learn more about Mobile App development and built my skills so that I could land an interview!</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer Spacer for bottom light grey area */}
            <footer className="footer-spacer light-grey-bg">
                {/* Footer Content */}
            </footer>

        </>
    );
};
export default Home;