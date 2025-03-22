import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getCurrentHost } from "../../constants/config";
import { useSpring, animated } from "@react-spring/web";

const EmailVerification = ({ showToast }) => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [isVerifying, setIsVerifying] = useState(false);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

  const verifyEmail = useCallback(async () => {
    if (isVerifying) return;
    setIsVerifying(true);

    try {
      const response = await fetch(
        `${getCurrentHost()}/api/users/verify-email/${token}`
      );
      const data = await response.json();

      if (data.success) {
        setVerificationStatus("success");
        showToast("Email verified successfully!", "success");

        // Update localStorage
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        if (userData.email) {
          const updatedUserData = {
            ...userData,
            isEmailVerified: true,
          };
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
        }
      } else {
        setVerificationStatus("error");
        showToast(data.message || "Verification failed", "error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      showToast("Verification failed. Please try again.", "error");
    }
  }, [token, showToast]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying your email...
            </h2>
            <p className="text-gray-600 mt-2">
              Please wait while we verify your email address.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified.
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium
                       transition-all hover:bg-blue-700 hover:scale-[1.02]"
            >
              Proceed to Login
            </Link>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              The verification link may be invalid or expired.
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium
                       transition-all hover:bg-blue-700 hover:scale-[1.02]"
            >
              Return to Login
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 pb-12 px-4">
      <animated.div style={fadeIn} className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderContent()}
        </div>
      </animated.div>
    </div>
  );
};

export default EmailVerification;
