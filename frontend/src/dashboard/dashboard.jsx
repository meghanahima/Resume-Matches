import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../components/LoginPopup/LoginPopup";
// import jobImage from '../assets/job-image.jpg'; // Add a sample job image

const Dashboard = ({ isLoggedIn, onLogin }) => {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 200 });
  const slideUp = useSpring({
    from: { transform: "translateY(20px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
    delay: 400,
  });

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      localStorage.setItem("uploadedResume", file);
    }
  };

  const handleFindJobs = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    } else if (!resumeFile) {
      // Trigger file input click
      document.getElementById("resume-upload").click();
    } else {
      navigate("/find-jobs");
    }
  };

  const handleDiscoverJobs = () => {
    if (isLoggedIn) {
      navigate("/find-jobs");
    } else {
      navigate("/login", { state: { from: "dashboard" } });
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    onLogin();
    if (resumeFile) {
      navigate("/find-jobs");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <animated.div style={fadeIn} className="max-w-4xl mx-auto pt-24 px-4">
        <div className="text-center">
          <h1 className="text-5xl font-semibold text-gray-900 mb-6">
            Find Your Perfect Job Match
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Stop wasting time scrolling through countless job listings. Let us
            analyze your resume and find the positions that truly match your
            skills.
          </p>
          <animated.div style={slideUp} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDiscoverJobs}
                className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-medium 
                           transition-all hover:bg-blue-700 hover:scale-105 active:scale-95
                           shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Discover Jobs
              </button>
              {/* <div className="relative">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <button
                  onClick={() =>
                    document.getElementById("resume-upload").click()
                  }
                  className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-medium 
                           transition-all hover:bg-blue-700 hover:scale-105 active:scale-95
                           shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  {resumeFile ? resumeFile.name : "Upload Resume"}
                </button>
              </div>
              <button
                onClick={handleFindJobs}
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 
                         rounded-full text-lg font-medium transition-all
                         hover:bg-blue-50 hover:scale-105 active:scale-95
                         shadow-lg hover:shadow-xl"
              >
                Find Jobs
              </button> */}
            </div>
            <p className="text-sm text-gray-500">
              {isLoggedIn
                ? resumeFile
                  ? "Click Find Jobs to continue"
                  : "Upload your resume and the Top picks just for you"
                : "Login required to access features"}
            </p>
          </animated.div>
        </div>

        <div className="my-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-all">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-xl font-medium mb-2">Smart Resume Analysis</h3>
            <p className="text-gray-600">
              Our AI analyzes your resume to understand your skills and
              experience
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-all">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-medium mb-2">Perfect Match</h3>
            <p className="text-gray-600">
              Get job recommendations that perfectly match your profile
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-all">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-medium mb-2">Quick Apply</h3>
            <p className="text-gray-600">
              Apply to matched jobs with just one click using your resume
            </p>
          </div>
        </div>
      </animated.div>

      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLogin={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
