import React, { useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import html2pdf from "html2pdf.js";

const ResumeBuilder = () => {
  const resumeRef = useRef(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [resumeData, setResumeData] = useState({
    profilePic: null,
    name: "",
    professionalTitle: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    description: "",
    skills: [],
    experience: [],
    education: [],
    achievements: [],
    certifications: [],
    languages: [],
  });

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

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

  const handleExperienceChange = (index, field, value) => {
    setResumeData((prev) => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return { ...prev, experience: newExperience };
    });
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          logo: null,
          role: "",
          duration: "",
          description: ""
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
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
      education: [
        ...prev.education,
        { institution: "", degree: "", year: "", grade: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleCompanyLogo = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleExperienceChange(index, "logo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: [10, 10],
      filename: `${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
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
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleInputChange("profilePic", e.target.files[0])
                  }
                  className="w-full"
                />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={resumeData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={resumeData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={resumeData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="url"
                  placeholder="GitHub Profile"
                  value={resumeData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="LinkedIn Profile"
                  value={resumeData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                placeholder="Professional Summary"
                value={resumeData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-32"
              />
              <input
                type="text"
                placeholder="Professional Title"
                value={resumeData.professionalTitle}
                onChange={(e) => handleInputChange("professionalTitle", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="space-y-4 mb-6 relative">
                <div className="flex justify-between items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCompanyLogo(index, e.target.files[0])}
                    className="w-1/3"
                  />
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    handleExperienceChange(index, "company", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) =>
                    handleExperienceChange(index, "role", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) =>
                    handleExperienceChange(index, "duration", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) =>
                    handleExperienceChange(index, "description", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 h-32"
                />
              </div>
            ))}
            <button
              onClick={addExperience}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Experience
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Skills & Languages</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={resumeData.skills.join(", ")}
                  onChange={(e) => handleArrayInput("skills", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={resumeData.languages.join(", ")}
                  onChange={(e) => handleArrayInput("languages", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="space-y-4 mb-6 relative">
                <div className="flex justify-end">
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Institution Name"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Grade/Score"
                    value={edu.grade}
                    onChange={(e) => handleEducationChange(index, "grade", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
            <h2 className="text-2xl font-semibold mb-4">Certifications</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Certifications (comma-separated)"
                value={resumeData.certifications.join(", ")}
                onChange={(e) => handleArrayInput("certifications", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Achievements (comma-separated)"
                value={resumeData.achievements.join(", ")}
                onChange={(e) => handleArrayInput("achievements", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
            className="bg-white rounded-xl shadow-sm p-8 sticky top-24"
          >
            <div className="prose max-w-none">
              <div className="flex items-start space-x-6 mb-8 border-b pb-6">
                {resumeData.profilePic && (
                  <img
                    src={URL.createObjectURL(resumeData.profilePic)}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2 text-gray-900">
                    {resumeData.name}
                  </h1>
                  {resumeData.professionalTitle && (
                    <h2 className="text-xl text-gray-600 mb-4">
                      {resumeData.professionalTitle}
                    </h2>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    {resumeData.email && (
                      <div className="flex items-center space-x-2">
                        <span>📧</span>
                        <span>{resumeData.email}</span>
                      </div>
                    )}
                    {resumeData.phone && (
                      <div className="flex items-center space-x-2">
                        <span>📱</span>
                        <span>{resumeData.phone}</span>
                      </div>
                    )}
                    {resumeData.github && (
                      <div className="flex items-center space-x-2">
                        <span>💻</span>
                        <a
                          href={resumeData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          GitHub
                        </a>
                      </div>
                    )}
                    {resumeData.linkedin && (
                      <div className="flex items-center space-x-2">
                        <span>💼</span>
                        <a
                          href={resumeData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {resumeData.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 uppercase">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 text-justify">{resumeData.description}</p>
                </div>
              )}

              {resumeData.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
                    Work Experience
                  </h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{exp.role}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-gray-500 text-sm">{exp.duration}</span>
                      </div>
                      <p className="text-gray-700 mt-2 text-justify">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {resumeData.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
                    Education
                  </h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500 text-sm">{edu.year}</span>
                          {edu.grade && (
                            <p className="text-gray-600 text-sm">Grade: {edu.grade}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {resumeData.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
                    Certifications
                  </h2>
                  <ul className="list-disc pl-5 text-gray-700">
                    {resumeData.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {resumeData.achievements.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
                    Achievements
                  </h2>
                  <ul className="list-disc pl-5 text-gray-700">
                    {resumeData.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {resumeData.languages.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">
                    Languages
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.languages.map((language, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default ResumeBuilder;