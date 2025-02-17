import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import html2pdf from "html2pdf.js";

const ResumeBuilder = () => {
  const resumeRef = useRef(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [showSkills, setShowSkills] = useState(true);
  const [showLanguages, setShowLanguages] = useState(true);
  const [showEmploymentHistory, setShowEmploymentHistory] = useState(true);
  const [showInternships, setShowInternships] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showEducation, setShowEducation] = useState(true);
  const [showCourses, setShowCourses] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);
  const [showHobbies, setShowHobbies] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [showSectionManager, setShowSectionManager] = useState(false);

  const [resumeData, setResumeData] = useState({
    contact_info: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
    },
    summary: "",
    skills: [{ skill: "", level: "intermediate" }],
    languages: [{ language: "English", level: "proficient" }],
    employmentHistory: [
      {
        jobTitle: "Software Engineer",
        company: "Example Corp",
        city: "New York",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
        description: "Developed features for a web application.",
        presentWorking: false,
      },
    ],
    internships: [
      {
        jobTitle: "Intern",
        employer: "Example Inc",
        startDate: "2021-06-01",
        endDate: "2021-08-31",
        city: "Los Angeles",
        description: "Assisted with various tasks.",
      },
    ],
    projects: [
      {
        title: "Personal Website",
        techStackUsed: ["React", "Tailwind CSS"],
        role: "Front-end Developer",
        description: "Created a personal website to showcase skills.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science",
        institution: "Example University",
        year: "2022",
      },
    ],
    courses: [
      {
        course: "Web Development Bootcamp",
        institution: "Example Academy",
        startDate: "2021-01-01",
        endDate: "2021-03-31",
      },
    ],
    achievements: [
      {
        title: "Employee of the Month",
        date: "2022-12-01",
        description: "Recognized for outstanding performance.",
        issuer: "Example Corp",
      },
    ],
    hobbies: ["Reading", "Hiking"],
  });

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  const handleContactInfoChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value,
      },
    }));
  };

  const handleInputChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInput = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSkillsChange = (index, field, value) => {
    setResumeData((prev) => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      return { ...prev, skills: newSkills };
    });
  };

  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, { skill: "", level: "intermediate" }],
    }));
  };

  const removeSkill = (index) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleLanguagesChange = (index, field, value) => {
    setResumeData((prev) => {
      const newLanguages = [...prev.languages];
      newLanguages[index] = { ...newLanguages[index], [field]: value };
      return { ...prev, languages: newLanguages };
    });
  };

  const addLanguage = () => {
    setResumeData((prev) => ({
      ...prev,
      languages: [...prev.languages, { language: "", level: "intermediate" }],
    }));
  };

  const removeLanguage = (index) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const handleEmploymentHistoryChange = (index, field, value) => {
    setResumeData((prev) => {
      const newEmploymentHistory = [...prev.employmentHistory];
      newEmploymentHistory[index] = {
        ...newEmploymentHistory[index],
        [field]: value,
      };
      return { ...prev, employmentHistory: newEmploymentHistory };
    });
  };

  const addEmploymentHistory = () => {
    setResumeData((prev) => ({
      ...prev,
      employmentHistory: [
        ...prev.employmentHistory,
        {
          jobTitle: "",
          company: "",
          city: "",
          startDate: "",
          endDate: "",
          description: "",
          presentWorking: false,
        },
      ],
    }));
  };

  const removeEmploymentHistory = (index) => {
    setResumeData((prev) => ({
      ...prev,
      employmentHistory: prev.employmentHistory.filter((_, i) => i !== index),
    }));
  };

  const handleInternshipsChange = (index, field, value) => {
    setResumeData((prev) => {
      const newInternships = [...prev.internships];
      newInternships[index] = { ...newInternships[index], [field]: value };
      return { ...prev, internships: newInternships };
    });
  };

  const addInternship = () => {
    setResumeData((prev) => ({
      ...prev,
      internships: [
        ...prev.internships,
        {
          jobTitle: "",
          employer: "",
          startDate: "",
          endDate: "",
          city: "",
          description: "",
        },
      ],
    }));
  };

  const removeInternship = (index) => {
    setResumeData((prev) => ({
      ...prev,
      internships: prev.internships.filter((_, i) => i !== index),
    }));
  };

  const handleProjectsChange = (index, field, value) => {
    setResumeData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  const handleTechStackChange = (index, value) => {
    setResumeData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[index] = {
        ...newProjects[index],
        techStackUsed: value.split(",").map((item) => item.trim()),
      };
      return { ...prev, projects: newProjects };
    });
  };

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: "", techStackUsed: [], role: "", description: "" },
      ],
    }));
  };

  const removeProject = (index) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setResumeData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
    });
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }));
  };

  const removeEducation = (index) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleCoursesChange = (index, field, value) => {
    setResumeData((prev) => {
      const newCourses = [...prev.courses];
      newCourses[index] = { ...newCourses[index], [field]: value };
      return { ...prev, courses: newCourses };
    });
  };

  const addCourse = () => {
    setResumeData((prev) => ({
      ...prev,
      courses: [
        ...prev.courses,
        { course: "", institution: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const removeCourse = (index) => {
    setResumeData((prev) => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index),
    }));
  };

  const handleAchievementsChange = (index, field, value) => {
    setResumeData((prev) => {
      const newAchievements = [...prev.achievements];
      newAchievements[index] = { ...newAchievements[index], [field]: value };
      return { ...prev, achievements: newAchievements };
    });
  };

  const addAchievement = () => {
    setResumeData((prev) => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        { title: "", date: "", description: "", issuer: "" },
      ],
    }));
  };

  const removeAchievement = (index) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleHobbiesChange = (index, value) => {
    setResumeData((prev) => {
      const newHobbies = [...prev.hobbies];
      newHobbies[index] = value;
      return {
        ...prev,
        hobbies: newHobbies,
      };
    });
  };

  const addHobby = () => {
    setResumeData((prev) => ({
      ...prev,
      hobbies: [...prev.hobbies, ""],
    }));
  };

  const removeHobby = (index) => {
    setResumeData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index),
    }));
  };

  const downloadPDF = () => {
    const element = resumeRef.current;

    if (!element) {
      console.error("Resume element not found.  Check the ref.");
      return;
    }

    const opt = {
      margin: [10, 10],
      filename: `${resumeData.contact_info.name.replace(
        /\s+/g,
        "_"
      )}_resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(opt).from(element).save();
  };

  const SkillLevelSlider = ({ level, onChange }) => {
    const levels = ["beginner", "intermediate", "proficient"];

    return (
      <div className="flex items-center">
        <input
          type="range"
          min="0"
          max="2"
          value={levels.indexOf(level)}
          onChange={(e) => onChange(levels[e.target.value])}
          className="w-32"
        />
        <span className="ml-2 text-sm">{level}</span>
      </div>
    );
  };

  const [activeSection, setActiveSection] = useState("contact"); // New state for active section

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (resumeRef.current) {
      const contentHeight = resumeRef.current.scrollHeight;
      const pageHeight = 1056; // Standard A4 height in pixels at 96 DPI
      const calculatedPages = Math.ceil(contentHeight / pageHeight);
      setTotalPages(calculatedPages);
    }
  }, [resumeData]);

  const steps = [
    { id: "basics", label: "Basic Info" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "extras", label: "Additional Info" },
  ];

  // Add this new component for the section manager sidebar
  const SectionManager = ({
    sections,
    onToggle,
    activeSection,
    onSectionSelect,
  }) => {
    return (
      <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Manage Sections
          </h2>
          <div className="space-y-2">
            {sections.map(({ id, label, show }) => (
              <div
                key={id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
              >
                <button
                  onClick={() => onSectionSelect(id)}
                  className={`flex-1 text-left text-sm ${
                    activeSection === id
                      ? "text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {label}
                </button>
                <label className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={show}
                    onChange={() => onToggle(id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // In the main component, add this array of sections
  const sectionsList = [
    { id: "contact", label: "Contact Information", show: true },
    { id: "summary", label: "Professional Summary", show: showSummary },
    { id: "skills", label: "Skills", show: showSkills },
    { id: "languages", label: "Languages", show: showLanguages },
    { id: "experience", label: "Work Experience", show: showEmploymentHistory },
    { id: "education", label: "Education", show: showEducation },
    { id: "projects", label: "Projects", show: showProjects },
    { id: "achievements", label: "Achievements", show: showAchievements },
    { id: "internships", label: "Internships", show: showInternships },
    { id: "courses", label: "Courses", show: showCourses },
    { id: "hobbies", label: "Hobbies", show: showHobbies },
  ];

  // Add this function to handle section toggles
  const handleSectionToggle = (sectionId) => {
    switch (sectionId) {
      case "summary":
        setShowSummary(!showSummary);
        break;
      case "skills":
        setShowSkills(!showSkills);
        break;
      case "languages":
        setShowLanguages(!showLanguages);
        break;
      case "experience":
        setShowEmploymentHistory(!showEmploymentHistory);
        break;
      case "education":
        setShowEducation(!showEducation);
        break;
      case "projects":
        setShowProjects(!showProjects);
        break;
      case "achievements":
        setShowAchievements(!showAchievements);
        break;
      case "internships":
        setShowInternships(!showInternships);
        break;
      case "courses":
        setShowCourses(!showCourses);
        break;
      case "hobbies":
        setShowHobbies(!showHobbies);
        break;
    }
  };

  // Add this new component for editable text
  const EditableText = ({
    value,
    onChange,
    multiline = false,
    placeholder = "",
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    if (isEditing) {
      if (multiline) {
        return (
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-full p-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
          />
        );
      }
      return (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className="w-full p-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
      );
    }

    return (
      <div
        onClick={() => setIsEditing(true)}
        className="cursor-text hover:bg-gray-50 p-1 rounded group relative"
      >
        {value || placeholder}
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-blue-500">
          ✎
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
                Resume Builder
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {showPreview ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </>
                )}
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        {/* Section Manager Sidebar */}
        <SectionManager
          sections={sectionsList}
          onToggle={handleSectionToggle}
          activeSection={activeSection}
          onSectionSelect={setActiveSection}
        />

        {/* Content Area */}
        <div className="flex-1 flex">
          {!showPreview ? (
            // Form Section
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-2xl mx-auto">
                {/* Form content based on activeSection */}
                {activeSection === "contact" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <EditableText
                            value={resumeData.contact_info.name}
                            onChange={(value) =>
                              handleContactInfoChange("name", value)
                            }
                            placeholder="John Doe"
                          />
                        </div>
                        {/* Add other personal info fields */}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Professional Summary
                        </h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={showSummary}
                            onChange={() => setShowSummary(!showSummary)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            Show in resume
                          </span>
                        </label>
                      </div>
                      <EditableText
                        value={resumeData.summary}
                        onChange={(value) =>
                          handleInputChange("summary", value)
                        }
                        multiline={true}
                        placeholder="Write a professional summary..."
                      />
                    </div>
                  </div>
                )}
                {/* Other section forms */}
              </div>
            </div>
          ) : (
            // Preview Section
            <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
              <div className="max-w-[850px] mx-auto bg-white rounded-lg shadow-sm">
                <div
                  ref={resumeRef}
                  className="p-12"
                  style={{
                    minHeight: "297mm",
                    width: "210mm",
                  }}
                >
                  {/* Resume Preview */}
                  <div className="space-y-8">
                    {/* Header/Contact Section */}
                    <header className="border-b-2 border-gray-800 pb-4">
                      <EditableText
                        value={resumeData.contact_info.name}
                        onChange={(value) =>
                          handleContactInfoChange("name", value)
                        }
                        placeholder="Your Name"
                        className="text-4xl font-bold text-gray-900 mb-2"
                      />
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          </svg>
                          <EditableText
                            value={resumeData.contact_info.email}
                            onChange={(value) =>
                              handleContactInfoChange("email", value)
                            }
                            placeholder="your.email@example.com"
                          />
                        </div>
                        {resumeData.contact_info.phone && (
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {resumeData.contact_info.phone}
                          </div>
                        )}
                        {resumeData.contact_info.location && (
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {resumeData.contact_info.location}
                          </div>
                        )}
                        {resumeData.contact_info.linkedin && (
                          <a
                            href={resumeData.contact_info.linkedin}
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M15.475 13.0625V10.0312C15.475 8.375 14.1875 7.1875 12.6562 7.1875C11.4062 7.1875 10.7188 7.9375 10.4062 8.4375V7.375H8.15625V13.0625H10.4062V10.2812C10.4062 9.21875 10.7188 8.5 11.5938 8.5C12.4375 8.5 12.75 9.21875 12.75 10.2812V13.0625H15.475ZM6.5625 6.0625C7.28125 6.0625 7.875 5.46875 7.875 4.75C7.875 4.03125 7.28125 3.4375 6.5625 3.4375C5.84375 3.4375 5.25 4.03125 5.25 4.75C5.25 5.46875 5.84375 6.0625 6.5625 6.0625ZM7.6875 13.0625V7.375H5.4375V13.0625H7.6875Z" />
                            </svg>
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </header>

                    {/* Professional Summary */}
                    {showSummary && resumeData.summary && (
                      <section>
                        <h2 className="text-lg font-bold text-gray-900 uppercase mb-3 pb-1 border-b">
                          Professional Summary
                        </h2>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {resumeData.summary}
                        </p>
                      </section>
                    )}

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-3 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Skills Section */}
                        {showSkills && resumeData.skills.length > 0 && (
                          <section>
                            <h2 className="text-lg font-bold text-gray-900 uppercase mb-3 pb-1 border-b">
                              Skills
                            </h2>
                            <div className="space-y-2">
                              {resumeData.skills.map((skill, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center"
                                >
                                  <EditableText
                                    value={skill.skill}
                                    onChange={(value) =>
                                      handleSkillsChange(index, "skill", value)
                                    }
                                    placeholder="Add a skill"
                                  />
                                  <select
                                    value={skill.level}
                                    onChange={(e) =>
                                      handleSkillsChange(
                                        index,
                                        "level",
                                        e.target.value
                                      )
                                    }
                                    className="text-sm text-gray-500 border-none bg-transparent"
                                  >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">
                                      Intermediate
                                    </option>
                                    <option value="proficient">
                                      Proficient
                                    </option>
                                  </select>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeSkill(index);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={addSkill}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                + Add Skill
                              </button>
                            </div>
                          </section>
                        )}

                        {/* Languages Section */}
                        {showLanguages && resumeData.languages.length > 0 && (
                          <section>
                            <h2 className="text-lg font-bold text-gray-900 uppercase mb-3 pb-1 border-b">
                              Languages
                            </h2>
                            <div className="space-y-2">
                              {resumeData.languages.map((lang, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <EditableText
                                    value={lang.language}
                                    onChange={(value) =>
                                      handleLanguagesChange(
                                        index,
                                        "language",
                                        value
                                      )
                                    }
                                    placeholder="Add a language"
                                  />
                                  <select
                                    value={lang.level}
                                    onChange={(e) =>
                                      handleLanguagesChange(
                                        index,
                                        "level",
                                        e.target.value
                                      )
                                    }
                                    className="text-sm text-gray-500 border-none bg-transparent"
                                  >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">
                                      Intermediate
                                    </option>
                                    <option value="proficient">
                                      Proficient
                                    </option>
                                  </select>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeLanguage(index);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={addLanguage}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                + Add Language
                              </button>
                            </div>
                          </section>
                        )}

                        {/* Education Section */}
                        {showEducation && resumeData.education.length > 0 && (
                          <section>
                            <h2 className="text-lg font-bold text-gray-900 uppercase mb-3 pb-1 border-b">
                              Education
                            </h2>
                            <div className="space-y-4">
                              {resumeData.education.map((edu, index) => (
                                <div key={index} className="text-sm">
                                  <div className="font-medium text-gray-900">
                                    <EditableText
                                      value={edu.degree}
                                      onChange={(value) =>
                                        handleEducationChange(
                                          index,
                                          "degree",
                                          value
                                        )
                                      }
                                      placeholder="Degree"
                                    />
                                  </div>
                                  <div className="text-gray-700">
                                    <EditableText
                                      value={edu.institution}
                                      onChange={(value) =>
                                        handleEducationChange(
                                          index,
                                          "institution",
                                          value
                                        )
                                      }
                                      placeholder="Institution"
                                    />
                                  </div>
                                  <div className="text-gray-500">
                                    <EditableText
                                      value={edu.year}
                                      onChange={(value) =>
                                        handleEducationChange(
                                          index,
                                          "year",
                                          value
                                        )
                                      }
                                      placeholder="Year"
                                    />
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={addEducation}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                + Add Education
                              </button>
                            </div>
                          </section>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="col-span-2 space-y-6">
                        {/* Experience Section */}
                        {showEmploymentHistory &&
                          resumeData.employmentHistory.length > 0 && (
                            <section>
                              <h2 className="text-lg font-bold text-gray-900 uppercase mb-3 pb-1 border-b">
                                Professional Experience
                              </h2>
                              <div className="space-y-4">
                                {resumeData.employmentHistory.map(
                                  (job, index) => (
                                    <div key={index} className="text-sm">
                                      <div className="flex justify-between mb-1">
                                        <div className="font-medium text-gray-900">
                                          <EditableText
                                            value={job.jobTitle}
                                            onChange={(value) =>
                                              handleEmploymentHistoryChange(
                                                index,
                                                "jobTitle",
                                                value
                                              )
                                            }
                                            placeholder="Job Title"
                                          />
                                        </div>
                                        <div className="text-gray-500">
                                          {job.startDate} -{" "}
                                          {job.presentWorking
                                            ? "Present"
                                            : job.endDate}
                                        </div>
                                      </div>
                                      <div className="text-gray-700 mb-1">
                                        <EditableText
                                          value={job.company}
                                          onChange={(value) =>
                                            handleEmploymentHistoryChange(
                                              index,
                                              "company",
                                              value
                                            )
                                          }
                                          placeholder="Company"
                                        />
                                        •
                                        <EditableText
                                          value={job.city}
                                          onChange={(value) =>
                                            handleEmploymentHistoryChange(
                                              index,
                                              "city",
                                              value
                                            )
                                          }
                                          placeholder="City"
                                        />
                                      </div>
                                      <p className="text-gray-600 leading-relaxed">
                                        <EditableText
                                          value={job.description}
                                          onChange={(value) =>
                                            handleEmploymentHistoryChange(
                                              index,
                                              "description",
                                              value
                                            )
                                          }
                                          multiline={true}
                                          placeholder="Description"
                                        />
                                      </p>
                                    </div>
                                  )
                                )}
                                <button
                                  onClick={addEmploymentHistory}
                                  className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                  + Add Experience
                                </button>
                              </div>
                            </section>
                          )}

                        {/* Projects Section */}
                        {showProjects && resumeData.projects.length > 0 && (
                          <section>
                            <h2 className="text-lg font-bold text-gray-900 uppercase mb-3 pb-1 border-b">
                              Projects
                            </h2>
                            <div className="space-y-4">
                              {resumeData.projects.map((project, index) => (
                                <div key={index} className="text-sm">
                                  <div className="flex justify-between mb-1">
                                    <div className="font-medium text-gray-900">
                                      <EditableText
                                        value={project.title}
                                        onChange={(value) =>
                                          handleProjectsChange(
                                            index,
                                            "title",
                                            value
                                          )
                                        }
                                        placeholder="Project Title"
                                      />
                                    </div>
                                    <div className="text-gray-500">
                                      <EditableText
                                        value={project.role}
                                        onChange={(value) =>
                                          handleProjectsChange(
                                            index,
                                            "role",
                                            value
                                          )
                                        }
                                        placeholder="Role"
                                      />
                                    </div>
                                  </div>
                                  <div className="text-gray-700 mb-1">
                                    <EditableText
                                      value={project.techStackUsed.join(" • ")}
                                      onChange={(value) =>
                                        handleTechStackChange(index, value)
                                      }
                                      multiline={true}
                                      placeholder="Tech Stack"
                                    />
                                  </div>
                                  <p className="text-gray-600 leading-relaxed">
                                    <EditableText
                                      value={project.description}
                                      onChange={(value) =>
                                        handleProjectsChange(
                                          index,
                                          "description",
                                          value
                                        )
                                      }
                                      multiline={true}
                                      placeholder="Description"
                                    />
                                  </p>
                                </div>
                              ))}
                              <button
                                onClick={addProject}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                + Add Project
                              </button>
                            </div>
                          </section>
                        )}

                        {/* Achievements Section */}
                        {showAchievements &&
                          resumeData.achievements.length > 0 && (
                            <section>
                              <h2 className="text-lg font-bold text-gray-900 uppercase mb-3 pb-1 border-b">
                                Achievements
                              </h2>
                              <div className="space-y-4">
                                {resumeData.achievements.map(
                                  (achievement, index) => (
                                    <div key={index} className="text-sm">
                                      <div className="font-medium text-gray-900 mb-1">
                                        <EditableText
                                          value={achievement.title}
                                          onChange={(value) =>
                                            handleAchievementsChange(
                                              index,
                                              "title",
                                              value
                                            )
                                          }
                                          placeholder="Achievement Title"
                                        />
                                      </div>
                                      <div className="text-gray-500 mb-1">
                                        <EditableText
                                          value={achievement.date}
                                          onChange={(value) =>
                                            handleAchievementsChange(
                                              index,
                                              "date",
                                              value
                                            )
                                          }
                                          placeholder="Date"
                                        />
                                      </div>
                                      <p className="text-gray-600 leading-relaxed">
                                        <EditableText
                                          value={achievement.description}
                                          onChange={(value) =>
                                            handleAchievementsChange(
                                              index,
                                              "description",
                                              value
                                            )
                                          }
                                          multiline={true}
                                          placeholder="Description"
                                        />
                                      </p>
                                    </div>
                                  )
                                )}
                                <button
                                  onClick={addAchievement}
                                  className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                  + Add Achievement
                                </button>
                              </div>
                            </section>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add section controls */}
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download PDF
        </button>
        <div className="relative">
          <button
            onClick={() => setShowSectionManager(!showSectionManager)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Manage Sections
          </button>
          {showSectionManager && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-4 w-64">
              {sectionsList.map(({ id, label, show }) => (
                <label
                  key={id}
                  className="flex items-center justify-between p-2"
                >
                  <span className="text-sm text-gray-700">{label}</span>
                  <input
                    type="checkbox"
                    checked={show}
                    onChange={() => handleSectionToggle(id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
