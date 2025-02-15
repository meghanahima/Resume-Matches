const express = require("express");
const router = express.Router();
const Resume = require("../schema/resumeSchema");
const User = require("../schema/userSchema");
const { protect } = require("../middleware/authMiddleware");
const axios = require("axios");
const FileProcessingService = require("../services/fileProcessingService");

// Create new resume
router.post("/save-resume", protect, async (req, res) => {
  try {
    const body = req.body;

    // Save resume document with URL
    let resume = await Resume.create(body);

    // Extract text content from the resume using FileProcessingService
    const file = await FileProcessingService.downloadFileFromUrl(body.url);
    const content = await FileProcessingService.extractText(file);

    // Call Gemini API to parse resume
    const prompt = `Extract information from this resume and return a clean JSON object. Follow these rules strictly:
1. Only return valid JSON, no markdown or explanations
2. Omit any fields that are not found in the resume
3. Use null for missing values within required objects
4. Ensure all arrays are properly formatted, even if empty
5. Use consistent formatting for dates and durations

Expected JSON structure:
{
  "contact_info": {
    "name": string | null,
    "email": string | null,
    "phone": string | null,
    "location": string | null,
    "linkedin": string | null
  },
  "summary": string | null,
  "skills": string[],
  "experience": [
    {
      "title": string,
      "company": string,
      "duration": string,
      "responsibilities": string[]
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "year": string
    }
  ],
  "certifications": string[],
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": string[]
    }
  ],
  "achievements": string[]
}

Resume text to parse:
${content}

Return only the JSON object, no additional text or formatting.`;

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
          maxOutputTokens: 1000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": "AIzaSyA96FvIGYUT25DoCFH9uJeH1gRJbbwWkJE",
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

    resume.content = content;
    resume.analysis = parsedContent;
    await resume.save();

    // Add resume to user's resumes array
    // await User.findByIdAndUpdate(
    //   req.user._id,
    //   { $push: { resumes: resume._id } },
    //   { new: true }
    // );

    res.status(201).json({
      success: true,
      resume: {
        // ...resume,
        parsedData: parsedContent,
      },
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.response?.data || error,
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
