import React, { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import "../css/startInterview.css";

const MockInterview = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [roleLevel, setRoleLevel] = useState(""); // NEW: Store selected role level
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file upload
  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  // Function to generate questions
  const generateQuestions = async () => {
    setLoading(true);
    setQuestions([]);
    setError(null);

    const formData = new FormData();
    if (jobDescription) formData.append("jobDescription", jobDescription);
    if (resume) formData.append("resume", resume);
    if (roleLevel) formData.append("roleLevel", roleLevel); // NEW: Include role level

    try {
      const response = await fetch("http://localhost:5000/api/mock-interview/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setQuestions(data.questions || []);
      } else {
        setError(data.error || "Failed to generate questions.");
        console.error("Backend Error:", data); // Log error details
      }
    } catch (error) {
      setError("Request failed. Please try again later.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="start-interview-container">
        <div className="start-interview-box">
          <form className="start-interview-form">
            <div>
              <label className="start-input-label">Job Description (Optional)</label>
              <textarea
                className="start-textarea-box"
                placeholder="Paste the job description here"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Role Level Dropdown */}
            <div className="role-level-container">
              <label htmlFor="role-level" className="role-level-label">Role Level</label>
              <select 
                id="role-level" 
                name="role-level" 
                className="role-level-dropdown"
                value={roleLevel} 
                onChange={(e) => setRoleLevel(e.target.value)}
              >
                <option value="">Select your role level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
              </select>
            </div>

            <div>
              <label className="start-input-label">Upload Resume (Optional)</label>
              <input type="file" className="start-input-box" onChange={handleResumeUpload} />
            </div>

            <div className="button-container">
              <button
                type="button"
                className="start-interview-button"
                onClick={generateQuestions}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Questions"}
              </button>
            </div>
          </form>

          {error && <p className="error-message">{error}</p>}

          {questions.length > 0 && (
            <div className="questions-container">
              <h3 className="questions-title">Start Interview</h3>
              <ul>
                {questions.map((question, index) => (
                  <li key={index} className="question-item">{question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MockInterview;
