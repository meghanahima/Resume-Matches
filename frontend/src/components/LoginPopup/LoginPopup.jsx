import React from "react";
import { useSpring, animated } from "@react-spring/web";
import Login from "../../login/login";

const LoginPopup = ({ onClose, onLogin }) => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  const slideUp = useSpring({
    from: { transform: "translateY(100px)" },
    to: { transform: "translateY(0px)" },
  });

  return (
    <animated.div
      style={fadeIn}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <animated.div
        style={slideUp}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Login to Continue</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <Login onLogin={onLogin} isPopup={true} />
        </div>
      </animated.div>
    </animated.div>
  );
};

export default LoginPopup; 