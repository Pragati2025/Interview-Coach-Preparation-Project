import React from "react";
import "../css/mock_interview.css";
import mockInterviewImage from "../images/mock-interview.png";

const MockInterview = () => {
  return (
    <section className="mock-interview-section">
      <div className="mock-container">
        {/* Left - Text Content */}
        <div className="mock-text">
          <h2>AI-Powered Mock Interviews</h2>
          <p>
            Prepare for real interviews with AI-driven mock sessions.  
            Get instant feedback, track your progress, and improve with personalized insights.
          </p>
          <button className="start-mock-btn">Start Your Mock Interview</button>
        </div>

        {/* Right - Animated Image */}
        <div className="mock-image">
          <img src={mockInterviewImage} alt="Mock Interview" />
        </div>
      </div>
    </section>
  );
};

export default MockInterview;
