import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const Activity = () => {
  // Mock data - replace with actual data from localStorage/backend
  const [resumes] = useState([
    {
      id: 1,
      name: "Software Developer Resume",
      lastModified: "2024-03-20",
      content: `John Doe
Software Developer
john@example.com | (555) 123-4567

Professional Summary
Experienced software developer with 5+ years of experience...`,
    },
    {
      id: 2,
      name: "Senior Frontend Developer",
      lastModified: "2024-03-15",
      content: `Jane Smith
Senior Frontend Developer
jane@example.com | (555) 987-6543

Professional Summary
Frontend specialist with expertise in React and modern web technologies...`,
    },
  ]);

  const [selectedResume, setSelectedResume] = useState(resumes[0]);

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  return (
    <animated.div
      style={fadeIn}
      className="min-h-screen bg-gray-50 pt-20 pb-12 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Your Activity</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Resume List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-medium mb-4">Your Resumes</h2>
            {resumes.map((resume) => (
              <button
                key={resume.id}
                onClick={() => setSelectedResume(resume)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedResume.id === resume.id
                    ? "bg-blue-50 border-blue-200 border-2"
                    : "bg-white border border-gray-200 hover:border-blue-200"
                }`}
              >
                <h3 className="font-medium mb-1">{resume.name}</h3>
                <p className="text-sm text-gray-500">
                  Last modified: {resume.lastModified}
                </p>
              </button>
            ))}
          </div>

          {/* Resume Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-medium">{selectedResume.name}</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Build from this Resume
                </button>
              </div>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans">
                  {selectedResume.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Activity; 