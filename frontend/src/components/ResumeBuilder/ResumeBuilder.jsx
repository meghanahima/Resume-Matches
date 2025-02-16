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
      newEmploymentHistory[index] = { ...newEmploymentHistory[index], [field]: value };
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
      filename: `${resumeData.contact_info.name.replace(/\s+/g, "_")}_resume.pdf`,
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

  return (
    <animated.div
      style={fadeIn}
      className="min-h-screen bg-gray-50 pt-20 pb-12 px-4"
      onMouseEnter={() => setShowSaveButton(true)}
      onMouseLeave={() => setShowSaveButton(false)}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Added scrollable container */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={resumeData.contact_info.name}
                onChange={(e) =>
                  handleContactInfoChange("name", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={resumeData.contact_info.email}
                onChange={(e) =>
                  handleContactInfoChange("email", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={resumeData.contact_info.phone}
                onChange={(e) =>
                  handleContactInfoChange("phone", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={resumeData.contact_info.location}
                onChange={(e) =>
                  handleContactInfoChange("location", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="LinkedIn Profile"
                value={resumeData.contact_info.linkedin}
                onChange={(e) =>
                  handleContactInfoChange("linkedin", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Portfolio URL"
                value={resumeData.contact_info.portfolio}
                onChange={(e) =>
                  handleContactInfoChange("portfolio", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold ">Summary</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showSummary}
                  onChange={() => setShowSummary(!showSummary)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            <textarea
              placeholder="Professional Summary"
              value={resumeData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-32"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Skills</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showSkills}
                  onChange={() => setShowSkills(!showSkills)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            {resumeData.skills.map((skillItem, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="Skill"
                  value={skillItem.skill || ""}
                  onChange={(e) =>
                    handleSkillsChange(index, "skill", e.target.value)
                  }
                  className="w-1/3 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <SkillLevelSlider
                  level={skillItem.level || "intermediate"}
                  onChange={(level) => handleSkillsChange(index, "level", level)}
                />

                <button
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              onClick={addSkill}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Skill
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Languages</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showLanguages}
                  onChange={(e) => setShowLanguages(!showLanguages)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            {resumeData.languages.map((languageItem, index) => (
              <div key={index} className="space-y-2 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Language"
                    value={languageItem.language || ""}
                    onChange={(e) =>
                      handleLanguagesChange(index, "language", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Level"
                    value={languageItem.level || ""}
                    onChange={(e) =>
                      handleLanguagesChange(index, "level", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => removeLanguage(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addLanguage}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Language
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Employment History</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showEmploymentHistory}
                  onChange={(e) => setShowEmploymentHistory(!showEmploymentHistory)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            {resumeData.employmentHistory.map((job, index) => (
              <div key={index} className="space-y-4 mb-6 relative">
                <button
                  onClick={() => removeEmploymentHistory(index)}
                  className="text-red-500 hover:text-red-700 absolute top-0 right-0"
                >
                  Remove
                </button>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={job.jobTitle || ""}
                  onChange={(e) =>
                    handleEmploymentHistoryChange(index, "jobTitle", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={job.company || ""}
                  onChange={(e) =>
                    handleEmploymentHistoryChange(index, "company", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={job.city || ""}
                  onChange={(e) =>
                    handleEmploymentHistoryChange(index, "city", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={job.startDate || ""}
                    onChange={(e) =>
                      handleEmploymentHistoryChange(
                        index,
                        "startDate",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={job.endDate || ""}
                    onChange={(e) =>
                      handleEmploymentHistoryChange(index, "endDate", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={job.description || ""}
                  onChange={(e) =>
                    handleEmploymentHistoryChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-24"
                />
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-gray-600 rounded"
                    checked={job.presentWorking || false}
                    onChange={(e) =>
                      handleEmploymentHistoryChange(
                        index,
                        "presentWorking",
                        e.target.checked
                      )
                    }
                  />
                  <span className="ml-2 text-gray-700">Currently Working</span>
                </label>
              </div>
            ))}
            <button
              onClick={addEmploymentHistory}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Employment
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Internships</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showInternships}
                  onChange={(e) => setShowInternships(!showInternships)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            {resumeData.internships.map((internship, index) => (
              <div key={index} className="space-y-4 mb-6 relative">
                <button
                  onClick={() => removeInternship(index)}
                  className="text-red-500 hover:text-red-700 absolute top-0 right-0"
                >
                  Remove
                </button>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={internship.jobTitle || ""}
                  onChange={(e) =>
                    handleInternshipsChange(index, "jobTitle", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Employer"
                  value={internship.employer || ""}
                  onChange={(e) =>
                    handleInternshipsChange(index, "employer", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={internship.city || ""}
                  onChange={(e) =>
                    handleInternshipsChange(index, "city", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={internship.startDate || ""}
                    onChange={(e) =>
                      handleInternshipsChange(index, "startDate", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={internship.endDate || ""}
                    onChange={(e) =>
                      handleInternshipsChange(index, "endDate", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={internship.description || ""}
                  onChange={(e) =>
                    handleInternshipsChange(index, "description", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
            ))}
            <button
              onClick={addInternship}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Internship
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Projects</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showProjects}
                  onChange={(e) => setShowProjects(!showProjects)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="space-y-4 mb-6 relative">
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-500 hover:text-red-700 absolute top-0 right-0"
                >
                  Remove
                </button>
                <input
                  type="text"
                  placeholder="Title"
                  value={project.title || ""}
                  onChange={(e) =>
                    handleProjectsChange(index, "title", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Tech Stack Used (comma-separated)"
                  value={project.techStackUsed ? project.techStackUsed.join(", ") : ""}
                  onChange={(e) => handleTechStackChange(index, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={project.role || ""}
                  onChange={(e) =>
                    handleProjectsChange(index, "role", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description"
                  value={project.description || ""}
                  onChange={(e) =>
                    handleProjectsChange(index, "description", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
            ))}
            <button
              onClick={addProject}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Project
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Education</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showEducation}
                  onChange={(e) => setShowEducation(!showEducation)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="space-y-4 mb-6 relative">
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 absolute top-0 right-0"
                >
                  Remove
                </button>
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "degree", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "institution", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "year", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              onClick={addEducation}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Education
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Courses</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showCourses}
                  onChange={(e) => setShowCourses(!showCourses)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            {resumeData.courses.map((course, index) => (
              <div key={index} className="space-y-4 mb-6 relative">
                <button
                  onClick={() => removeCourse(index)}
                  className="text-red-500 hover:text-red-700 absolute top-0 right-0"
                >
                  Remove
                </button>
                <input
                  type="text"
                  placeholder="Course Name"
                  value={course.course || ""}
                  onChange={(e) =>
                    handleCoursesChange(index, "course", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={course.institution || ""}
                  onChange={(e) =>
                    handleCoursesChange(index, "institution", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={course.startDate || ""}
                    onChange={(e) =>
                      handleCoursesChange(index, "startDate", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={course.endDate || ""}
                    onChange={(e) =>
                      handleCoursesChange(index, "endDate", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addCourse}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Course
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Achievements</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showAchievements}
                  onChange={(e) => setShowAchievements(!showAchievements)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            {resumeData.achievements.map((achievement, index) => (
              <div key={index} className="space-y-4 mb-6 relative">
                <button
                  onClick={() => removeAchievement(index)}
                  className="text-red-500 hover:text-red-700 absolute top-0 right-0"
                >
                  Remove
                </button>
                <input
                  type="text"
                  placeholder="Title"
                  value={achievement.title || ""}
                  onChange={(e) =>
                    handleAchievementsChange(index, "title", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={achievement.issuer || ""}
                  onChange={(e) =>
                    handleAchievementsChange(index, "issuer", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={achievement.date || ""}
                  onChange={(e) =>
                    handleAchievementsChange(index, "date", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description"
                  value={achievement.description || ""}
                  onChange={(e) =>
                    handleAchievementsChange(index, "description", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
            ))}
            <button
              onClick={addAchievement}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Achievement
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Hobbies</h2>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600 rounded"
                  checked={showHobbies}
                  onChange={(e) => setShowHobbies(!showHobbies)}
                />
                <span className="ml-2 text-gray-700">Show</span>
              </label>
            </div>
            {resumeData.hobbies.map((hobby, index) => (
              <div key={index} className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Hobby"
                  value={hobby || ""}
                  onChange={(e) => {
                    const newHobbies = [...resumeData.hobbies];
                    newHobbies[index] = e.target.value;
                    setResumeData((prev) => ({
                      ...prev,
                      hobbies: newHobbies,
                    }));
                  }}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeHobby(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addHobby}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Hobby
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="relative">
          {showSaveButton && (
            <button
              onClick={downloadPDF}
              className="absolute -top-4 right-4 px-4 py-2 bg-blue-600 text-white
                         rounded-lg hover:bg-blue-700 transition-colors z-10"
            >
              Save as PDF
            </button>
          )}
          <div
            ref={resumeRef}
            className="bg-gray-100 rounded-xl shadow-sm p-8 sticky top-24 h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          > {/* Added scrollable container and background */}
            {/* Page 1 */}
            <div className="page-break-inside-avoid">
              <div className="prose max-w-none">
                <div className="flex items-start space-x-6 mb-6 border-b pb-4"> {/* Reduced border-bottom spacing */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-semibold mb-1 text-gray-800"> {/* Made headings bold */}
                      {resumeData.contact_info.name}
                    </h1>
                    <div className="text-lg text-gray-600 mb-2"> {/* Reduced text size */}
                      {resumeData.contact_info.location && (
                        <div>{resumeData.contact_info.location}</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600"> {/* Reduced grid spacing */}
                      {resumeData.contact_info.email && (
                        <div className="flex items-center space-x-1"> {/* Reduced spacing for contact items */}
                          <span>📧</span>
                          <span>{resumeData.contact_info.email}</span>
                        </div>
                      )}
                      {resumeData.contact_info.phone && (
                        <div className="flex items-center space-x-1">
                          <span>📱</span>
                          <span>{resumeData.contact_info.phone}</span>
                        </div>
                      )}
                      {resumeData.contact_info.linkedin && (
                        <div className="flex items-center space-x-1">
                          <span>💼</span>
                          <a
                            href={resumeData.contact_info.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            LinkedIn
                          </a>
                        </div>
                      )}
                      {resumeData.contact_info.portfolio && (
                        <div className="flex items-center space-x-1">
                          <span>🌐</span>
                          <a
                            href={resumeData.contact_info.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Portfolio
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showSummary && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1 uppercase"> {/* Reduced heading size */}
                      Professional Summary
                    </h2>
                    {resumeData.summary && (
                      <div className="mb-4"> {/* Reduced summary spacing */}
                        <p className="text-gray-700 text-justify text-sm"> {/* Reduced paragraph spacing */}
                          {resumeData.summary}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {showSkills && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase"> {/* Reduced heading size */}
                      Skills
                    </h2>
                    {resumeData.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skillItem, index) => (
                            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                              {skillItem.skill} ({skillItem.level})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {showLanguages && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase"> {/* Reduced heading size */}
                      Languages
                    </h2>
                    {resumeData.languages.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {resumeData.languages.map((languageItem, index) => (
                            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                              {languageItem.language} ({languageItem.level})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {showEmploymentHistory && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase"> {/* Reduced heading size */}
                      Employment History
                    </h2>
                    {resumeData.employmentHistory.length > 0 && (
                      <div className="mb-4">
                        {resumeData.employmentHistory.map((job, index) => (
                          <div key={index} className="mb-2"> {/* Reduced item spacing */}
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900 text-lg">{job.jobTitle}</h3> {/* Reduced heading size */}
                                <p className="text-gray-600 text-sm">{job.company}</p> {/* Reduced text size */}
                                <p className="text-gray-600 text-sm">{job.city}</p> {/* Reduced text size */}
                              </div>
                              <span className="text-gray-500 text-sm">
                                {job.startDate} - {job.presentWorking ? "Present" : job.endDate}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-1 text-justify text-sm">{job.description}</p> {/* Reduced paragraph spacing and size */}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {showInternships && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase"> {/* Reduced heading size */}
                      Internships
                    </h2>
                    {resumeData.internships.length > 0 && (
                      <div className="mb-4">
                        {resumeData.internships.map((internship, index) => (
                          <div key={index} className="mb-2"> {/* Reduced item spacing */}
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900 text-lg">{internship.jobTitle}</h3> {/* Reduced heading size */}
                                <p className="text-gray-600 text-sm">{internship.employer}</p> {/* Reduced text size */}
                                <p className="text-gray-600 text-sm">{internship.city}</p> {/* Reduced text size */}
                              </div>
                              <span className="text-gray-500 text-sm">
                                {internship.startDate} - {internship.endDate}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-1 text-justify text-sm">{internship.description}</p> {/* Reduced paragraph spacing and size */}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Page 2 */}
            <div className="page-break-before page-break-inside-avoid">
              <div className="prose max-w-none">
                {showProjects && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase"> {/* Reduced heading size */}
                      Projects
                    </h2>
                    {resumeData.projects.length > 0 && (
                      <div className="mb-4">
                        {resumeData.projects.map((project, index) => (
                          <div key={index} className="mb-2"> {/* Reduced item spacing */}
                            <h3 className="font-medium text-gray-900 text-lg">{project.title}</h3> {/* Reduced heading size */}
                            <p className="text-gray-600 text-sm">Role: {project.role}</p> {/* Reduced text size */}
                            {project.techStackUsed && project.techStackUsed.length > 0 && (
                              <p className="text-gray-600 text-sm">
                                Tech Stack: {project.techStackUsed.join(", ")}
                              </p>
                            )}
                            <p className="text-gray-700 mt-1 text-justify text-sm">{project.description}</p> {/* Reduced paragraph spacing and size */}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {showEducation && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase"> {/* Reduced heading size */}
                      Education
                    </h2>
                    {resumeData.education.length > 0 && (
                      <div className="mb-4">
                        {resumeData.education.map((edu, index) => (
                          <div key={index} className="mb-2"> {/* Reduced item spacing */}
                            <h3 className="font-medium text-gray-900 text-lg">{edu.degree}</h3> {/* Reduced heading size */}
                            <p className="text-gray-600 text-sm">{edu.institution}</p> {/* Reduced text size */}
                            <p className="text-gray-600 text-sm">Year: {edu.year}</p> {/* Reduced text size */}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {showCourses && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase"> {/* Reduced heading size */}
                      Courses
                    </h2>
                    {resumeData.courses.length > 0 && (
                      <div className="mb-4">
                        {resumeData.courses.map((course, index) => (
                          <div key={index} className="mb-2"> {/* Reduced item spacing */}
                            <h3 className="font-medium text-gray-900 text-lg">{course.course}</h3> {/* Reduced heading size */}
                            <p className="text-gray-600 text-sm">{course.institution}</p> {/* Reduced text size */}
                            <p className="text-gray-600 text-sm">
                              {course.startDate} - {course.endDate}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {showAchievements && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase"> {/* Reduced heading size */}
                      Achievements
                    </h2>
                    {resumeData.achievements.length > 0 && (
                      <div className="mb-4">
                        {resumeData.achievements.map((achievement, index) => (
                          <div key={index} className="mb-2"> {/* Reduced item spacing */}
                            <h3 className="font-medium text-gray-900 text-lg">{achievement.title}</h3> {/* Reduced heading size */}
                            <p className="text-gray-600 text-sm">Issuer: {achievement.issuer}</p> {/* Reduced text size */}
                            <p className="text-gray-600 text-sm">Date: {achievement.date}</p> {/* Reduced text size */}
                            <p className="text-gray-700 mt-1 text-justify text-sm">{achievement.description}</p> {/* Reduced paragraph spacing and size */}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {showHobbies && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase"> {/* Reduced heading size */}
                      Hobbies
                    </h2>
                    {resumeData.hobbies.length > 0 && (
                      <div>
                        <ul className="list-disc pl-5 text-gray-700 text-sm"> {/* Reduced text size */}
                          {resumeData.hobbies.map((hobby, index) => (
                            <li key={index}>{hobby}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default ResumeBuilder;

// import React, { useState, useRef } from "react";
// import { useSpring, animated } from "@react-spring/web";
// import html2pdf from "html2pdf.js";

// const ResumeBuilder = () => {
//   const resumeRef = useRef(null);
//   const [showSaveButton, setShowSaveButton] = useState(false);
//   const [showSummary, setShowSummary] = useState(true);
//   const [showSkills, setShowSkills] = useState(true);
//   const [showLanguages, setShowLanguages] = useState(true);
//   const [showEmploymentHistory, setShowEmploymentHistory] = useState(true);
//   const [showInternships, setShowInternships] = useState(true);
//   const [showProjects, setShowProjects] = useState(true);
//   const [showEducation, setShowEducation] = useState(true);
//   const [showCourses, setShowCourses] = useState(true);
//   const [showAchievements, setShowAchievements] = useState(true);
//   const [showHobbies, setShowHobbies] = useState(true);

//   const [resumeData, setResumeData] = useState({
//     contact_info: {
//       name: "",
//       email: "",
//       phone: "",
//       location: "",
//       linkedin: "",
//       portfolio: "",
//     },
//     summary: "",
//     skills: [{ skill: "", level: "intermediate" }], // Default skill
//     languages: [{ language: "English", level: "proficient" }], // Default language
//     employmentHistory: [
//       {
//         jobTitle: "Software Engineer",
//         company: "Example Corp",
//         city: "New York",
//         startDate: "2022-01-01",
//         endDate: "2023-01-01",
//         description: "Developed features for a web application.",
//         presentWorking: false,
//       },
//     ],
//     internships: [
//       {
//         jobTitle: "Intern",
//         employer: "Example Inc",
//         startDate: "2021-06-01",
//         endDate: "2021-08-31",
//         city: "Los Angeles",
//         description: "Assisted with various tasks.",
//       },
//     ],
//     projects: [
//       {
//         title: "Personal Website",
//         techStackUsed: ["React", "Tailwind CSS"],
//         role: "Front-end Developer",
//         description: "Created a personal website to showcase skills.",
//       },
//     ],
//     education: [
//       {
//         degree: "Bachelor of Science",
//         institution: "Example University",
//         year: "2022",
//       },
//     ],
//     courses: [
//       {
//         course: "Web Development Bootcamp",
//         institution: "Example Academy",
//         startDate: "2021-01-01",
//         endDate: "2021-03-31",
//       },
//     ],
//     achievements: [
//       {
//         title: "Employee of the Month",
//         date: "2022-12-01",
//         description: "Recognized for outstanding performance.",
//         issuer: "Example Corp",
//       },
//     ],
//     hobbies: ["Reading", "Hiking"],
//   });

//   const fadeIn = useSpring({
//     opacity: 1,
//     from: { opacity: 0 },
//   });

//   const handleContactInfoChange = (field, value) => {
//     setResumeData((prev) => ({
//       ...prev,
//       contact_info: {
//         ...prev.contact_info,
//         [field]: value,
//       },
//     }));
//   };

//   const handleInputChange = (field, value) => {
//     setResumeData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleArrayInput = (field, value) => {
//     setResumeData((prev) => ({
//       ...prev,
//       [field]: value.split(",").map((item) => item.trim()),
//     }));
//   };

//   const handleSkillsChange = (index, field, value) => {
//     setResumeData((prev) => {
//       const newSkills = [...prev.skills];
//       newSkills[index] = { ...newSkills[index], [field]: value };
//       return { ...prev, skills: newSkills };
//     });
//   };

//   const addSkill = () => {
//     setResumeData((prev) => ({
//       ...prev,
//       skills: [...prev.skills, { skill: "", level: "intermediate" }],
//     }));
//   };

//   const removeSkill = (index) => {
//     setResumeData((prev) => ({
//       ...prev,
//       skills: prev.skills.filter((_, i) => i !== index),
//     }));
//   };

//   const handleLanguagesChange = (index, field, value) => {
//     setResumeData((prev) => {
//       const newLanguages = [...prev.languages];
//       newLanguages[index] = { ...newLanguages[index], [field]: value };
//       return { ...prev, languages: newLanguages };
//     });
//   };

//   const addLanguage = () => {
//     setResumeData((prev) => ({
//       ...prev,
//       languages: [...prev.languages, { language: "", level: "intermediate" }],
//     }));
//   };

//   const removeLanguage = (index) => {
//     setResumeData((prev) => ({
//       ...prev,
//       languages: prev.languages.filter((_, i) => i !== index),
//     }));
//   };

//   const handleEmploymentHistoryChange = (index, field, value) => {
//     setResumeData((prev) => {
//       const newEmploymentHistory = [...prev.employmentHistory];
//       newEmploymentHistory[index] = { ...newEmploymentHistory[index], [field]: value };
//       return { ...prev, employmentHistory: newEmploymentHistory };
//     });
//   };

//   const addEmploymentHistory = () => {
//     setResumeData((prev) => ({
//       ...prev,
//       employmentHistory: [
//         ...prev.employmentHistory,
//         {
//           jobTitle: "",
//           company: "",
//           city: "",
//           startDate: "",
//           endDate: "",
//           description: "",
//           presentWorking: false,
//         },
//       ],
//     }));
//   };

//   const removeEmploymentHistory = (index) => {
//     setResumeData((prev) => ({
//       ...prev,
//       employmentHistory: prev.employmentHistory.filter((_, i) => i !== index),
//     }));
//   };

//   const handleInternshipsChange = (index, field, value) => {
//     setResumeData((prev) => {
//       const newInternships = [...prev.internships];
//       newInternships[index] = { ...newInternships[index], [field]: value };
//       return { ...prev, internships: newInternships };
//     });
//   };

//   const addInternship = () => {
//     setResumeData((prev) => ({
//       ...prev,
//       internships: [
//         ...prev.internships,
//         {
//           jobTitle: "",
//           employer: "",
//           startDate: "",
//           endDate: "",
//           city: "",
//           description: "",
//         },
//       ],
//     }));
//   };

//   const removeInternship = (index) => {
//     setResumeData((prev) => ({
//       ...prev,
//       internships: prev.internships.filter((_, i) => i !== index),
//     }));
//   };

//   const handleProjectsChange = (index, field, value) => {
//     setResumeData((prev) => {
//       const newProjects = [...prev.projects];
//       newProjects[index] = { ...newProjects[index], [field]: value };
//       return { ...prev, projects: newProjects };
//     });
//   };

//   const handleTechStackChange = (index, value) => {
//     setResumeData((prev) => {
//       const newProjects = [...prev.projects];
//       newProjects[index] = {
//         ...newProjects[index],
//         techStackUsed: value.split(",").map((item) => item.trim()),
//       };
//       return { ...prev, projects: newProjects };
//     });
//   };

//   const addProject = () => {
//     setResumeData((prev) => ({
//       ...prev,
//       projects: [
//         ...prev.projects,
//         { title: "", techStackUsed: [], role: "", description: "" },
//       ],
//     }));
//   };

//   const removeProject = (index) => {
//     setResumeData((prev) => ({
//       ...prev,
//       projects: prev.projects.filter((_, i) => i !== index),
//     }));
//   };

//   const handleEducationChange = (index, field, value) => {
//     setResumeData((prev) => {
//       const newEducation = [...prev.education];
//       newEducation[index] = { ...newEducation[index], [field]: value };
//       return { ...prev, education: newEducation };
//     });
//   };

//   const addEducation = () => {
//     setResumeData((prev) => ({
//       ...prev,
//       education: [...prev.education, { degree: "", institution: "", year: "" }],
//     }));
//   };

//   const removeEducation = (index) => {
//     setResumeData((prev) => ({
//       ...prev,
//       education: prev.education.filter((_, i) => i !== index),
//     }));
//   };

//   const handleCoursesChange = (index, field, value) => {
//     setResumeData((prev) => {
//       const newCourses = [...prev.courses];
//       newCourses[index] = { ...newCourses[index], [field]: value };
//       return { ...prev, courses: newCourses };
//     });
//   };

//   const addCourse = () => {
//     setResumeData((prev) => ({
//       ...prev,
//       courses: [
//         ...prev.courses,
//         { course: "", institution: "", startDate: "", endDate: "" },
//       ],
//     }));
//   };

//   const removeCourse = (index) => {
//     setResumeData((prev) => ({
//       ...prev,
//       courses: prev.courses.filter((_, i) => i !== index),
//     }));
//   };

//   const handleAchievementsChange = (index, field, value) => {
//     setResumeData((prev) => {
//       const newAchievements = [...prev.achievements];
//       newAchievements[index] = { ...newAchievements[index], [field]: value };
//       return { ...prev, achievements: newAchievements };
//     });
//   };

//   const addAchievement = () => {
//     setResumeData((prev) => ({
//       ...prev,
//       achievements: [
//         ...prev.achievements,
//         { title: "", date: "", description: "", issuer: "" },
//       ],
//     }));
//   };

//   const removeAchievement = (index) => {
//     setResumeData((prev) => ({
//       ...prev,
//       achievements: prev.achievements.filter((_, i) => i !== index),
//     }));
//   };

//   const handleHobbiesChange = (index, value) => {
//     setResumeData((prev) => {
//       const newHobbies = [...prev.hobbies];
//       newHobbies[index] = value;
//       return {
//         ...prev,
//         hobbies: newHobbies,
//       };
//     });
//   };

//   const addHobby = () => {
//     setResumeData((prev) => ({
//       ...prev,
//       hobbies: [...prev.hobbies, ""],
//     }));
//   };

//   const removeHobby = (index) => {
//     setResumeData((prev) => ({
//       ...prev,
//       hobbies: prev.hobbies.filter((_, i) => i !== index),
//     }));
//   };

//   const downloadPDF = () => {
//     const element = resumeRef.current;

//     if (!element) {
//       console.error("Resume element not found.  Check the ref.");
//       return;
//     }

//     const opt = {
//       margin: [10, 10],
//       filename: `${resumeData.contact_info.name.replace(/\s+/g, "_")}_resume.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       pagebreak: { mode: ["avoid-all", "css", "legacy"] }, // Ensure page breaks work correctly
//     };

//     html2pdf().set(opt).from(element).save();
//   };

//   const SkillLevelSlider = ({ level, onChange }) => {
//     const levels = ["beginner", "intermediate", "proficient"];

//     return (
//       <div className="flex items-center">
//         <input
//           type="range"
//           min="0"
//           max="2"
//           value={levels.indexOf(level)}
//           onChange={(e) => onChange(levels[e.target.value])}
//           className="w-32" // Adjust width as needed
//         />
//         <span className="ml-2 text-sm">{level}</span>
//       </div>
//     );
//   };

//   return (
//     <animated.div
//       style={fadeIn}
//       className="min-h-screen bg-gray-50 pt-20 pb-12 px-4"
//       onMouseEnter={() => setShowSaveButton(true)}
//       onMouseLeave={() => setShowSaveButton(false)}
//     >
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Form Section */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={resumeData.contact_info.name}
//                 onChange={(e) =>
//                   handleContactInfoChange("name", e.target.value)
//                 }
//                 className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={resumeData.contact_info.email}
//                 onChange={(e) =>
//                   handleContactInfoChange("email", e.target.value)
//                 }
//                 className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="tel"
//                 placeholder="Phone"
//                 value={resumeData.contact_info.phone}
//                 onChange={(e) =>
//                   handleContactInfoChange("phone", e.target.value)
//                 }
//                 className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Location"
//                 value={resumeData.contact_info.location}
//                 onChange={(e) =>
//                   handleContactInfoChange("location", e.target.value)
//                 }
//                 className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="url"
//                 placeholder="LinkedIn Profile"
//                 value={resumeData.contact_info.linkedin}
//                 onChange={(e) =>
//                   handleContactInfoChange("linkedin", e.target.value)
//                 }
//                 className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="url"
//                 placeholder="Portfolio URL"
//                 value={resumeData.contact_info.portfolio}
//                 onChange={(e) =>
//                   handleContactInfoChange("portfolio", e.target.value)
//                 }
//                 className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold ">Summary</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showSummary}
//                   onChange={() => setShowSummary(!showSummary)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             <textarea
//               placeholder="Professional Summary"
//               value={resumeData.summary}
//               onChange={(e) => handleInputChange("summary", e.target.value)}
//               className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-32"
//             />
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold">Skills</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showSkills}
//                   onChange={() => setShowSkills(!showSkills)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             {resumeData.skills.map((skillItem, index) => (
//               <div key={index} className="flex items-center space-x-4 mb-4">
//                 <input
//                   type="text"
//                   placeholder="Skill"
//                   value={skillItem.skill || ""}
//                   onChange={(e) =>
//                     handleSkillsChange(index, "skill", e.target.value)
//                   }
//                   className="w-1/3 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <SkillLevelSlider
//                   level={skillItem.level || "intermediate"}
//                   onChange={(level) => handleSkillsChange(index, "level", level)}
//                 />

//                 <button
//                   onClick={() => removeSkill(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   🗑️
//                 </button>
//               </div>
//             ))}
//             <button
//               onClick={addSkill}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               + Add Skill
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold">Languages</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showLanguages}
//                   onChange={() => setShowLanguages(!showLanguages)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             {resumeData.languages.map((languageItem, index) => (
//               <div key={index} className="space-y-2 mb-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     placeholder="Language"
//                     value={languageItem.language || ""}
//                     onChange={(e) =>
//                       handleLanguagesChange(index, "language", e.target.value)
//                     }
//                     className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Level"
//                     value={languageItem.level || ""}
//                     onChange={(e) =>
//                       handleLanguagesChange(index, "level", e.target.value)
//                     }
//                     className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <button
//                   onClick={() => removeLanguage(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button
//               onClick={addLanguage}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               + Add Language
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold">Employment History</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showEmploymentHistory}
//                   onChange={() => setShowEmploymentHistory(!showEmploymentHistory)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             {resumeData.employmentHistory.map((job, index) => (
//               <div key={index} className="space-y-4 mb-6 relative">
//                 <button
//                   onClick={() => removeEmploymentHistory(index)}
//                   className="text-red-500 hover:text-red-700 absolute top-0 right-0"
//                 >
//                   Remove
//                 </button>
//                 <input
//                   type="text"
//                   placeholder="Job Title"
//                   value={job.jobTitle || ""}
//                   onChange={(e) =>
//                     handleEmploymentHistoryChange(index, "jobTitle", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Company"
//                   value={job.company || ""}
//                   onChange={(e) =>
//                     handleEmploymentHistoryChange(index, "company", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={job.city || ""}
//                   onChange={(e) =>
//                     handleEmploymentHistoryChange(index, "city", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     placeholder="Start Date"
//                     value={job.startDate || ""}
//                     onChange={(e) =>
//                       handleEmploymentHistoryChange(
//                         index,
//                         "startDate",
//                         e.target.value
//                       )
//                     }
//                     className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="End Date"
//                     value={job.endDate || ""}
//                     onChange={(e) =>
//                       handleEmploymentHistoryChange(index, "endDate", e.target.value)
//                     }
//                     className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <textarea
//                   placeholder="Description"
//                   value={job.description || ""}
//                   onChange={(e) =>
//                     handleEmploymentHistoryChange(
//                       index,
//                       "description",
//                       e.target.value
//                     )
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-24"
//                 />
//                 <label className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                     checked={job.presentWorking || false}
//                     onChange={(e) =>
//                       handleEmploymentHistoryChange(
//                         index,
//                         "presentWorking",
//                         e.target.checked
//                       )
//                     }
//                   />
//                   <span className="ml-2 text-gray-700">Currently Working</span>
//                 </label>
//               </div>
//             ))}
//             <button
//               onClick={addEmploymentHistory}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               + Add Employment
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold">Internships</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showInternships}
//                   onChange={() => setShowInternships(!showInternships)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             {resumeData.internships.map((internship, index) => (
//               <div key={index} className="space-y-4 mb-6 relative">
//                 <button
//                   onClick={() => removeInternship(index)}
//                   className="text-red-500 hover:text-red-700 absolute top-0 right-0"
//                 >
//                   Remove
//                 </button>
//                 <input
//                   type="text"
//                   placeholder="Job Title"
//                   value={internship.jobTitle || ""}
//                   onChange={(e) =>
//                     handleInternshipsChange(index, "jobTitle", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Employer"
//                   value={internship.employer || ""}
//                   onChange={(e) =>
//                     handleInternshipsChange(index, "employer", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={internship.city || ""}
//                   onChange={(e) =>
//                     handleInternshipsChange(index, "city", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     placeholder="Start Date"
//                     value={internship.startDate || ""}
//                     onChange={(e) =>
//                       handleInternshipsChange(index, "startDate", e.target.value)
//                     }
//                     className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="End Date"
//                     value={internship.endDate || ""}
//                     onChange={(e) =>
//                       handleInternshipsChange(index, "endDate", e.target.value)
//                     }
//                     className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <textarea
//                   placeholder="Description"
//                   value={internship.description || ""}
//                   onChange={(e) =>
//                     handleInternshipsChange(index, "description", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-24"
//                 />
//               </div>
//             ))}
//             <button
//               onClick={addInternship}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               + Add Internship
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold">Projects</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showProjects}
//                   onChange={() => setShowProjects(!showProjects)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             {resumeData.projects.map((project, index) => (
//               <div key={index} className="space-y-4 mb-6 relative">
//                 <button
//                   onClick={() => removeProject(index)}
//                   className="text-red-500 hover:text-red-700 absolute top-0 right-0"
//                 >
//                   Remove
//                 </button>
//                 <input
//                   type="text"
//                   placeholder="Title"
//                   value={project.title || ""}
//                   onChange={(e) =>
//                     handleProjectsChange(index, "title", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Tech Stack Used (comma-separated)"
//                   value={project.techStackUsed ? project.techStackUsed.join(", ") : ""}
//                   onChange={(e) => handleTechStackChange(index, e.target.value)}
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Role"
//                   value={project.role || ""}
//                   onChange={(e) =>
//                     handleProjectsChange(index, "role", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <textarea
//                   placeholder="Description"
//                   value={project.description || ""}
//                   onChange={(e) =>
//                     handleProjectsChange(index, "description", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-24"
//                 />
//               </div>
//             ))}
//             <button
//               onClick={addProject}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               + Add Project
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold">Education</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showEducation}
//                   onChange={() => setShowEducation(!showEducation)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             {resumeData.education.map((edu, index) => (
//               <div key={index} className="space-y-4 mb-6 relative">
//                 <button
//                   onClick={() => removeEducation(index)}
//                   className="text-red-500 hover:text-red-700 absolute top-0 right-0"
//                 >
//                   Remove
//                 </button>
//                 <input
//                   type="text"
//                   placeholder="Degree"
//                   value={edu.degree || ""}
//                   onChange={(e) =>
//                     handleEducationChange(index, "degree", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Institution"
//                   value={edu.institution || ""}
//                   onChange={(e) =>
//                     handleEducationChange(index, "institution", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Year"
//                   value={edu.year || ""}
//                   onChange={(e) =>
//                     handleEducationChange(index, "year", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             ))}
//             <button
//               onClick={addEducation}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               + Add Education
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold">Courses</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showCourses}
//                   onChange={() => setShowCourses(!showCourses)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             {resumeData.courses.map((course, index) => (
//               <div key={index} className="space-y-4 mb-6 relative">
//                 <button
//                   onClick={() => removeCourse(index)}
//                   className="text-red-500 hover:text-red-700 absolute top-0 right-0"
//                 >
//                   Remove                </button>
//                 <input
//                   type="text"
//                   placeholder="Course Name"
//                   value={course.course || ""}
//                   onChange={(e) =>
//                     handleCoursesChange(index, "course", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Institution"
//                   value={course.institution || ""}
//                   onChange={(e) =>
//                     handleCoursesChange(index, "institution", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     placeholder="Start Date"
//                     value={course.startDate || ""}
//                     onChange={(e) =>
//                       handleCoursesChange(index, "startDate", e.target.value)
//                     }
//                     className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="End Date"
//                     value={course.endDate || ""}
//                     onChange={(e) =>
//                       handleCoursesChange(index, "endDate", e.target.value)
//                     }
//                     className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             ))}
//             <button
//               onClick={addCourse}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               + Add Course
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold">Achievements</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showAchievements}
//                   onChange={() => setShowAchievements(!showAchievements)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             {resumeData.achievements.map((achievement, index) => (
//               <div key={index} className="space-y-4 mb-6 relative">
//                 <button
//                   onClick={() => removeAchievement(index)}
//                   className="text-red-500 hover:text-red-700 absolute top-0 right-0"
//                 >
//                   Remove
//                 </button>
//                 <input
//                   type="text"
//                   placeholder="Title"
//                   value={achievement.title || ""}
//                   onChange={(e) =>
//                     handleAchievementsChange(index, "title", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Issuer"
//                   value={achievement.issuer || ""}
//                   onChange={(e) =>
//                     handleAchievementsChange(index, "issuer", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Date"
//                   value={achievement.date || ""}
//                   onChange={(e) =>
//                     handleAchievementsChange(index, "date", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <textarea
//                   placeholder="Description"
//                   value={achievement.description || ""}
//                   onChange={(e) =>
//                     handleAchievementsChange(index, "description", e.target.value)
//                   }
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-24"
//                 />
//               </div>
//             ))}
//             <button
//               onClick={addAchievement}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               + Add Achievement
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-2xl font-semibold">Hobbies</h2>
//               <label className="inline-flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-gray-600 rounded"
//                   checked={showHobbies}
//                   onChange={() => setShowHobbies(!showHobbies)}
//                 />
//                 <span className="ml-2 text-gray-700">Show</span>
//               </label>
//             </div>
//             {resumeData.hobbies.map((hobby, index) => (
//               <div key={index} className="space-y-2 mb-4">
//                 <input
//                   type="text"
//                   placeholder="Hobby"
//                   value={hobby || ""}
//                   onChange={(e) => {
//                     const newHobbies = [...resumeData.hobbies];
//                     newHobbies[index] = e.target.value;
//                     setResumeData((prev) => ({
//                       ...prev,
//                       hobbies: newHobbies,
//                     }));
//                   }}
//                   className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={() => removeHobby(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button
//               onClick={addHobby}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               + Add Hobby
//             </button>
//           </div>
//         </div>

//         {/* Preview Section */}
//         <div className="relative">
//           {showSaveButton && (
//             <button
//               onClick={downloadPDF}
//               className="absolute -top-4 right-4 px-4 py-2 bg-blue-600 text-white
//                          rounded-lg hover:bg-blue-700 transition-colors z-10"
//             >
//               Save as PDF
//             </button>
//           )}
//           <div
//             ref={resumeRef}
//             className="bg-white rounded-xl shadow-sm p-8 sticky top-24"
//           >
//             {/* Page 1 */}
//             <div className="page-break-inside-avoid">
//               <div className="prose max-w-none">
//                 <div className="flex items-start space-x-6 mb-8 border-b pb-6">
//                   <div className="flex-1">
//                     <h1 className="text-3xl font-bold mb-2 text-gray-900">
//                       {resumeData.contact_info.name}
//                     </h1>
//                     <div className="text-xl text-gray-600 mb-4">
//                       {resumeData.contact_info.location && (
//                         <div>{resumeData.contact_info.location}</div>
//                       )}
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
//                       {resumeData.contact_info.email && (
//                         <div className="flex items-center space-x-2">
//                           <span>📧</span>
//                           <span>{resumeData.contact_info.email}</span>
//                         </div>
//                       )}
//                       {resumeData.contact_info.phone && (
//                         <div className="flex items-center space-x-2">
//                           <span>📱</span>
//                           <span>{resumeData.contact_info.phone}</span>
//                         </div>
//                       )}
//                       {resumeData.contact_info.linkedin && (
//                         <div className="flex items-center space-x-2">
//                           <span>💼</span>
//                           <a
//                             href={resumeData.contact_info.linkedin}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:underline"
//                           >
//                             LinkedIn
//                           </a>
//                         </div>
//                       )}
//                       {resumeData.contact_info.portfolio && (
//                         <div className="flex items-center space-x-2">
//                           <span>🌐</span>
//                           <a
//                             href={resumeData.contact_info.portfolio}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:underline"
//                           >
//                             Portfolio
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {showSummary && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-2 uppercase">
//                       Professional Summary
//                     </h2>
//                     {resumeData.summary && (
//                       <div className="mb-6">
//                         <p className="text-gray-700 text-justify">
//                           {resumeData.summary}
//                         </p>
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {showSkills && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
//                       Skills
//                     </h2>
//                     {resumeData.skills.length > 0 && (
//                       <div className="mb-6">
//                         {resumeData.skills.map((skillItem, index) => (
//                           <div key={index}>
//                             {skillItem.skill && (
//                               <div>
//                                 {skillItem.skill}
//                                 {skillItem.level && <span> ({skillItem.level})</span>}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {showLanguages && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
//                       Languages
//                     </h2>
//                     {resumeData.languages.length > 0 && (
//                       <div className="mb-6">
//                         {resumeData.languages.map((languageItem, index) => (
//                           <div key={index}>
//                             {languageItem.language && (
//                               <div>
//                                 {languageItem.language}
//                                 {languageItem.level && <span> ({languageItem.level})</span>}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {showEmploymentHistory && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
//                       Employment History
//                     </h2>
//                     {resumeData.employmentHistory.length > 0 && (
//                       <div className="mb-6">
//                         {resumeData.employmentHistory.map((job, index) => (
//                           <div key={index} className="mb-4">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <h3 className="font-medium text-gray-900">{job.jobTitle}</h3>
//                                 <p className="text-gray-600">{job.company}</p>
//                                 <p className="text-gray-600">{job.city}</p>
//                               </div>
//                               <span className="text-gray-500 text-sm">
//                                 {job.startDate} - {job.presentWorking ? "Present" : job.endDate}
//                               </span>
//                             </div>
//                             <p className="text-gray-700 mt-2 text-justify">{job.description}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {showInternships && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
//                       Internships
//                     </h2>
//                     {resumeData.internships.length > 0 && (
//                       <div className="mb-6">
//                         {resumeData.internships.map((internship, index) => (
//                           <div key={index} className="mb-4">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <h3 className="font-medium text-gray-900">{internship.jobTitle}</h3>
//                                 <p className="text-gray-600">{internship.employer}</p>
//                                 <p className="text-gray-600">{internship.city}</p>
//                               </div>
//                               <span className="text-gray-500 text-sm">
//                                 {internship.startDate} - {internship.endDate}
//                               </span>
//                             </div>
//                             <p className="text-gray-700 mt-2 text-justify">{internship.description}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Page 2 */}
//             <div className="page-break-before page-break-inside-avoid">
//               <div className="prose max-w-none">
//                 {showProjects && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
//                       Projects
//                     </h2>
//                     {resumeData.projects.length > 0 && (
//                       <div className="mb-6">
//                         {resumeData.projects.map((project, index) => (
//                           <div key={index} className="mb-4">
//                             <h3 className="font-medium text-gray-900">{project.title}</h3>
//                             <p className="text-gray-600">Role: {project.role}</p>
//                             {project.techStackUsed && project.techStackUsed.length > 0 && (
//                               <p className="text-gray-600">
//                                 Tech Stack: {project.techStackUsed.join(", ")}
//                               </p>
//                             )}
//                             <p className="text-gray-700 mt-2 text-justify">{project.description}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {showEducation && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
//                       Education
//                     </h2>
//                     {resumeData.education.length > 0 && (
//                       <div className="mb-6">
//                         {resumeData.education.map((edu, index) => (
//                           <div key={index} className="mb-4">
//                             <h3 className="font-medium text-gray-900">{edu.degree}</h3>
//                             <p className="text-gray-600">{edu.institution}</p>
//                             <p className="text-gray-600">Year: {edu.year}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {showCourses && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
//                       Courses
//                     </h2>
//                     {resumeData.courses.length > 0 && (
//                       <div className="mb-6">
//                         {resumeData.courses.map((course, index) => (
//                           <div key={index} className="mb-4">
//                             <h3 className="font-medium text-gray-900">{course.course}</h3>
//                             <p className="text-gray-600">{course.institution}</p>
//                             <p className="text-gray-600">
//                               {course.startDate} - {course.endDate}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {showAchievements && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
//                       Achievements
//                     </h2>
//                     {resumeData.achievements.length > 0 && (
//                       <div className="mb-6">
//                         {resumeData.achievements.map((achievement, index) => (
//                           <div key={index} className="mb-4">
//                             <h3 className="font-medium text-gray-900">{achievement.title}</h3>
//                             <p className="text-gray-600">Issuer: {achievement.issuer}</p>
//                             <p className="text-gray-600">Date: {achievement.date}</p>
//                             <p className="text-gray-700 mt-2 text-justify">{achievement.description}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {showHobbies && (
//                   <>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
//                       Hobbies
//                     </h2>
//                     {resumeData.hobbies.length > 0 && (
//                       <div>
//                         <ul className="list-disc pl-5 text-gray-700">
//                           {resumeData.hobbies.map((hobby, index) => (
//                             <li key={index}>{hobby}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </animated.div>
//   );
// };

// export default ResumeBuilder;