import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              We help job seekers find their perfect match using AI-powered job
              recommendations and smart resume analysis.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/find-jobs" className="hover:text-white">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/resume-builder" className="hover:text-white">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/your-activity" className="hover:text-white">
                  Your Activity
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Career Advice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Resume Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Interview Guide
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@example.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Location: San Francisco, CA</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>© 2024 JobMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 