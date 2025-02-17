import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSpring, animated } from "@react-spring/web";
import html2pdf from "html2pdf.js";
import SideBar from "./sideBar";
import { FaPlus, FaPuzzlePiece, FaTimes } from "react-icons/fa";
import { AddSectionModal } from "./AddSectionModal";

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
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [activeSections, setActiveSections] = useState(["contact", "summary"]);
  const [isEditing, setIsEditing] = useState(null);

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
          {/* <div className="space-y-2">
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
          </div> */}
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

  const handleAddSection = (sectionId) => {
    console.log(sectionId, "sectionid");
    if (activeSections.includes(sectionId)) {
      handleRemoveSection(sectionId);
      return;
    }

    setActiveSections((prev) => [...prev, sectionId]);

    // Initialize section data based on type
    switch (sectionId) {
      case "summary":
        setResumeData((prev) => ({
          ...prev,
          summary: "",
        }));
        break;
      case "experience":
        setResumeData((prev) => ({
          ...prev,
          experience: [
            {
              title: "",
              company: "",
              location: "",
              startDate: "",
              endDate: "",
              description: "",
              isPresent: false,
            },
          ],
        }));
        break;
      case "education":
        setResumeData((prev) => ({
          ...prev,
          education: [
            {
              degree: "",
              institution: "",
              location: "",
              graduationDate: "",
              gpa: "",
            },
          ],
        }));
        break;
      case "skills":
        setResumeData((prev) => ({
          ...prev,
          skills: [
            {
              category: "",
              skills: [],
            },
          ],
        }));
        break;
      case "languages":
        setResumeData((prev) => ({
          ...prev,
          languages: [
            {
              language: "",
              level: "intermediate",
            },
          ],
        }));
        break;
      case "projects":
        setResumeData((prev) => ({
          ...prev,
          projects: [
            {
              title: "",
              techStack: [],
              description: "",
              link: "",
            },
          ],
        }));
        break;
      case "achievements":
        setResumeData((prev) => ({
          ...prev,
          achievements: [
            {
              title: "",
              date: "",
              description: "",
            },
          ],
        }));
        break;
      // Add other cases for remaining sections
    }

    setShowAddSectionModal(false);
  };

  const handleRemoveSection = (sectionId) => {
    setActiveSections((prev) => prev.filter((id) => id !== sectionId));
  };

  const EmptySectionCard = () => (
    <div className="flex-1 flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-6">
        <div
          onClick={() => setShowAddSectionModal(true)}
          className="group relative bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 transition-all duration-300 max-w-md mx-auto"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <FaPuzzlePiece className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Add Your First Section
              </h3>
              <p className="text-gray-600 mb-4">
                Start building your resume by adding relevant sections
              </p>
              <span className="inline-flex items-center gap-2 text-blue-600 font-medium">
                <FaPlus className="w-4 h-4" />
                Add Section
              </span>
            </div>
          </div>
          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity" />
        </div>
      </div>
    </div>
  );

  // Professional input field component
  // Update the ResumeInput component
  const ResumeInput = ({
    value,
    onChange,
    placeholder,
    multiline = false,
    className = "",
    type = "text",
    disabled = false,
  }) => {
    const inputRef = useRef(null);
  
    const baseClasses = `
      w-full 
      border-b 
      border-transparent hover:border-gray-300 
      focus:border-blue-500 
      transition-colors
      bg-transparent
      focus:outline-none
      focus:ring-0
      px-2 
      py-1 
      rounded
      ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-text"}
      ${className}
    `;
  
    if (multiline) {
      return (
        <textarea
          ref={inputRef}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseClasses} resize-none min-h-[100px]`}
          rows={4}
        />
      );
    }
  
    return (
      <input
        ref={inputRef}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={baseClasses}
      />
    );
  };

  

  // Resume page component
  const ResumePage = ({ pageNumber }) => (
    <div className="w-[210mm] min-h-[297mm] bg-white p-[25mm] shadow-lg mb-8">
      {pageNumber === 1 && (
        <>
          {/* Contact Section */}
          <div className="mb-8">
            <ResumeInput
              value={resumeData.contact_info.name}
              onChange={(value) => handleContactInfoChange("name", value)}
              placeholder="Full Name"
              className="text-3xl font-bold mb-4 hover:bg-gray-50/50"
            />
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div className="group relative">
                <ResumeInput
                  value={resumeData.contact_info.email}
                  onChange={(value) => handleContactInfoChange("email", value)}
                  placeholder="Email"
                  className="group-hover:bg-gray-50/50"
                />
              </div>
              <div className="group relative">
                <ResumeInput
                  value={resumeData.contact_info.phone}
                  onChange={(value) => handleContactInfoChange("phone", value)}
                  placeholder="phone"
                  className="group-hover:bg-gray-50/50"
                />
              </div>
              <div className="group relative">
                <ResumeInput
                  value={resumeData.contact_info.location}
                  onChange={(value) =>
                    handleContactInfoChange("location", value)
                  }
                  placeholder="location"
                  className="group-hover:bg-gray-50/50"
                />
              </div>
              <div className="group relative">
                <ResumeInput
                  value={resumeData.contact_info.linkedin}
                  onChange={(value) =>
                    handleContactInfoChange("linkedin", value)
                  }
                  placeholder="linkedin"
                  className="group-hover:bg-gray-50/50"
                />
              </div>
            </div>
          </div>

          {/* Summary Section */}
          {activeSections.includes("summary") && (
            <div className="mb-8 relative group">
              <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemoveSection("summary")}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
                Professional Summary
              </h2>
              <ResumeInput
                value={resumeData.summary}
                onChange={(value) => handleInputChange("summary", value)}
                placeholder="Write your professional summary..."
                multiline
                className="group-hover:bg-gray-50/50"
              />
            </div>
          )}

          {/* Other sections */}
          {
            // console.log("activeSections", activeSections);
            activeSections
              .filter(
                (section) => section !== "contact" && section !== "summary"
              )
              .map((section) => (
                <div key={section} className="mb-8 relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemoveSection(section)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <RenderSection
                    section={section}
                    data={resumeData[section]}
                    onChange={(value) => handleInputChange(section, value)}
                  />
                </div>
              ))
          }

          {/* Add Section Card */}
          {/* {activeSections.length <= 2 && ( */}
          <div
            onClick={() => setShowAddSectionModal(true)}
            className="mt-12 border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all duration-300 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <FaPlus className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Add a Section
                </h3>
                <p className="text-gray-600">
                  Enhance your resume with additional sections
                </p>
              </div>
            </div>
          </div>
          {/* )} */}
        </>
      )}
    </div>
  );

  // Section renderer component
  const RenderSection = ({ section, data, onChange }) => {
    switch (section) {
      case "experience":
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
              Work Experience
            </h2>
            {data.map((exp, index) => (
              <div key={index} className="mb-6">
                <ResumeInput
                  value={exp.jobTitle}
                  onChange={(value) =>
                    handleEmploymentHistoryChange(index, "jobTitle", value)
                  }
                  placeholder="Job Title"
                  className="font-semibold"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <ResumeInput
                    value={exp.company}
                    onChange={(value) =>
                      handleEmploymentHistoryChange(index, "company", value)
                    }
                    placeholder="Company"
                  />
                  <ResumeInput
                    value={exp.city}
                    onChange={(value) =>
                      handleEmploymentHistoryChange(index, "city", value)
                    }
                    placeholder="Location"
                  />
                  <ResumeInput
                    value={exp.startDate}
                    onChange={(value) =>
                      handleEmploymentHistoryChange(index, "startDate", value)
                    }
                    placeholder="Start Date"
                    type="date"
                  />
                  <ResumeInput
                    value={exp.endDate}
                    onChange={(value) =>
                      handleEmploymentHistoryChange(index, "endDate", value)
                    }
                    placeholder="End Date"
                    type="date"
                    disabled={exp.presentWorking}
                  />
                </div>
                <ResumeInput
                  value={exp.description}
                  onChange={(value) =>
                    handleEmploymentHistoryChange(index, "description", value)
                  }
                  placeholder="Description"
                  multiline
                  className="mt-2"
                />
              </div>
            ))}
            <button
              onClick={addEmploymentHistory}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2"
            >
              <FaPlus /> Add Experience
            </button>
          </>
        );

      case "skills":
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
              Skills
            </h2>
            {data.map((skill, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                <ResumeInput
                  value={skill.skill}
                  onChange={(value) =>
                    handleSkillsChange(index, "skill", value)
                  }
                  placeholder="Skill"
                  className="flex-1"
                />
                <select
                  value={skill.level}
                  onChange={(e) =>
                    handleSkillsChange(index, "level", e.target.value)
                  }
                  className="px-3 py-1 border rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <button
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              onClick={addSkill}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2"
            >
              <FaPlus /> Add Skill
            </button>
          </>
        );

      case "education":
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
              Education
            </h2>
            {data.map((edu, index) => (
              <div key={index} className="mb-6">
                <ResumeInput
                  value={edu.degree}
                  onChange={(value) =>
                    handleEducationChange(index, "degree", value)
                  }
                  placeholder="Degree"
                  className="font-semibold"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <ResumeInput
                    value={edu.institution}
                    onChange={(value) =>
                      handleEducationChange(index, "institution", value)
                    }
                    placeholder="Institution"
                  />
                  <ResumeInput
                    value={edu.year}
                    onChange={(value) =>
                      handleEducationChange(index, "year", value)
                    }
                    placeholder="Year"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2"
            >
              <FaPlus /> Add Education
            </button>
          </>
        );

      // Add other cases for remaining sections
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="flex h-screen">
        <SideBar
          onAddSection={handleAddSection}
          onRemoveSection={handleRemoveSection}
          activeSections={activeSections}
        />

        <div className="flex-1 overflow-auto">
          <div className="max-w-[850px] mx-auto py-8">
            {/* Render pages */}
            {Array.from({ length: Math.ceil(activeSections.length / 4) }).map(
              (_, index) => (
                <ResumePage key={index} pageNumber={index + 1} />
              )
            )}
          </div>
        </div>
      </div>

      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onAddSection={handleAddSection}
        onRemoveSection={handleRemoveSection}
        activeSections={activeSections}
      />
    </div>
  );
};

// Resume Section Component
const ResumeSection = ({ section, isEditing, onEdit, data, onChange }) => {
  // Render different section layouts based on section type
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2 uppercase tracking-wider">
        {section}
      </h2>
      <div
        className={`${isEditing ? "bg-gray-50 p-4 rounded-lg" : ""}`}
        onClick={onEdit}
      >
        {/* Render section specific content */}
      </div>
    </div>
  );
};

export default ResumeBuilder;