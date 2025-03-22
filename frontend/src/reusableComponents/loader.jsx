import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const Loader = () => {
  const rotationAnimation = useSpring({
    from: { rotate: 0 },
    to: { rotate: 360 },
    loop: true,
    config: { duration: 2000 },
  });

  const pulseAnimation = useSpring({
    from: { scale: 0.95, opacity: 0.5 },
    to: { scale: 1, opacity: 1 },
    loop: { reverse: true },
    config: { duration: 1000 },
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <animated.div
          style={{
            transform: rotationAnimation.rotate.to(r => `rotate(${r}deg)`),
          }}
        >
          <svg width="120" height="120">
            <defs>
              <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="transparent"
              stroke="#E5E7EB"
              strokeWidth="8"
            />

            {/* Animated Arc */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="transparent"
              stroke="url(#loaderGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45 * 0.75} ${2 * Math.PI * 45 * 0.25}`}
            />
          </svg>
        </animated.div>

        <animated.div
          style={{
            ...pulseAnimation,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: pulseAnimation.scale.to(s => `translate(-50%, -50%) scale(${s})`),
          }}
          className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center"
        >
          <span className="text-blue-600 font-semibold text-lg">
            {/* You can pass the step as a prop if needed */}
            Loading
          </span>
        </animated.div>
      </div>
    </div>
  );
};

export default Loader;
