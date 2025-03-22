import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentHost } from "../../constants/config";
import PdfViewer from "../../reusableComponents/pdfPreview";

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium rounded-lg transition-colors
      ${
        active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
      }`}
  >
    {children}
  </button>
);

const ResumeCard = ({ resume, isExpanded, onToggle }) => {
  const navigate = useNavigate();
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const handleFindJobs = () => {
    // Store the selected resume in localStorage before navigating
    const resumeData = {
      name: resume.title,
      url: resume.url,
      dbSavedResume: true,
      title: resume.title,
      ATSScore: resume.ATSScore,
      createdAt: resume.createdAt,
      _id: resume._id
    };
    
    localStorage.setItem("uploadedResume", JSON.stringify(resumeData));
    navigate("/find-jobs");
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header - Always visible */}
        <div
          onClick={onToggle}
          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-medium">
                {resume.parsedInfo?.contact_info?.name?.charAt(0) ||
                  resume.title.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {
                  // resume.parsedInfo?.contact_info?.name || 
                  resume.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {resume.parsedInfo?.contact_info?.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {resume.ATSScore}%
                </div>
                <div className="text-xs text-gray-500">ATS Score</div>
              </div>
              
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-100">
            <div className="p-6 space-y-8">
              {/* Contact & Summary Section */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Professional Summary
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {resume.parsedInfo?.summary}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    {resume.parsedInfo?.contact_info?.email && (
                      <a
                        href={`mailto:${resume.parsedInfo.contact_info.email}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
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
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {resume.parsedInfo.contact_info.email}
                      </a>
                    )}
                    {resume.parsedInfo?.contact_info?.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {resume.parsedInfo.contact_info.phone}
                      </div>
                    )}
                    {resume.parsedInfo?.contact_info?.linkedin && (
                      <a
                        href={resume.parsedInfo.contact_info.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Skills & Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resume.parsedInfo?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {skill.skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Analysis Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Strengths */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      />
                    </svg>
                    Key Strengths
                  </h4>
                  <ul className="space-y-2">
                    {resume.analysis?.strengths?.map((strength, index) => (
                      <li key={index} className="text-sm text-green-700">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-amber-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      />
                    </svg>
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {resume.analysis?.weaknesses?.map((weakness, index) => (
                      <li key={index} className="text-sm text-amber-700">
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {resume.analysis?.suggestions?.map((suggestion, index) => (
                      <li key={index} className="text-sm text-blue-700">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              {/* <div className="flex gap-3 pt-4 border-t"> */}
                {/* <button
                  onClick={() => setShowPdfPreview(true)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg
                           hover:bg-gray-200 transition-colors text-sm font-medium
                           flex items-center justify-center gap-2"
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
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Resume
                </button> */}
                <button
                  onClick={handleFindJobs}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Find Matching Jobs
                </button>
              {/* </div> */}
            </div>
          </div>
        )}
      </div>

      {/* Add PDF Preview Modal */}
      {showPdfPreview && (
        <PdfViewer
          pdfUrl={resume.url}
          onClose={() => setShowPdfPreview(false)}
        />
      )}
    </>
  );
};

const Activity = ({ showToast }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedResumes, setSavedResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedResumeId, setExpandedResumeId] = useState(null);

  const loadSavedItems = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.token) {
        navigate("/login");
        return;
      }

      // Load saved jobs
      const jobsResponse = await fetch(
        `${getCurrentHost()}/api/users/saved-jobs`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      // Load saved resumes
      const resumesResponse = await fetch(
        `${getCurrentHost()}/api/resumes/get-resumes/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (jobsResponse.ok && resumesResponse.ok) {
        const jobsData = await jobsResponse.json();
        const resumesData = await resumesResponse.json();
        setSavedJobs(jobsData.savedJobs);
        setSavedResumes(resumesData.resumes);
      }
    } catch (error) {
      console.error("Error loading saved items:", error);
      showToast("Failed to load saved items", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveJob = async (jobId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await fetch(
        `${getCurrentHost()}/api/users/saved-jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.ok) {
        setSavedJobs((jobs) => jobs.filter((job) => job._id !== jobId));
        showToast("Job removed successfully");
      }
    } catch (error) {
      console.error("Error removing job:", error);
      showToast("Failed to remove job", "error");
    }
  };

  useEffect(() => {
    loadSavedItems();
  }, []);

  // Helper function to handle skills display
  const getSkillsArray = (skills) => {
    if (Array.isArray(skills)) {
      return skills;
    }
    if (typeof skills === "string") {
      return skills.split(",");
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Activity</h1>
            <div className="flex gap-4 mt-6">
              <TabButton
                active={activeTab === "jobs"}
                onClick={() => setActiveTab("jobs")}
              >
                Saved Jobs
              </TabButton>
              <TabButton
                active={activeTab === "resumes"}
                onClick={() => setActiveTab("resumes")}
              >
                Saved Resumes
              </TabButton>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : activeTab === "jobs" ? (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {savedJobs.length} Saved Jobs
                </h2>
                {savedJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No saved jobs yet
                    </h3>
                    <p className="text-gray-600">
                      Start saving jobs you're interested in to track them here
                    </p>
                  </div>
                ) : (
                  savedJobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {job.role}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-gray-600">
                              <span>{job.company}</span>
                              <span>•</span>
                              <span>
                                {job.companyProfile.City},{" "}
                                {job.companyProfile.State}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRemoveJob(job._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.jobDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {getSkillsArray(job.skills)
                            .slice(0, 4)
                            .map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                              >
                                {typeof skill === "string"
                                  ? skill.trim()
                                  : skill}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {savedResumes.length} Saved Resumes
                </h2>
                {savedResumes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No saved resumes yet
                    </h3>
                    <p className="text-gray-600">
                      Upload and save your resumes to track them here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedResumes.map((resume) => (
                      <ResumeCard
                        key={resume._id}
                        resume={resume}
                        isExpanded={expandedResumeId === resume._id}
                        onToggle={() =>
                          setExpandedResumeId(
                            expandedResumeId === resume._id ? null : resume._id
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
