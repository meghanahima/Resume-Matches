import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { getCurrentHost } from "../constants/config";

const Login = ({ isSignUp = false, showToast }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });
  const [errors, setErrors] = useState({});

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

  const validateForm = () => {
    const newErrors = {};
    if (isSignUp) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be 10 digits";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        if (isSignUp) {
          const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            mobile: parseInt(formData.phone),
            gender: formData.gender,
            githubProfileUrl: formData?.github || "",
            linkedinProfileUrl: formData?.linkedin || "",
            frontendURL: window.location.origin,
          };

          const response = await fetch(
            `${getCurrentHost()}/api/users/register`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          const data = await response.json();

          if (response.status === 201) {
            // Store user data including verification expiry
            localStorage.setItem("userData", JSON.stringify(data));
            navigate("/verification-email-sent");
            showToast("Registration successful! Please verify your email.");
          } else {
            showToast(data.message || "Registration failed", "error");
          }
        } else {
          const payload = {
            email: formData.email,
            password: formData.password,
          };

          const response = await fetch(`${getCurrentHost()}/api/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (
            response.status === 401 &&
            data.message === "Please verify your email first"
          ) {
            // Store user data including verification expiry
            localStorage.setItem(
              "userData",
              JSON.stringify({
                email: formData.email,
                emailVerificationExpires: data.emailVerificationExpires,
                isEmailVerified: false,
              })
            );
            navigate("/verification-email-sent");
          } else if (response.status !== 200) {
            showToast(data?.message || "Login failed", "error");
          } else {
            localStorage.setItem("userData", JSON.stringify(data));
            localStorage.setItem("isLoggedIn", "true");
            navigate("/");
            showToast("Welcome back!");
          }
        }
      } catch (error) {
        console.log(error);
        showToast(
          isSignUp ? "Registration failed" : "Login failed. Please try again.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 pb-12 px-4">
      <animated.div style={fadeIn} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left side - Form */}
            <div className="md:flex-1 p-8 md:p-12">
              <h2 className="text-3xl font-semibold mb-2 text-gray-900">
                {isSignUp ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-600 mb-8">
                {isSignUp
                  ? "Join us to find your perfect job match"
                  : "Sign in to continue your job search"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                  <>
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Personal Information
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name<span className="text-red-500"> *</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 
                                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number<span className="text-red-500"> *</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 
                                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="1234567890"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Social Profiles Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Professional Profiles
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GitHub Profile
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                            </svg>
                          </span>
                          <input
                            type="url"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 
                                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn Profile
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </span>
                          <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 
                                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gender Section */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          Male
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          Female
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* Account Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isSignUp ? "Account Details" : "Login Details"}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address<span className="text-red-500"> *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 
                               focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password<span className="text-red-500"> *</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 
                               focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                    {!isSignUp && (
                      <div className="text-right mt-1">
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {isSignUp && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password<span className="text-red-500"> *</span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 
                                 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium
                           transition-all hover:bg-blue-700 hover:scale-[1.02] 
                           active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                           shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </button>

                <p className="text-center text-gray-600">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <Link
                    to={isSignUp ? "/login" : "/signup"}
                    className="text-blue-600 hover:text-blue-700 ml-2 font-medium"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Link>
                </p>
              </form>
            </div>

            {/* Right side - Illustration/Info (only on larger screens) */}
            <div className="hidden md:block md:w-1/3 bg-blue-600 p-12 text-white">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-4">
                  {isSignUp ? "Join Our Community" : "Rush up !"}
                </h3>
                <p className="text-blue-100">
                  {isSignUp
                    ? "Create an account to access personalized job recommendations and build your professional profile."
                    : "Your dream job is awaiting for you"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default Login;
