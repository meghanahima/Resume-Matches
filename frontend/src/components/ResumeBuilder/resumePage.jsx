import React from 'react';
import ResumeInput from './resumeInput';
import SectionRenderer from './SectionRenderer';
import { FaPlus } from 'react-icons/fa';

const PAGE_HEIGHT = '297mm'; // A4 height
const PAGE_PADDING = '25mm';
const CONTENT_HEIGHT = 'calc(297mm - 50mm)'; // Page height minus top and bottom padding

const ResumePage = ({ 
  resumeData, 
  activeSections, 
  onContactInfoChange, 
  onInputChange,
  onRemoveSection,
  onAddSection
}) => {
  // Split sections into pages
  const splitSectionsIntoPages = () => {
    let pages = [[]];
    let currentPage = 0;
    let currentHeight = 0;
    const heightPerSection = 150; // Approximate height per section in pixels

    // Contact and Summary always go on first page
    pages[0].push('contact');
    if (activeSections.includes('summary')) {
      pages[0].push('summary');
    }

    // Distribute other sections across pages
    activeSections
      .filter(section => section !== 'contact' && section !== 'summary')
      .forEach(section => {
        const sectionHeight = heightPerSection;
        
        if (currentHeight + sectionHeight > 1000) { // ~1000px is roughly A4 height minus margins
          currentPage++;
          pages[currentPage] = [];
          currentHeight = 0;
        }
        
        pages[currentPage].push(section);
        currentHeight += sectionHeight;
      });

    return pages;
  };

  const pages = splitSectionsIntoPages();

  return (
    <div className="max-w-[210mm] mx-auto">
      {pages.map((pageSections, pageIndex) => (
        <div 
          key={pageIndex}
          className="bg-white shadow-lg mb-8"
          style={{
            width: '210mm',
            height: PAGE_HEIGHT,
            padding: PAGE_PADDING,
            breakAfter: 'page',
            overflow: 'hidden'
          }}
        >
          {pageIndex === 0 && (
            // Contact Section - Only on first page
            <div className="mb-8">
              <ResumeInput
                value={resumeData.contact_info.name}
                onChange={(value) => onContactInfoChange("name", value)}
                placeholder="Full Name"
                className="text-3xl font-bold mb-4"
              />
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div className="group relative">
                  <ResumeInput
                    value={resumeData.contact_info.email}
                    onChange={(value) => onContactInfoChange("email", value)}
                    placeholder="Email"
                    className="group-hover:bg-gray-50/50"
                  />
                </div>
                <div className="group relative">
                  <ResumeInput
                    value={resumeData.contact_info.phone}
                    onChange={(value) => onContactInfoChange("phone", value)}
                    placeholder="Phone"
                    className="group-hover:bg-gray-50/50"
                  />
                </div>
                <div className="group relative">
                  <ResumeInput
                    value={resumeData.contact_info.location}
                    onChange={(value) => onContactInfoChange("location", value)}
                    placeholder="Location"
                    className="group-hover:bg-gray-50/50"
                  />
                </div>
                <div className="group relative">
                  <ResumeInput
                    value={resumeData.contact_info.linkedin}
                    onChange={(value) => onContactInfoChange("linkedin", value)}
                    placeholder="LinkedIn"
                    className="group-hover:bg-gray-50/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Render sections for this page */}
          {pageSections.map(section => {
            if (section === 'contact') return null; // Already handled above
            
            if (section === 'summary' && activeSections.includes('summary')) {
              return (
                <div key={section} className="mb-8 relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onRemoveSection("summary")}
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
                    onChange={(value) => onInputChange("summary", value)}
                    placeholder="Write your professional summary..."
                    multiline
                    className="group-hover:bg-gray-50/50"
                  />
                </div>
              );
            }

            return (
              <SectionRenderer
                key={section}
                section={section}
                data={resumeData[section]}
                onChange={(value) => onInputChange(section, value)}
                onRemove={() => onRemoveSection(section)}
              />
            );
          })}

          {/* Add Section Card - Only show on last page */}
          {pageIndex === pages.length - 1 && (
            <div onClick={onAddSection} className="mt-12 border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all duration-300 text-center">
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
          )}
        </div>
      ))}
    </div>
  );
};

export default ResumePage;