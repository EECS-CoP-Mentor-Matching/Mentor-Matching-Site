import React, { useEffect, useState } from 'react';
import './Home.css';
import happyGroup from './happyGroup.png';
import fakeMentor from './fakeMentorImg.png';
import fakeMentee from './fakeMenteeImg.png';
import feedbackService, { FeedbackData } from './../service/feedbackService';
import { icons } from './../icons/icons';

const Home: React.FC = () => {
    const [approvedReviews, setApprovedReviews] = useState<FeedbackData[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const reviews = await feedbackService.fetchApprovedReviews();
                setApprovedReviews(reviews);
            } catch (error) {
                console.error('Error loading approved reviews:', error);
            }
            setLoadingReviews(false);
        };
        loadReviews(); // ← ADD THIS LINE
    }, []);

    // Show two cards at a time, cycle through pairs
    const totalPairs = Math.ceil(approvedReviews.length / 2);
    const visibleReviews = approvedReviews.slice(carouselIndex * 2, carouselIndex * 2 + 2);

    const handlePrev = () => setCarouselIndex(i => Math.max(i - 1, 0));
    const handleNext = () => setCarouselIndex(i => Math.min(i + 1, totalPairs - 1));

    const hasRealReviews = !loadingReviews && approvedReviews.length > 0;

    return (
        <>
            {/* Main Title */}
            <h1 className="main-title">EECS Mentor Match</h1>

            {/* 2. WELCOME TEXT SECTION */}
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

            {/* 3. START YOUR JOURNEY SECTION */}
            <section className="call-to-action-section light-grey-bg">
                <a href="/create-account" className="start-journey-button">Start Your Journey</a>
            </section>

            {/* 4. REVIEWS SECTION */}
            <section className="reviews-section">
                <h2 className="section-heading">
                    {hasRealReviews ? 'What Our Community Is Saying' : 'Meet Our Mentors & Mentees'}
                </h2>

                {/* Real reviews carousel */}
                {hasRealReviews && (
                    <>
                        <div className="user-cards-container">
                            {visibleReviews.map((review, index) => (
                                <div className="user-card" key={review.id || index}>
                                    {review.includeProfilePicture && review.snapshotPictureUrl ? (
                                        <img
                                            src={review.snapshotPictureUrl}
                                            alt={review.snapshotName}
                                            className="profile-pic"
                                        />
                                    ) : (
                                        <div className="profile-pic profile-pic-default">
                                            {icons.emptyProfileImage}
                                        </div>
                                    )}
                                    <h3>{review.snapshotName || 'Anonymous'}</h3>
                                    {review.snapshotRoleInfo && (
                                        <p className="title">{review.snapshotRoleInfo}</p>
                                    )}
                                    <div className="description-block">
                                        <p>"{review.feedbackContent}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Carousel controls — only shown if more than 2 reviews */}
                        {approvedReviews.length > 2 && (
                            <div className="carousel-controls">
                                <button
                                    className="carousel-btn"
                                    onClick={handlePrev}
                                    disabled={carouselIndex === 0}
                                >
                                    ← Previous
                                </button>
                                <span className="carousel-indicator">
                                    {carouselIndex + 1} / {totalPairs}
                                </span>
                                <button
                                    className="carousel-btn"
                                    onClick={handleNext}
                                    disabled={carouselIndex === totalPairs - 1}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Fallback fake cards — shown until real reviews exist */}
                {!hasRealReviews && !loadingReviews && (
                    <div className="user-cards-container">
                        <div className="user-card">
                            <img src={fakeMentor} alt="Dr. Anya Sharma" className="profile-pic" />
                            <h3>Dr. Anya Sharma</h3>
                            <p className="title">Senior Software Engineer, MadeUP Tech</p>
                            <div className="description-block">
                                <h4>Mentorship</h4>
                                <p>I appreciate being able to find and work with so many talented and motivated individuals. It is wonderful to meet these students and help them build their careers towards our industry standards.</p>
                            </div>
                        </div>
                        <div className="user-card">
                            <img src={fakeMentee} alt="Hiroki Izami" className="profile-pic" />
                            <h3>Hiroki Izami</h3>
                            <p className="title">Software Engineering Student, Senior Year</p>
                            <div className="description-block">
                                <h4>Connection</h4>
                                <p>Mentor match connected me to real industry mentors. I was able to learn more about Mobile App development and built my skills so that I could land an interview!</p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Footer Spacer */}
            <footer className="footer-spacer light-grey-bg">
            </footer>
        </>
    );
};

export default Home;
