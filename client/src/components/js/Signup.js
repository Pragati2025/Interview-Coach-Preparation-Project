import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar'; // Import the Navbar component
import Footer from './footer'; // Import the Footer component
import '../css/signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state for showing progress
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);  // Set loading state to true when request is in progress

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {  
        name: fullName,  // Send 'fullName' as 'name' here
        email,
        password,
        confirmPassword // Ensure confirmPassword is also sent
      });

      console.log("Registration Response: ", response.data);  // Log the response to check
      alert('Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      console.log("Registration Error: ", err.response?.data); // Log error response
      setError(err.response?.data?.message || 'Registration failed. Please try again later.');
    } finally {
      setLoading(false);  // Reset loading state once the request is complete
    }
  };

  return (
    <>
      <Navbar /> {/* Navbar component */}
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'} {/* Show loading text */}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>} {/* Display error message */}
      </div>
      <Footer /> {/* Footer component */}
    </>
  );
};

export default Signup;
