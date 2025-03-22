import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import profilePic from "./assets/profile.png";

import Jobs from "./Jobs";
import ResumeUpload from "./resume/resumeUpload";
import Login from "./login/login";
import Dashboard from "./dashboard/dashboard";
import NavBar from "./reusableComponents/navBar";
import ResumeBuilder from "./components/ResumeBuilder/ResumeBuilder";
import Activity from "./components/Activity/Activity";
import FindJobs from "./components/FindJobs/FindJobs";
import Footer from "./components/Footer/Footer";
import Toast from "./components/Toast/Toast";
import Profile from "./components/Profile/Profile";
import EmailVerification from "./components/EmailVerification/EmailVerification";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import VerifyEmail from "./components/EmailVerification/VerifyEmail";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <NavBar isLoggedIn={isLoggedIn} />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login showToast={showToast} />} />
            <Route
              path="/signup"
              element={<Login isSignUp={true} showToast={showToast} />}
            />
            <Route
              path="/find-jobs"
              element={<FindJobs showToast={showToast} />}
            />
            <Route path="/resume-upload" element={<ResumeUpload />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route
              path="/your-activity"
              element={<Activity showToast={showToast} />}
            />
            <Route path="/" element={<Dashboard isLoggedIn={isLoggedIn} />} />
            <Route
              path="/profile"
              element={<Profile showToast={showToast} />}
            />
            <Route
              path="/verify-email/:token"
              element={<EmailVerification showToast={showToast} />}
            />
            <Route
              path="/reset-password/:token"
              element={<PasswordReset showToast={showToast} />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword showToast={showToast} />}
            />
            <Route
              path="/verification-email-sent"
              element={<VerifyEmail showToast={showToast} />}
            />
          </Routes>
        </main>
        <Footer />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import './App.css';
// import Jobs from './Jobs';
// import ResumeUpload from './resume/resumeUpload';
// import Login from './login/login';
// import Dashboard from './dashboard/dashboard';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <nav className="flex justify-end bg-gray-800 p-4">
//           <Link to="/login" className="text-white ml-4">Login</Link>
//           <Link to="/find-jobs" className="text-white ml-4">Find Jobs</Link>
//         </nav>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/find-jobs" element={<Jobs />} />
//           <Route path="/resume-upload" element={<ResumeUpload />} />
//           <Route path="/" element={<Dashboard />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
