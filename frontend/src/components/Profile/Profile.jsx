import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import boyProfilePic from "../../assets/boyProfilePic.png";
import girlProfilePic from "../../assets/girlProfilePic.png";
import { getCurrentHost } from "../../constants/config";
import { uploadFileToAzure } from "../../services/azure";
import UpdatePassword from "./UpdatePassword";

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
    githubProfileUrl: userData.githubProfileUrl || "",
    linkedinProfileUrl: userData.linkedinProfileUrl || "",
    gender: userData.gender || "male",
    profilePic: userData.profilePic || null,
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Update formData when userData changes
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.mobile || "",
      githubProfileUrl: userData.githubProfileUrl || "",
      linkedinProfileUrl: userData.linkedinProfileUrl || "",
      gender: userData.gender || "male",
      profilePic: userData.profilePic || null,
    });
  }, [userData]);

  const handleCancel = () => {
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.mobile || "",
      githubProfileUrl: userData.githubProfileUrl || "",
      linkedinProfileUrl: userData.linkedinProfileUrl || "",
      gender: userData.gender || "male",
      profilePic: userData.profilePic || null,
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let updatedFields = {};

      // Add all changed fields to the update object
      Object.keys(formData).forEach((key) => {
        if (key === "profilePic") {
          if (formData.profilePic && formData.profilePic instanceof File) {
            updatedFields.profilePic = formData.profilePic;
          }
        } else if (key === "phone") {
          if (formData[key] !== userData.mobile) {
            updatedFields.mobile = formData[key];
          }
        } else if (formData[key] !== userData[key]) {
          updatedFields[key] = formData[key];
        }
      });

      // Only proceed if there are changes
      if (Object.keys(updatedFields).length === 0) {
        setIsEditing(false);
        showToast("No changes to update", "info");
        return;
      }

      // If there's a new profile picture, upload it first
      if (updatedFields.profilePic instanceof File) {
        const randomNumber =
          Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        const timestamp = Date.now().toString();
        const filename = `${randomNumber}_${timestamp}_${updatedFields.profilePic.name}`;
        const fileUploaded = await uploadFileToAzure(
          filename,
          updatedFields.profilePic
        );
        updatedFields.profilePic = fileUploaded.url;
      }

      const response = await fetch(
        `${getCurrentHost()}/api/users/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newUserData = {
          ...userData,
          ...data.user,
          token: userData.token,
        };

        localStorage.setItem("userData", JSON.stringify(newUserData));
        setUserData(newUserData);
        setIsEditing(false);
        showToast("Profile updated successfully", "success");
      } else {
        showToast(data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setFormData((prev) => ({
        ...prev,
        profilePic: file,
      }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (isEditing) {
        // If not in edit mode, remove from server
        const userData = JSON.parse(localStorage.getItem("userData"));
        const response = await fetch(
          `${getCurrentHost()}/api/users/remove-profile-pic`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        if (response.ok) {
          setSelectedImage(null);
          setImagePreview(null);
          setUserData((prev) => ({
            ...prev,
            profilePic: null,
          }));
          localStorage.setItem(
            "userData",
            JSON.stringify({
              ...userData,
              profilePic: null,
            })
          );
          showToast("Profile picture removed successfully", "success");
        }
      } else {
        // If in edit mode, just remove locally
        setSelectedImage(null);
        setImagePreview(null);
        setFormData((prev) => ({
          ...prev,
          profilePic: null,
        }));
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      showToast("Failed to remove profile picture", "error");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <animated.div style={fadeIn}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Your Profile</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg
                         hover:bg-blue-50 transition-colors"
              >
                Change Password
              </button>
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
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      isEditing
                        ? imagePreview ||
                          userData?.profilePic ||
                          (formData.gender === "female"
                            ? girlProfilePic
                            : boyProfilePic)
                        : userData?.profilePic ||
                          (formData.gender === "female"
                            ? girlProfilePic
                            : boyProfilePic)
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  {isEditing && (userData?.profilePic || imagePreview) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove profile picture"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {/* {isEditing && (
                  <div>
                    <label
                      htmlFor="profile-upload"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                                transition-colors cursor-pointer inline-block"
                    >
                      Choose Photo
                    </label>
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )} */}
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
                    name="githubProfileUrl"
                    value={formData.githubProfileUrl}
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
                    name="linkedinProfileUrl"
                    value={formData.linkedinProfileUrl}
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
        </animated.div>

        <UpdatePassword
          showToast={showToast}
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Profile;
