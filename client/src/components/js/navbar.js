import React from "react";
import "../css/navbar.css";
import logo from "../images/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white fixed-top shadow-sm">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand" href="#home">
          <img src={logo} alt="Logo" className="logo" />
          Interview Prep
        </a>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#mock-interview">Mock Interviews</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#ai-tools">AI Tools</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#testimonial">Testimonial</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#login"><strong>Login</strong></a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
