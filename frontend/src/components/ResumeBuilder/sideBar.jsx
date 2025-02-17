import React, { useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { FaFileAlt, FaPlus, FaDownload, FaShare } from "react-icons/fa";
import { AddSectionModal } from "./AddSectionModal";

const SideBar = ({ onAddSection, onRemoveSection, activeSections }) => {
  const [activeSection, setActiveSection] = useState("Build Resume");
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  const options = [
    {
      id: "Build Resume",
      label: "Build Resume",
      icon: <FaFileAlt className="w-5 h-5" />,
      show: true,
    },
    {
      id: "Add Section",
      label: "Add Section",
      icon: <FaPlus className="w-5 h-5" />,
      show: true,
    },
    {
      id: "Download",
      label: "Download",
      icon: <FaDownload className="w-5 h-5" />,
      show: true,
    },
    {
      id: "Share",
      label: "Share",
      icon: <FaShare className="w-5 h-5" />,
      show: true,
    },
  ];

  const handleOptionSelect = (id) => {
    setActiveSection(id);
    if (id === "Add Section") {
      setShowAddSectionModal(true);
    }
  };

  return (
    <>
      <div className="w-72 bg-white/90 backdrop-blur-md border-r border-gray-200/60 h-full overflow-y-auto shadow-lg">
        <div className="p-6 w-full">
          <div className="flex flex-row w-full items-center text-xl font-semibold text-gray-800 gap-3 mb-8 px-2">
            <IoSettingsSharp className="w-7 h-7" />
            <span className="font-sf-pro">Options</span>
          </div>
          <div className="space-y-1">
            {options.map(({ id, label, icon }) => (
              <div
                key={id}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 
                                    ${
                                      activeSection === id
                                        ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 shadow-sm"
                                        : "text-gray-700 hover:bg-gray-50/80"
                                    }`}
                onClick={() => handleOptionSelect(id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`transition-transform duration-300 ${
                      activeSection === id ? "scale-110" : ""
                    }`}
                  >
                    {icon}
                  </div>
                  <span className="text-sm font-medium tracking-wide">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddSectionModal && (
        <AddSectionModal
          isOpen={showAddSectionModal}
          onClose={() => setShowAddSectionModal(false)}
          onAddSection={onAddSection}
          onRemoveSection={onRemoveSection}
          activeSections={activeSections}
        />
      )}
    </>
  );
};

export default SideBar;
