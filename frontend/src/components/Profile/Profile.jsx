import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import boyProfilePic from "../../assets/boyProfilePic.png";
import girlProfilePic from "../../assets/girlProfilePic.png";
import { getCurrentHost } from "../../constants/config";
import { uploadFileToAzure } from "../../services/azure";

const Profile = ({ showToast }) => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData") || "{}")
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.mobile || "",
    github: userData.githubProfileUrl || "",
    linkedin: userData.linkedinProfileUrl || "",
    gender: userData.gender || "male",
    profilePic: userData.profilePic || null,
  });

  useEffect(() => {
    // Update formData when userData changes
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.mobile || "",
      github: userData.githubProfileUrl || "",
      linkedin: userData.linkedinProfileUrl || "",
      gender: userData.gender || "male",
      profilePic: userData.profilePic || null,
    });
  }, [userData]);

  const handleCancel = () => {
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.mobile || "",
      github: userData.githubProfileUrl || "",
      linkedin: userData.linkedinProfileUrl || "",
      gender: userData.gender || "male",
      profilePic: userData.profilePic || null,
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    console.log("formData", formData);
    e.preventDefault();
    setIsSaving(true);
    try {
      console.log("token", JSON.parse(localStorage.getItem("userData")));
      if (formData.profilePic) {
        const randomNumber =
          Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        const timestamp = Date.now().toString();
        const filename = `${randomNumber}_${timestamp}_${formData.profilePic.name}`;
        const fileUploaded = await uploadFileToAzure(
          filename,
          formData.profilePic
        );
        formData.profilePic = fileUploaded.url;
      }
      const response = await fetch(
        `${getCurrentHost()}/api/users/update-profile`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("userData")).token
            }`,
          },
        }
      );

      if (response.status === 200) {
        const updatedData = await response.json();
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...updatedData.user,
            token: JSON.parse(localStorage.getItem("userData")).token,
          })
        );
        setUserData({
          ...updatedData.user,
          token: JSON.parse(localStorage.getItem("userData")).token,
        });
        setIsEditing(false);
        showToast("Profile updated successfully", "success");
      } else {
        showToast("Failed to update profile", "error");
      }
    } catch (error) {
      console.log("Failed to update profile:", error);
      showToast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePic: file,
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <animated.div
      style={fadeIn}
      className="min-h-screen bg-gray-50 pt-20 pb-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Your Profile</h1>
            <button
              onClick={isEditing ? handleCancel : handleEdit}
              disabled={isSaving}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg
                       hover:bg-blue-50 transition-colors disabled:opacity-50
                       disabled:cursor-not-allowed"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={
                    formData.profilePic
                      ? formData.profilePic
                      : formData.gender === "female"
                      ? girlProfilePic
                      : boyProfilePic
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                )}
              </div>
              {isEditing && (
                <p className="text-sm text-gray-500">
                  Click on the image to upload a new profile picture
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 transition-all transform hover:scale-105
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:cursor-pointer flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>✨ Make it Shine!</span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </animated.div>
  );
};

export default Profile;
