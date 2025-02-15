import React from "react";
import { useSpring, animated } from "@react-spring/web";

const Toast = ({ message, type = "success", onClose }) => {
  const slideIn = useSpring({
    from: { transform: "translateY(100px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
    config: { tension: 300, friction: 20 },
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <animated.div
      style={slideIn}
      className="fixed bottom-4 right-4 z-50"
      onClick={onClose}
    >
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg 
                    flex items-center space-x-2 cursor-pointer hover:opacity-90`}
      >
        {type === "success" ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        <span className="font-medium">{message}</span>
      </div>
    </animated.div>
  );
};

export default Toast; 