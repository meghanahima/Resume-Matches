import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { FaEnvelope, FaArrowLeft, FaRedo } from "react-icons/fa";
import { getCurrentHost } from "../../constants/config";

const VerifyEmail = ({ showToast }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  useEffect(() => {
    // Check if user is already verified
    if (userData.isEmailVerified) {
      navigate("/");
      return;
    }

    // Check if verification link is expired
    if (userData.emailVerificationExpires) {
      const expiryTime = new Date(userData.emailVerificationExpires);
      setIsLinkExpired(expiryTime < new Date());
    }
  }, [userData, navigate]);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 },
  });

  const handleResendVerification = async () => {
    if (!userData.email) {
      showToast("Please log in again to resend verification email", "error");
      navigate("/login");
      return;
    }

    try {
      setIsResending(true);
      const response = await fetch(
        `${getCurrentHost()}/api/users/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userData.email,
            frontendURL: window.location.origin,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update the expiry time in localStorage
        const updatedUserData = {
          ...userData,
          emailVerificationExpires: data.emailVerificationExpires,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setIsLinkExpired(false);
        showToast("New verification link sent! Please check your inbox.");
      } else {
        showToast(
          data.message || "Failed to resend verification email",
          "error"
        );
      }
    } catch (error) {
      showToast("Failed to resend verification email", "error");
    } finally {
      setIsResending(false);
    }
  };

  const renderResendButton = (isPrimary = false) => (
    <button
      onClick={handleResendVerification}
      disabled={isResending}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3 
        ${
          isPrimary
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        }
        rounded-lg font-medium transition-all 
        ${isPrimary ? "hover:scale-105" : ""} 
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isResending ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Sending...</span>
        </>
      ) : (
        <>
          <FaRedo className="text-sm" />
          <span>
            {isPrimary ? "Send New Verification Link" : "Resend Email"}
          </span>
        </>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 pt-16">
      <animated.div style={fadeIn} className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <FaEnvelope className="text-blue-500 text-3xl" />
          </div>

          {isLinkExpired ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Verification Link Expired
              </h1>
              <p className="text-gray-600 mb-8">
                Your verification link has expired. Don't worry - we can send
                you a new one.
              </p>
              {renderResendButton(true)}
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Check Your Email
              </h1>
              <p className="text-gray-600 mb-6">
                We've sent you a verification link. The link will expire in 24
                hours.
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                <p className="text-blue-800 font-medium">
                  Haven't received it yet?
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Check your spam folder or click below to resend
                </p>
              </div>
            </>
          )}

          <div className="space-y-4">
            {!isLinkExpired && renderResendButton()}
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft className="text-sm" />
              Back to Login
            </button>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default VerifyEmail;
