import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import { getCurrentHost } from "../../constants/config";
import { uploadFileToAzure } from "../../services/azure";
import Loader from "../../reusableComponents/loader";

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
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-lg border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">
              Great Resume!
            </h3>
            <p className="text-sm text-gray-600">
              Give your resume a memorable title
            </p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Senior Developer 2024"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 transition-all duration-200"
          />
          <p className="absolute -bottom-6 left-0 text-xs text-gray-500">
            This will help you track your applications
          </p>
        </div>

        <div className="flex justify-end items-center gap-3 mt-10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800
                     font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title)}
            disabled={!title.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-colors
                     font-medium inline-flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                <span>Saving...</span>
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

const MatchScoreBadge = ({ score, label, colorClass }) => (
  <div
    className={`px-3 py-1 rounded-full ${colorClass} text-sm font-medium flex items-center gap-1`}
  >
    <span className="text-lg">⚡</span>
    {score}% {label}
  </div>
);

const JobSkillTag = ({ skill }) => (
  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium m-1">
    {typeof skill === "string" ? skill.trim() : skill}
  </span>
);

const FindJobs = ({ showToast }) => {
  const navigate = useNavigate();
  const [loadingStep, setLoadingStep] = useState(0);
  const [showJobs, setShowJobs] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeFile, setResumeFile] = useState(() => {
    try {
      const savedResume = JSON.parse(localStorage.getItem("uploadedResume"));
      console.log(savedResume);
      return savedResume ? savedResume : null;
    } catch (error) {
      console.error("Error parsing saved resume:", error);
      return null;
    }
  });
  const fileInputRef = useRef(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSavedResumesModal, setShowSavedResumesModal] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [savingResume, setSavingResume] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isSavingJob, setIsSavingJob] = useState(false);

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
    const resumeData = {
      name: file.name,
      lastModified: file.lastModified,
      size: file.size,
      type: file.type,
      file: file, // This won't be stored in localStorage but needed for upload
    };

    setResumeFile(resumeData);

    // Store only serializable data
    const storageData = {
      name: file.name,
      lastModified: file.lastModified,
      size: file.size,
      type: file.type,
    };

    localStorage.setItem("uploadedResume", JSON.stringify(storageData));
    setShowSaveModal(true);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handlePickResume = (resume) => {
    const resumeData = {
      name: resume.title,
      url: resume.url,
      dbSavedResume: true,
      title: resume.title,
      ATSScore: resume.ATSScore,
      createdAt: resume.createdAt,
      _id: resume._id,
    };

    setResumeFile(resumeData);
    localStorage.setItem("uploadedResume", JSON.stringify(resumeData));
  };

  const startJobSearch = async () => {
    if (isSearching) return;
    setIsSearching(true);
    setLoadingStep(1);

    try {
      if (!resumeFile?._id) {
        showToast("Please save your resume first", "error");
        return;
      }

      // Reset jobs when starting new search
      setJobs([]);
      setCurrentPage(1);
      setHasMore(true);

      let loadingInterval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : 1));
      }, 1500);

      const response = await fetch(
        `${getCurrentHost()}/api/analyze/get-jobs/${resumeFile._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page: 1 }),
        }
      );

      clearInterval(loadingInterval);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data.matches || []);
      setHasMore(data.pagination?.hasMore || false);
      setShowJobs(true);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      showToast(error.message || "Failed to fetch jobs", "error");
    } finally {
      setIsSearching(false);
      setLoadingStep(0);
    }
  };

  const loadMoreJobs = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const response = await fetch(
        `${getCurrentHost()}/api/analyze/get-jobs/${resumeFile._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page: nextPage }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more jobs");
      }

      const data = await response.json();
      setJobs((prevJobs) => [...prevJobs, ...(data.matches || [])]);
      setHasMore(data.pagination?.hasMore || false);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error fetching more jobs:", error);
      showToast("Failed to load more jobs", "error");
    } finally {
      setIsLoadingMore(false);
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
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const resumeFileToBeSet = {
          ...data?.resume,
          dbSavedResume: true,
        };
        setResumeFile(resumeFileToBeSet);
        localStorage.setItem(
          "uploadedResume",
          JSON.stringify(resumeFileToBeSet)
        );
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
        setSavedResumes(data.resumes || []);
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

  const handleSaveJob = async (jobId) => {
    if (!resumeFile?._id) {
      showToast("Please login to save jobs", "error");
      return;
    }

    setIsSavingJob(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await fetch(`${getCurrentHost()}/api/users/save-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast("Job saved successfully!");
        // Update local state of saved jobs
        setSavedJobs(data.savedJobs);
      } else {
        showToast(data.message || "Failed to save job", "error");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      showToast("Failed to save job", "error");
    } finally {
      setIsSavingJob(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.token) return;

      const response = await fetch(`${getCurrentHost()}/api/users/saved-jobs`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedJobs(data.savedJobs.map((job) => job._id));
      }
    } catch (error) {
      console.error("Error loading saved jobs:", error);
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

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

  // Add this helper function
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
                        {resumeFile.dbSavedResume
                          ? resumeFile.title
                          : resumeFile.name}
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
        {!resumeFile ||
          (!showJobs && loadingStep > 0 && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-6">
                  Finding Your Perfect Jobs
                </h2>
                <Loader />
                <p className="mt-6 text-gray-600">
                  {loadingMessages[loadingStep]}
                </p>
              </div>
            </div>
          ))}

        {/* Jobs List */}
        {showJobs && (
          <animated.div style={fadeIn}>
            {jobs.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Job Matches
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Found top {jobs.length} matches based on your profile
                    </p>
                  </div>
                </div>

                <div className="grid gap-8">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 border border-gray-100"
                    >
                      <div className="flex flex-col gap-6">
                        {/* Header Section */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                                {job.company.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {job.role}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-gray-600">
                                  <span>{job.company}</span>
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
                                    {job.companyProfile.City},{" "}
                                    {job.companyProfile.State}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <MatchScoreBadge
                              score={Math.round(job.finalMatchScore)}
                              label="Match"
                              colorClass="bg-green-50 text-green-700"
                            />
                            <MatchScoreBadge
                              score={job.aiMatchScore}
                              label="AI"
                              colorClass="bg-blue-50 text-blue-700"
                            />
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              About the Role
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {job.jobDescription}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap">
                              {getSkillsArray(job.skills).map((skill, index) => (
                                <JobSkillTag key={index} skill={skill} />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer Section */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2 text-sm text-gray-500">
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
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Posted via {job.jobPortal}
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <a
                              href={job.companyProfile.Website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Visit Company Website
                            </a>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSaveJob(job._id)}
                              disabled={isSavingJob}
                              className={`px-4 py-2 border rounded-lg transition-colors font-medium
                                ${
                                  savedJobs.includes(job._id)
                                    ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                    : "text-gray-700 border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                              {savedJobs.includes(job._id) ? (
                                <span className="flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Saved
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
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
                                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                  </svg>
                                  Save Job
                                </span>
                              )}
                            </button>
                            <button
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                             transition-colors font-medium flex items-center gap-2"
                            >
                              Apply Now
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
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  No Perfect Matches Yet
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  It's not time to regret, but to level up your skills! Update your resume with more relevant experience and skills, then try again.
                </p>
                <button
                  onClick={() => setShowJobs(false)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           transition-all transform hover:scale-105 font-medium"
                >
                  Try Again with Updated Resume
                </button>
              </div>
            )}

            {/* Enhanced Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreJobs}
                  disabled={isLoadingMore}
                  className="px-8 py-3 bg-white border border-gray-200 rounded-xl
                           hover:bg-gray-50 transition-colors disabled:opacity-50
                           text-gray-700 font-medium flex items-center gap-2 mx-auto"
                >
                  {isLoadingMore ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                      Loading more jobs...
                    </>
                  ) : (
                    <>
                      Show More Jobs
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </animated.div>
        )}
      </div>

      {/* Modals */}
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
