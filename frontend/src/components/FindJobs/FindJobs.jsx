import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import { getCurrentHost } from "../../constants/config";
import { uploadFileToAzure } from "../../services/azure";

const modalOverlayStyle =
  "fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm";

const SaveResumeModal = ({ isOpen, onClose, onSave, isLoading }) => {
  const [title, setTitle] = useState("");
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(-20px)",
    config: config.gentle,
  });

  return isOpen ? (
    <div className={modalOverlayStyle} onClick={onClose}>
      <animated.div
        style={modalAnimation}
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">
          Name Your Professional Story ✨
        </h3>
        <p className="text-gray-600 mb-4">
          Give your resume a memorable title to help you track your job
          applications
        </p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Senior Developer 2024"
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title)}
            disabled={!title.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                Saving...
              </>
            ) : (
              "Save Resume"
            )}
          </button>
        </div>
      </animated.div>
    </div>
  ) : null;
};

const ConfirmSaveModal = ({ isOpen, onClose, onConfirm }) => {
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(-20px)",
    config: config.gentle,
  });

  return isOpen ? (
    <div className={modalOverlayStyle} onClick={onClose}>
      <animated.div
        style={modalAnimation}
        className="bg-white/90 rounded-xl p-8 w-full max-w-md mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">🎯</div>
        <h3 className="text-2xl font-semibold mb-3">Great Resume!</h3>
        <p className="text-gray-600 mb-6">
          Would you like to save this resume for future applications?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Skip
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                     transition-colors"
          >
            Yes, Save It!
          </button>
        </div>
      </animated.div>
    </div>
  ) : null;
};

const SavedResumesModal = ({
  isOpen,
  onClose,
  resumes = [],
  selectedResume,
  onSelectResume,
  loading,
  showMore,
  setShowMore,
  onPickResume,
}) => {
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(-20px)",
    config: config.gentle,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const displayedResumes = showMore ? resumes : resumes.slice(0, 3);

  return isOpen ? (
    <div className={modalOverlayStyle} onClick={onClose}>
      <animated.div
        style={modalAnimation}
        className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 h-[80vh] flex gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 
                   w-8 h-8 flex items-center justify-center rounded-full 
                   hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
        <div className="w-1/2 overflow-y-auto pr-6 custom-scrollbar">
          <h3 className="text-xl font-semibold mb-4">Your Saved Resumes</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No resumes saved yet
              </div>
            ) : (
              <>
                {displayedResumes.map((resume) => (
                  <button
                    key={resume._id}
                    onClick={() => onSelectResume(resume)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedResume?._id === resume._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">
                      {resume.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded on{" "}
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}

                {!showMore && resumes.length > 3 && (
                  <button
                    onClick={() => setShowMore(true)}
                    className="w-full py-3 text-blue-600 hover:text-blue-700 
                             font-medium border-2 border-dashed border-blue-200 
                             rounded-lg hover:bg-blue-50 transition-all"
                  >
                    View More Resumes
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="w-1/2 bg-gray-50 rounded-xl p-6">
          {selectedResume ? (
            <div>
              <h3 className="text-xl font-semibold mb-6">Resume Details</h3>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {selectedResume.ATSScore}%
                  </div>
                  <p className="text-gray-600">ATS Compatibility Score</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Title</h4>
                    <p className="text-gray-900 mt-1">{selectedResume.title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Upload Date
                    </h4>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedResume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <a
                    href={selectedResume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg
                             hover:bg-gray-200 transition-colors text-center"
                  >
                    View Resume
                  </a>
                  <button
                    onClick={() => {
                      onPickResume(selectedResume);
                      onClose();
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg
                             hover:bg-blue-700 transition-colors"
                  >
                    Pick This Resume
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a resume to view details
            </div>
          )}
        </div>
      </animated.div>
    </div>
  ) : null;
};

const FindJobs = ({ showToast }) => {
  const navigate = useNavigate();
  const [loadingStep, setLoadingStep] = useState(0);
  const [showJobs, setShowJobs] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeFile, setResumeFile] = useState(() => {
    const savedResume = localStorage.getItem("uploadedResume");
    return savedResume ? savedResume : null;
  });
  const fileInputRef = useRef(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSavedResumesModal, setShowSavedResumesModal] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [savingResume, setSavingResume] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Mock job data
  const jobs = [
    {
      id: 1,
      role: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      logo: "https://via.placeholder.com/50",
      location: "San Francisco, CA",
      salary: "$120,000 - $150,000",
      description:
        "We are seeking experienced React developers to join our team in Visakhapatnam. As a React developer, you will be responsible for developing user interface components and implementing them following well-known React workflows. You should have a strong understanding of React JS and its core principles. The ideal candidate should have 1000 to 2000 years of experience in React development and be able to work full-time from our office in Visakhapatnam. This is a workFromOffice role with 5 openings available. The annual salary package ranges from 7000 per day in USD. If you are a skilled React developer looking for a challenging opportunity, we would love to hear from you.",
      match: 95,
    },
    {
      id: 2,
      role: "Backend Developer",
      company: "Spotmies",
      logo: "https://via.placeholder.com/50",
      location: "Visakhapatnam, AP",
      salary: "$10,000 - $50,000",
      description:
        "We're looking for an experienced Backend Developer with React expertise...",
      match: 95,
    },
    // Add more mock jobs...
  ];

  const fadeIn = useSpring({
    opacity: showJobs ? 1 : 0,
    config: { duration: 1000 },
  });

  const loadingAnimation = useSpring({
    width: `${(loadingStep / 3) * 100}%`,
    config: config.molasses,
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type.includes("word"))
    ) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setResumeFile(file);
    localStorage.setItem(
      "uploadedResume",
      JSON.stringify({
        name: file.name,
        file: file,
      })
    );
    setShowConfirmSave(true);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile({
        name: file.name,
        file: file,
      });
      localStorage.setItem(
        "uploadedResume",
        JSON.stringify({
          name: file.name,
          file: file,
        })
      );
      setShowConfirmSave(true);
    }
  };

  const handlePickResume = (resume) => {
    setResumeFile({
      name: resume.title,
      url: resume.url,
    });
    localStorage.setItem(
      "uploadedResume",
      JSON.stringify({
        name: resume.title,
        url: resume.url,
      })
    );
  };

  const startJobSearch = async () => {
    if (isSearching) return; // Prevent multiple clicks
    setIsSearching(true);
    setLoadingStep(1);

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoadingStep(2);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoadingStep(3);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowJobs(true);
    } catch (error) {
      showToast("Failed to fetch jobs", "error");
    } finally {
      setIsSearching(false);
    }
  };

  const loadingMessages = [
    "Analyzing resume...",
    "Extracting skills...",
    "Finding matches...",
    "Preparing results...",
  ];

  const handleSaveResume = async (title) => {
    setSavingResume(true);
    try {
      const randomNumber = Math.floor(Math.random() * 1000000);
      const timeStamp = Date.now().toString();
      const azureResumeName = `${randomNumber}_${timeStamp}_${resumeFile.name}.pdf`;
      const uploadedResumeUrl = await uploadFileToAzure(
        azureResumeName,
        resumeFile.file
      );
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await fetch(
        `${getCurrentHost()}/api/resumes/save-resume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({
            userId: userData._id,
            url: uploadedResumeUrl.url,
            title,
            ATSScore: Math.floor(Math.random() * 100) + 1,
          }),
        }
      );

      if (response.ok) {
        showToast("Resume saved successfully!");
        setShowSaveModal(false);
      } else {
        showToast("Failed to save resume", "error");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      showToast("Failed to save resume", "error");
    } finally {
      setSavingResume(false);
    }
  };

  const loadSavedResumes = async () => {
    setLoadingResumes(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || !userData.token) {
        showToast("Please login to view saved resumes", "error");
        setShowSavedResumesModal(false);
        return;
      }

      const response = await fetch(
        `${getCurrentHost()}/api/resumes/get-resumes/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Limit to maximum 6 resumes
        setSavedResumes(data.resumes?.slice(0, 6) || []);
      } else {
        showToast("Failed to load resumes", "error");
      }
    } catch (error) {
      console.error("Error loading resumes:", error);
      showToast("Failed to load resumes", "error");
    } finally {
      setLoadingResumes(false);
    }
  };

  // Add CSS for custom scrollbar
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #ccc;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Upload Your Resume</h2>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Upload Section */}
            <div className="flex-1 w-full">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
                          ${
                            isDragging
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-blue-500"
                          }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <div className="text-4xl mb-4">📄</div>
                <p className="text-gray-600 mb-2">
                  Drag and drop your resume here
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors"
                >
                  Browse Files
                </button>
                {resumeFile && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-green-500 mr-3"
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
                      <span className="text-lg font-medium text-gray-800">
                        {resumeFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setResumeFile(null);
                        localStorage.removeItem("uploadedResume");
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col gap-4 md:w-64">
              <button
                onClick={startJobSearch}
                disabled={isSearching || !resumeFile}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 transition-colors font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center"
              >
                {isSearching ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
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
                    Finding Jobs...
                  </>
                ) : (
                  "Find Jobs"
                )}
              </button>
              <button
                onClick={() => {
                  setShowSavedResumesModal(true);
                  loadSavedResumes();
                }}
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 
                         rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Use Saved Resume
              </button>
            </div>
          </div>
        </div>

        {/* Loading Progress */}
        {!showJobs && loadingStep > 0 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Finding Your Perfect Jobs
              </h2>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <animated.div
                  style={loadingAnimation}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
              <p className="mt-4 text-gray-600">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          </div>
        )}

        {/* Jobs List */}
        {showJobs && (
          <animated.div style={fadeIn}>
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              Job listings
            </h2>
            <div className="grid gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.role}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {job.company}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>{job.location}</span>
                          <span>{job.salary}</span>
                        </div>
                        <p className="mt-3 text-gray-600 text-sm max-w-2xl">
                          {job.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-green-600 font-semibold text-lg">
                        {job.match}% Match
                      </div>
                      <button
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg 
                                 hover:bg-blue-700 transition-colors font-medium"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </animated.div>
        )}
      </div>

      {/* Modals */}
      <ConfirmSaveModal
        isOpen={showConfirmSave}
        onClose={() => setShowConfirmSave(false)}
        onConfirm={() => {
          setShowConfirmSave(false);
          setShowSaveModal(true);
        }}
      />
      <SaveResumeModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveResume}
        isLoading={savingResume}
      />
      <SavedResumesModal
        isOpen={showSavedResumesModal}
        onClose={() => {
          setShowSavedResumesModal(false);
          setShowMore(false);
        }}
        resumes={savedResumes}
        selectedResume={selectedResume}
        onSelectResume={setSelectedResume}
        loading={loadingResumes}
        showMore={showMore}
        setShowMore={setShowMore}
        onPickResume={handlePickResume}
      />
    </div>
  );
};

export default FindJobs;
