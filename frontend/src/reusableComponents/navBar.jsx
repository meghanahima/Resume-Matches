import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import boyProfilePic from "../assets/boyProfilePic.png";
import girlProfilePic from "../assets/girlProfilePic.png";

const NavBar = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  const menuAnimation = useSpring({
    opacity: showProfileMenu ? 1 : 0,
    transform: showProfileMenu ? "translateY(0)" : "translateY(-10px)",
    config: { tension: 300, friction: 20 },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <animated.nav
      style={fadeIn}
      className="bg-white shadow-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-blue-600">
              ResumeMatch
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <>
                {/* <Link
                  to="/resume-builder"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive("/resume-builder")
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  Resume Builder
                </Link> */}
                <Link
                  to="/find-jobs"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive("/find-jobs")
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/your-activity"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive("/your-activity")
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  Your Activity
                </Link>
              </>
            )}

            {!isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                           rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full overflow-hidden flex items-center 
                           justify-center hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  <img
                    src={
                      userData.gender === "female"
                        ? girlProfilePic
                        : boyProfilePic
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                {showProfileMenu && (
                  <animated.div
                    style={menuAnimation}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                              py-1 border border-gray-200"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {userData.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50
                                flex items-center space-x-2"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Your Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        localStorage.removeItem("isLoggedIn");
                        localStorage.removeItem("userData");
                        navigate("/");
                        window.location.reload();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600
                                hover:bg-red-50 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </animated.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </animated.nav>
  );
};

export default NavBar;
