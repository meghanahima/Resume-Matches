const express = require("express");
const router = express.Router();
const Resume = require("../schema/resumeSchema");
const User = require("../schema/userSchema");
const { protect } = require("../middleware/authMiddleware");
const axios = require("axios");
const FileProcessingService = require("../services/fileProcessingService");
const apiKeyService = require("../services/apiKeyService");

// Create new resume
router.post("/save-resume", protect, async (req, res) => {
  try {
    const body = req.body;
    const API_KEY = apiKeyService.getResumeApiKey();

    if (!API_KEY) {
      throw new Error('Missing API key for Gemini API');
    }

    // Save resume document with URL
    let resume = await Resume.create(body);

    // Extract text content from the resume using FileProcessingService
    const file = await FileProcessingService.downloadFileFromUrl(body.url);
    const extractedContent = await FileProcessingService.extractText(file);

    // Call Gemini API to parse resume
    const prompt = `Analyze this resume and extract key details into a structured JSON format.  
Ensure the response is within a **1000-token limit** by prioritizing the most relevant details and avoiding redundancy. **Extract all skills** and remove duplicates.  

Return the response in the following **valid JSON format**:  

{
  "parsedInfo": {
    "contact_info": {
      "name": string | null,           // Extract full name  
      "email": string | null,          // Extract email  
      "phone": string | null,          // Extract phone number  
      "location": string | null,       // Extract city or full address if available  
      "linkedin": string | null,       // Extract LinkedIn profile link 
    },
    "summary": string | null,           // Extract a concise professional summary  
    "skills": [                          // Extract all unique skills  
      {
        "skill": string | null,         // Skill name  
        "level": string | null          // Proficiency level (if available)  
      }
    ],
    "languages": [                       // Extract spoken & programming languages  
      {
        "language": string | null,  
        "level": string | null  
      }
    ],
    "employmentHistory": [               // Extract most **relevant** jobs (max 3)  
      {
        "jobTitle": string | null,  
        "company": string | null,
        "startDate": string | null,     // Format: MM/YYYY or YYYY  
        "endDate": string | null,       // "Present" if ongoing
        "presentWorking": boolean | null // True if currently employed    
        "description": string | null 
      }
    ],
    "projects": [                        // Extract key projects (max 3)  
      {
        "title": string | null,  
        "techStackUsed": [string | null], // Technologies used  
        "role": string | null,  
        "description": string | null  
      }
    ],
    "education": [                        // Extract **highest** education  
      {
        "degree": string | null,  
        "institution": string | null,  
        "year": string | null  
      }
    ]
  },
  "analysis": {                           // Provide insights on the candidate  
    "strengths": string[],                // Max **3 key strengths**  
    "weaknesses": string[],               // Max **3 areas for improvement**  
    "suggestions": string[]               // Max **3 actionable career suggestions**  
  },
  "ATSScore": number | null               // Optional: Include ATS score
}

### **Guidelines for Extraction:**  
- **Avoid redundancy** – Include only unique and relevant details.  
- **Ensure valid JSON** – Do not include missing commas or incorrect formats.  
- **Use concise, clear descriptions** – Keep summaries short and impactful.  
- **Extract all skills** while avoiding duplication.  
- **Ensure consistency** – Maintain proper date formats (MM/YYYY or YYYY).  

### **Resume text to analyze:**  
${extractedContent}

### **Analysis Instructions:**  
- Provide **constructive feedback** focusing on **career improvement**.  
- Limit analysis to a **maximum of**:  
  - **3 strengths** – Highlight key professional advantages.  
  - **3 weaknesses** – Identify areas for development.  
  - **3 career suggestions** – Offer specific recommendations.  
- Make feedback **actionable** and **tailored to the resume content**.  

### **ATS Scoring Guidelines:**
- Calculate **Overall ATS Score (0-100)** based on:
  - **Keyword Optimization (35%)**:
    - Presence of industry-specific keywords
    - Appropriate keyword density
    - Match with job market requirements
    - Technical skills relevance
  
  - **Content Quality (35%)**:
    - Clear job titles and roles
    - Quantified achievements
    - Action verbs usage
    - Professional summary effectiveness
    - Experience descriptions clarity
  
  - **Information Completeness (30%)**:
    - Contact information completeness
    - Work history completeness
    - Education details presence
    - Skills and certifications listing
    - Project details (if applicable)
    - Chronological order clarity
  
- **Scoring Criteria:**
  - 90-100: Excellent content optimization
  - 70-89: Good, minor content improvements needed
  - 50-69: Fair, needs moderate content enhancement
  - 0-49: Poor, requires major content improvements

### **Scoring Focus:**
- Emphasis on content quality and relevance
- Keyword placement and context
- Information completeness and accuracy
- Professional language usage
- Achievement quantification
`


    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.1, // Reduced for more consistent output
          topP: 1,
          topK: 1,
          maxOutputTokens: 3000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY,
        },
      }
    );

    // Clean and parse the response
    let parsedContent;
    try {
      const responseText =
        geminiResponse.data.candidates[0].content.parts[0].text;

      // Remove markdown formatting and clean the JSON string
      const jsonStr = responseText
        .replace(/```json\n|\n```|```/g, "") // Remove markdown
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
        .replace(/\n/g, " ") // Replace newlines with spaces
        .replace(/\r/g, "") // Remove carriage returns
        .replace(/\t/g, " ") // Replace tabs with spaces
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim();

      // Additional cleanup for trailing commas
      const cleanJsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

      parsedContent = JSON.parse(cleanJsonStr);
    } catch (error) {
      console.error(
        "Raw response:",
        geminiResponse.data.candidates[0].content.parts[0].text
      );
      console.error("Error parsing Gemini response:", error);
      throw new Error("Failed to parse resume content: " + error.message);
    }

    resume.content = extractedContent;
    resume.parsedInfo = parsedContent.parsedInfo;
    resume.analysis = parsedContent.analysis;
    resume.ATSScore = parsedContent.ATSScore;
    let savedResume = await resume.save();

    // Add resume to user's resumes array
    // await User.findByIdAndUpdate(
    //   req.user._id,
    //   { $push: { resumes: resume._id } },
    //   { new: true }
    // );

    // const { content, ...resumeWithoutContent } = savedResume;
    res.status(201).json({
      success: true,
      resume: resume,
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(400).json({
      success: false,
      message: error.message,
      error: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      }
    });
  }
});

// Get all resumes for a user
router.get("/get-resumes/:userId", protect, async (req, res) => {
  const userId = req.params.userId;
  try {
    const resumes = await Resume.find({ userId: userId }).sort({
      createdAt: -1,
    });
    res.json({ resumes: resumes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single resume by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update resume
router.put("/:id", protect, async (req, res) => {
  try {
    const { url, title, data, isActive } = req.body;

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.url = url || resume.url;
    resume.title = title || resume.title;
    resume.data = data || resume.data;
    resume.isActive = isActive !== undefined ? isActive : resume.isActive;

    const updatedResume = await resume.save();
    res.json(updatedResume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete resume
router.delete("/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Remove resume from user's resumes array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { resumes: resume._id },
    });

    await resume.deleteOne();
    res.json({ message: "Resume removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
