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