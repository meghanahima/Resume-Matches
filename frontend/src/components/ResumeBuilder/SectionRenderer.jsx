import React from "react";
import ResumeInput from "./resumeInput";
import { FaPlus, FaTimes } from "react-icons/fa";

const SectionRenderer = ({ section, data = [], onChange, onRemove }) => {
  const handleFieldChange = (index, field, value) => {
    const newData = [...(Array.isArray(data) ? data : [])];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const addItem = () => {
    const emptyItems = {
      experience: {
        jobTitle: "",
        company: "",
        city: "",
        startDate: "",
        endDate: "",
        description: "",
        presentWorking: false,
      },
      skills: {
        skill: "",
        level: "intermediate",
      },
      education: {
        degree: "",
        institution: "",
        year: "",
      },
      languages: {
        language: "",
        proficiency: "intermediate",
      },
      projects: {
        title: "",
        description: "",
        technologies: "",
        link: "",
        duration: "",
      },
      achievements: {
        title: "",
        date: "",
        description: "",
      },
      strengths: {
        category: "",
        description: "",
      },
      volunteering: {
        organization: "",
        role: "",
        duration: "",
        description: "",
      },
      certifications: {
        name: "",
        issuer: "",
        date: "",
        expiryDate: "",
        credentialId: "",
      },
      awards: {
        title: "",
        issuer: "",
        date: "",
        description: "",
      },
      publications: {
        title: "",
        publisher: "",
        date: "",
        link: "",
        description: "",
      },
      interests: {
        category: "",
        items: [],
      },
    };

    onChange([...(Array.isArray(data) ? data : []), emptyItems[section]]);
  };

  const removeItem = (index) => {
    if (!Array.isArray(data)) return;
    onChange(data.filter((_, i) => i !== index));
  };

  switch (section) {
    case "experience":
      return (
        <div className="mb-8 relative group">
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
            Work Experience
          </h2>
          {Array.isArray(data) &&
            data.map((exp, index) => (
              <div key={index} className="mb-6">
                <ResumeInput
                  value={exp.jobTitle}
                  onChange={(value) =>
                    handleFieldChange(index, "jobTitle", value)
                  }
                  placeholder="Job Title"
                  className="font-semibold"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <ResumeInput
                    value={exp.company}
                    onChange={(value) =>
                      handleFieldChange(index, "company", value)
                    }
                    placeholder="Company"
                  />
                  <ResumeInput
                    value={exp.city}
                    onChange={(value) =>
                      handleFieldChange(index, "city", value)
                    }
                    placeholder="Location"
                  />
                  <ResumeInput
                    value={exp.startDate}
                    onChange={(value) =>
                      handleFieldChange(index, "startDate", value)
                    }
                    placeholder="Start Date"
                    type="date"
                  />
                  <ResumeInput
                    value={exp.endDate}
                    onChange={(value) =>
                      handleFieldChange(index, "endDate", value)
                    }
                    placeholder="End Date"
                    type="date"
                    disabled={exp.presentWorking}
                  />
                </div>
                <ResumeInput
                  value={exp.description}
                  onChange={(value) =>
                    handleFieldChange(index, "description", value)
                  }
                  placeholder="Description"
                  multiline
                  className="mt-2"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 mt-2 text-sm"
                >
                  <FaTimes className="inline mr-1" /> Remove Experience
                </button>
              </div>
            ))}
          <button
            onClick={addItem}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2"
          >
            <FaPlus /> Add Experience
          </button>
        </div>
      );

    case "skills":
      return (
        <div className="mb-8 relative group">
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
            Skills
          </h2>
          {Array.isArray(data) &&
            data.map((skill, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                <ResumeInput
                  value={skill.skill}
                  onChange={(value) => handleFieldChange(index, "skill", value)}
                  placeholder="Skill"
                  className="flex-1"
                />
                <select
                  value={skill.level}
                  onChange={(e) =>
                    handleFieldChange(index, "level", e.target.value)
                  }
                  className="px-3 py-1 border rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          <button
            onClick={addItem}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2"
          >
            <FaPlus /> Add Skill
          </button>
        </div>
      );

    case "education":
      return (
        <div className="mb-8 relative group">
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
            Education
          </h2>
          {Array.isArray(data) &&
            data.map((edu, index) => (
              <div key={index} className="mb-6">
                <ResumeInput
                  value={edu.degree}
                  onChange={(value) =>
                    handleFieldChange(index, "degree", value)
                  }
                  placeholder="Degree"
                  className="font-semibold"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <ResumeInput
                    value={edu.institution}
                    onChange={(value) =>
                      handleFieldChange(index, "institution", value)
                    }
                    placeholder="Institution"
                  />
                  <ResumeInput
                    value={edu.year}
                    onChange={(value) =>
                      handleFieldChange(index, "year", value)
                    }
                    placeholder="Year"
                  />
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 mt-2 text-sm"
                >
                  <FaTimes className="inline mr-1" /> Remove Education
                </button>
              </div>
            ))}
          <button
            onClick={addItem}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2"
          >
            <FaPlus /> Add Education
          </button>
        </div>
      );

    case "languages":
      return (
        <div className="mb-8 relative group">
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
            Languages
          </h2>
          {Array.isArray(data) &&
            data.map((lang, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                <ResumeInput
                  value={lang.language}
                  onChange={(value) =>
                    handleFieldChange(index, "language", value)
                  }
                  placeholder="Language"
                  className="flex-1"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) =>
                    handleFieldChange(index, "proficiency", e.target.value)
                  }
                  className="px-3 py-1 border rounded-md"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="fluent">Fluent</option>
                  <option value="native">Native</option>
                </select>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          <button
            onClick={addItem}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2"
          >
            <FaPlus /> Add Language
          </button>
        </div>
      );

    case "projects":
      return (
        <div className="mb-8 relative group">
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
            Projects
          </h2>
          {Array.isArray(data) &&
            data.map((project, index) => (
              <div key={index} className="mb-6">
                <ResumeInput
                  value={project.title}
                  onChange={(value) => handleFieldChange(index, "title", value)}
                  placeholder="Project Title"
                  className="font-semibold"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <ResumeInput
                    value={project.technologies}
                    onChange={(value) =>
                      handleFieldChange(index, "technologies", value)
                    }
                    placeholder="Technologies Used"
                  />
                  <ResumeInput
                    value={project.duration}
                    onChange={(value) =>
                      handleFieldChange(index, "duration", value)
                    }
                    placeholder="Duration"
                  />
                </div>
                <ResumeInput
                  value={project.description}
                  onChange={(value) =>
                    handleFieldChange(index, "description", value)
                  }
                  placeholder="Project Description"
                  multiline
                  className="mt-2"
                />
                <ResumeInput
                  value={project.link}
                  onChange={(value) => handleFieldChange(index, "link", value)}
                  placeholder="Project Link"
                  className="mt-2"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 mt-2 text-sm"
                >
                  <FaTimes className="inline mr-1" /> Remove Project
                </button>
              </div>
            ))}
          <button
            onClick={addItem}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2"
          >
            <FaPlus /> Add Project
          </button>
        </div>
      );

    case "achievements":
      return (
        <div className="mb-8 relative group">
          {/* Similar structure for achievements */}
        </div>
      );

    case "strengths":
      return (
        <div className="mb-8 relative group">
          {/* Similar structure for strengths */}
        </div>
      );

    default:
      return null;
  }
};

export default SectionRenderer;
