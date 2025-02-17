import React from "react";
import {
  FaTimes,
  FaGraduationCap,
  FaBriefcase,
  FaFileAlt,
  FaTools,
  FaGlobe,
  FaProjectDiagram,
  FaTrophy,
  FaLightbulb,
  FaHandsHelping,
  FaHeart,
  FaMedal,
  FaCertificate,
  FaBook,
  FaUserTie,
} from "react-icons/fa";
import PropTypes from "prop-types";

export const AddSectionModal = ({
  isOpen,
  onClose,
  onAddSection,
  activeSections = [],
  onRemoveSection,
}) => {
  const sections = [
    {
      id: "summary",
      title: "Professional Summary",
      icon: <FaUserTie className="w-6 h-6" />,
      sample: {
        overview:
          "Experienced software engineer with expertise in web development",
        years: "5+ years of experience",
        focus: "Specializing in frontend development",
      },
    },
    {
      id: "education",
      title: "Education",
      icon: <FaGraduationCap className="w-6 h-6" />,
      sample: {
        degree: "B.Tech in Computer Science",
        institution: "Example University",
        year: "2019-2023",
        gpa: "3.8/4.0",
      },
    },
    {
      id: "experience",
      title: "Experience",
      icon: <FaBriefcase className="w-6 h-6" />,
      sample: {
        position: "Software Engineer",
        company: "Tech Corp",
        duration: "Jan 2022 - Present",
        description: "Leading frontend development team",
      },
    },
    {
      id: "skills",
      title: "Skills",
      icon: <FaTools className="w-6 h-6" />,
      sample: {
        technical: "React, Node.js, Python",
        soft: "Leadership, Communication",
        tools: "Git, Docker, AWS",
      },
    },
    {
      id: "languages",
      title: "Languages",
      icon: <FaGlobe className="w-6 h-6" />,
      sample: {
        primary: "English (Native)",
        secondary: "Spanish (Fluent)",
        other: "French (Basic)",
      },
    },
    {
      id: "projects",
      title: "Projects",
      icon: <FaProjectDiagram className="w-6 h-6" />,
      sample: {
        name: "E-commerce Platform",
        tech: "React, Node.js, MongoDB",
        role: "Lead Developer",
        impact: "Increased sales by 40%",
      },
    },
    {
      id: "achievements",
      title: "Key Achievements",
      icon: <FaTrophy className="w-6 h-6" />,
      sample: {
        title: "Employee of the Year",
        year: "2022",
        impact: "Led successful product launch",
      },
    },
    {
      id: "strengths",
      title: "Strengths",
      icon: <FaLightbulb className="w-6 h-6" />,
      sample: {
        leadership: "Team Leadership",
        technical: "Problem Solving",
        soft: "Communication",
      },
    },
    {
      id: "volunteering",
      title: "Volunteering",
      icon: <FaHandsHelping className="w-6 h-6" />,
      sample: {
        organization: "Code for Good",
        role: "Mentor",
        duration: "2021 - Present",
      },
    },
    {
      id: "interests",
      title: "Interests",
      icon: <FaHeart className="w-6 h-6" />,
      sample: {
        hobbies: "Photography, Hiking",
        sports: "Basketball, Tennis",
        other: "Reading",
      },
    },
    {
      id: "awards",
      title: "Awards",
      icon: <FaMedal className="w-6 h-6" />,
      sample: {
        title: "Innovation Award",
        issuer: "Tech Industry Association",
        year: "2023",
      },
    },
    {
      id: "certifications",
      title: "Certifications",
      icon: <FaCertificate className="w-6 h-6" />,
      sample: {
        name: "AWS Solutions Architect",
        issuer: "Amazon",
        year: "2023",
        validity: "Valid until 2026",
      },
    },
    {
      id: "publications",
      title: "Publications",
      icon: <FaBook className="w-6 h-6" />,
      sample: {
        title: "Modern Web Development",
        publisher: "Tech Journal",
        year: "2023",
        impact: "Cited by 100+ developers",
      },
    },
  ];

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSectionAction = (e, sectionId) => {
    e.stopPropagation();
    const isAdded = activeSections.includes(sectionId);

    if (isAdded && onRemoveSection) {
      onRemoveSection(sectionId);
    } else if (!isAdded && onAddSection) {
      onAddSection(sectionId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl w-[90%] max-w-6xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Add Section to Your Resume
          </h2>
          <p className="text-gray-600">
            Choose from our pre-built sections to enhance your resume
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const isAdded = activeSections.includes(section.id);

            return (
              <div
                key={section.id}
                className={`group relative bg-white border border-gray-200 rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md 
                  ${
                    isAdded
                      ? "border-blue-200 bg-blue-50/20"
                      : "hover:bg-blue-50/40"
                  }`}
              >
                <div className="flex items-center gap-3 mb-4 border-b pb-3">
                  <div
                    className={`text-blue-600 transition-transform duration-300 ${
                      isAdded ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {section.title}
                  </h3>
                  {isAdded && (
                    <span className="ml-auto text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      Added
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  {Object.entries(section.sample).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <span className="font-medium text-gray-700">{key}: </span>
                      {value}
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => handleSectionAction(e, section.id)}
                    className={`${
                      isAdded
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white px-6 py-2 rounded-lg transition-colors shadow-lg`}
                  >
                    {isAdded ? "Remove from Resume" : "Add to Resume"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

AddSectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddSection: PropTypes.func,
  activeSections: PropTypes.arrayOf(PropTypes.string),
  onRemoveSection: PropTypes.func,
};

AddSectionModal.defaultProps = {
  activeSections: [],
  onAddSection: () => {},
  onRemoveSection: () => {},
};
