import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentHost } from '../../constants/config';
import { useSpring, animated } from '@react-spring/web';

const ForgotPassword = ({ showToast }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentRunningOrigin = window.location.origin;
      const response = await fetch(`${getCurrentHost()}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, frontendURLcurrentRunningOrigin}),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        showToast('Password reset link sent to your email', 'success');
      } else {
        showToast(data.message || 'Failed to send reset link', 'error');
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 pb-12 px-4">
      <animated.div style={fadeIn} className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Forgot Password?</h2>
              <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium
                           transition-all hover:bg-blue-700 hover:scale-[1.02] 
                           active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to your email address.
              </p>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </animated.div>
    </div>
  );
};

export default ForgotPassword; 