import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/js/home";
import MockInterview from "./components/js/mock_interview";
import StartInterview from "./components/js/StartInterview";
import UploadResume from "./components/js/ResumeUpload";
import QuestionsPage from "./components/js/QuestionsPage";
import LoginPage from "./components/js/login";
import Signup from './components/js/Signup'; // ✅ FIXED PATH

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/mock-interview" element={<MockInterview />} />
      <Route path="/start-interview" element={<StartInterview />} />
      <Route path="/upload-resume" element={<UploadResume />} />
      <Route path="/questions" element={<QuestionsPage />} />
    </Routes>
  );
};

export default App;
