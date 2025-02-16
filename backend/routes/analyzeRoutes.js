const express = require("express");
const router = express.Router();
const FileProcessingService = require("../services/fileProcessingService");
const { protect } = require("../middleware/authMiddleware");
const JobDescription = require("../schema/jobDescriptionModel");
const Resume = require("../schema/resumeSchema");
const axios = require("axios");
const cacheService = require("../services/cacheService");
const { normalizeSkill } = require("../utils/skillsNormalizer");
const rateLimit = require("axios-rate-limit");
const apiKeyService = require("../services/apiKeyService");

// Create rate-limited axios instance with retry logic built in
const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 60,
  perMilliseconds: 60000, // 60 requests per minute
});

// Add interceptor for retries
axiosInstance.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }
  config.retry -= 1;
  if (error.response?.status === 429) {
    const delayMs = 1000; // Wait 1 second before retry
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return axiosInstance(config);
  }
  return Promise.reject(error);
});

// Add retry config to all requests
axiosInstance.defaults.retry = 3;

// Add constants for rate limiting
const GEMINI_LIMITS = {
  FREE_TIER_LIMIT: 60, // requests per minute
  RETRY_AFTER: 60000, // 1 minute in milliseconds
};

// Add rate limit tracking
let apiCallsCount = 0;
let lastResetTime = Date.now();

// Function to check API limits
function checkApiLimits() {
  const now = Date.now();
  if (now - lastResetTime > 60000) {
    // Reset counter after 1 minute
    apiCallsCount = 0;
    lastResetTime = now;
  }
  return apiCallsCount < GEMINI_LIMITS.FREE_TIER_LIMIT;
}

// Process job with rate limit handling
async function processJob(job, resume, resumeSkills) {
  try {
    if (!checkApiLimits()) {
      return {
        ...job,
        finalMatchScore: job.skillMatchScore,
        matchReason: `Preliminary match based on ${job.matchingSkills.length} shared skills`,
        matchDetails: {
          skillMatchScore: job.skillMatchScore,
          aiMatchScore: null,
          matchingSkills: job.matchingSkills,
          notice:
            "Detailed analysis unavailable due to high traffic. Please try again in a minute.",
        },
      };
    }

    apiCallsCount++;

    // Convert skills to array if it's a string
    const jobSkills =
      typeof job.skills === "string"
        ? job.skills.split(/[,;]/).map((s) => s.trim())
        : Array.isArray(job.skills)
        ? job.skills
        : job.processedSkills || []; // Use processedSkills as fallback

    const jobPrompt = `Analyze this resume-job match and return a JSON response.
RESUME DETAILS:

JOB DETAILS:
- Title: ${job.jobTitle || "Not specified"}
- Company: ${job.company || "Not specified"}
- Required Skills: ${jobSkills.join(", ")}
- Description: ${(job.jobDescription || "").substring(0, 500)}...

Return a JSON object with this exact structure:
{
  "matchScore": <number between 0-100>,
  "matchReason": "<one sentence explanation>"
}`;

    const geminiResponse = await axiosInstance.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: jobPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
          topP: 0.8,
          topK: 40,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKeyService.getJobsApiKey(),
        },
      }
    );

    // Process response and return result
    const result = JSON.parse(
      geminiResponse.data.candidates[0].content.parts[0].text
        .replace(/```json\n|\n```|```/g, "")
        .trim()
    );

    return {
      ...job,
      finalMatchScore: job.skillMatchScore * 0.6 + result.matchScore * 0.4,
      matchReason: result.matchReason,
      matchDetails: {
        skillMatchScore: job.skillMatchScore,
        aiMatchScore: result.matchScore,
        matchingSkills: job.matchingSkills,
        jobSkills: jobSkills, // Include processed skills in response
      },
    };
  } catch (error) {
    if (error.response?.status === 429) {
      // Mark current key as failed and try with next key
      apiKeyService.markKeyAsFailed();

      // Retry the request with a new key
      return processJob(job, resume, resumeSkills);
    }

    console.error("Job processing error details:", {
      jobId: job.jobId,
      error: error.message,
      skills: job.skills,
      processedSkills: job.processedSkills,
    });

    return {
      ...job,
      finalMatchScore: job.skillMatchScore,
      matchReason: `Skill-based match with ${
        job.matchingSkills?.length || 0
      } shared skills`,
      matchDetails: {
        skillMatchScore: job.skillMatchScore,
        aiMatchScore: null,
        matchingSkills: job.matchingSkills,
        error: "Technical issue with detailed analysis",
        jobSkills: job.processedSkills || [], // Include processed skills even in error case
      },
    };
  }
}

async function processJobs(jobs, resume, resumeSkills) {
  try {
    const jobPrompts = jobs
      .map((job) => {
        const jobSkills =
          typeof job.skills === "string"
            ? job.skills.split(/[,;]/).map((s) => s.trim())
            : Array.isArray(job.skills)
            ? job.skills
            : job.processedSkills || [];

        return `JOB DETAILS:
- Title: ${job.jobTitle || "Not specified"}
- Company: ${job.company || "Not specified"}
- Required Skills: ${jobSkills.join(", ")}
- Description: ${(job.jobDescription || "").substring(0, 500)}...`;
      })
      .join("\n\n");

    const resumeDetails = `RESUME DETAILS:
- Skills: ${resumeSkills.join(", ")}
- Experience Level: ${resume.analysis.experience?.length || 0} positions
- Education: ${resume.analysis.education?.map((e) => e.degree).join(", ")}`;

    const jobPrompt = `Analyze these resume-job matches and return a JSON response for each job.
${resumeDetails}

${jobPrompts}

Return a JSON array with each object having this exact structure:
{
  "matchScore": <number between 0-100>,
  "matchReason": "<one sentence explanation>"
}`;

    const geminiResponse = await axiosInstance.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: jobPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
          topP: 0.8,
          topK: 40,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKeyService.getJobsApiKey(),
        },
      }
    );

    const results = JSON.parse(
      geminiResponse.data.candidates[0].content.parts[0].text
        .replace(/```json\n|\n```|```/g, "")
        .trim()
    );

    return jobs.map((job, index) => {
      const result = results[index];
      console.log(job);
      return {
        ...job,
        finalMatchScore: job.skillMatchScore * 0.6 + result.matchScore * 0.4,
        matchReason: result.matchReason,
        aiMatchScore: result.matchScore,
      };
    });
  } catch (error) {
    if (error.response?.status === 429) {
      // Mark current key as failed and try with next key
      apiKeyService.markKeyAsFailed();

      // Retry the request with a new key
      return processJobs(jobs, resume, resumeSkills);
    }

    return {
      geminiErrorResponse: true,
    };
  }
}

// Route to analyze resume with pagination
// router.post("/analyze-resume", protect, async (req, res) => {
//   try {
//     console.log("Analyzing resume");
//     const { url, page = 1, limit = 10 } = req.body;

//     if (!url) {
//       return res.status(400).json({ message: "URL is required" });
//     }

//     // Download and extract text from file
//     const file = await FileProcessingService.downloadFileFromUrl(url);
//     const text = await FileProcessingService.extractText(file);
//     // Get job descriptions with pagination
//     const skip = (page - 1) * limit;
//     const jobDescriptions = await JobDescription.find({})
//       .select("jobId jobTitle company jobDescription")
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // Get total count for pagination
//     const totalJobs = await JobDescription.countDocuments();

//     // Analyze text and match with jobs
//     const analysis = await FileProcessingService.analyzeText(
//       text,
//       jobDescriptions
//     );

//     res.json({
//       analysis,
//       // pagination: {
//       //   currentPage: page,
//       //   totalPages: Math.ceil(totalJobs / limit),
//       //   totalJobs,
//       //   hasMore: skip + jobDescriptions.length < totalJobs,
//       // },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.post("/get-jobs/:id", async (req, res) => {
  try {
    const resumeId = req.params.id;
    const { page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;

    // Use cacheService methods instead of direct cache access
    let analyzedJobs = await cacheService.getAnalyzedJobs(resumeId);

    if (!analyzedJobs) {
      // If not in cache, do the full analysis
      const resume = await Resume.findById(resumeId);
      if (!resume || !resume.parsedInfo) {
        return res
          .status(404)
          .json({ message: "Resume parsedInfo not found" });
      }

      const resumeSkills = resume.parsedInfo.skills
        .map((skill) => normalizeSkill(skill.skill))
        .filter((skill) => skill.length > 0);

      // First get ALL potentially matching jobs
      const skillMatchedJobs = await JobDescription.aggregate([
        // Process skills
        {
          $addFields: {
            processedSkills: {
              $cond: {
                if: { $eq: [{ $type: "$skills" }, "string"] },
                then: { $split: [{ $toLower: "$skills" }, ","] },
                else: "$skills",
              },
            },
          },
        },
        // Calculate matching skills
        {
          $addFields: {
            matchingSkills: {
              $filter: {
                input: "$processedSkills",
                as: "skill",
                cond: { $in: [{ $trim: { input: "$$skill" } }, resumeSkills] },
              },
            },
          },
        },
        // Calculate initial match score
        {
          $addFields: {
            skillMatchScore: {
              $multiply: [
                {
                  $divide: [
                    { $size: "$matchingSkills" },
                    { $add: [{ $size: "$processedSkills" }, 0.1] },
                  ],
                },
                100,
              ],
            },
          },
        },
        // Only keep jobs with some skill match
        {
          $match: {
            skillMatchScore: { $gt: 0 }, // Any match is considered
          },
        },
        // Sort by initial score
        {
          $sort: { skillMatchScore: -1 },
        },
      ]);

      // Process top 100 matches with AI for better accuracy
      const topJobsToProcess = skillMatchedJobs.slice(0, 100);
      const processedJobs = [];
      const batchSize = 5;

      for (let i = 0; i < topJobsToProcess.length; i += batchSize) {
        const batch = topJobsToProcess.slice(i, i + batchSize);
        const results = await processJobs(batch, resume, resumeSkills);
        if (results?.geminiErrorResponse === true) {
          console.log("processedJobs.length", processedJobs.length);
          break;
        }
        // console.log(results);
        processedJobs.push(...results);
        if (i + batchSize < topJobsToProcess.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      console.log("processedJobs.length", processedJobs.length);

      // Sort all processed jobs
      analyzedJobs = processedJobs.sort(
        (a, b) => b.finalMatchScore - a.finalMatchScore
      );

      console.log("analyzedJobs.length", analyzedJobs.length);

      // Cache using cacheService
      await cacheService.setAnalyzedJobs(resumeId, analyzedJobs);
    } else {
      console.log("Using cached results");
    }

    // Paginate from cached results
    console.log("skip limit", skip, skip+limit);
    const paginatedJobs = analyzedJobs.slice(skip, skip+limit);
    
    const response = {
      success: true,
      matches: paginatedJobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(analyzedJobs.length / limit),
        totalMatches: analyzedJobs.length,
        hasMore: skip + limit < analyzedJobs.length,
      },
      // cacheInfo: {
      //   fromCache: !!analyzedJobs,
      //   // Use getTtl through cacheService if needed
      //   expiresIn: 3600, // Default 1 hour
      // },
    };

    res.json(response);
  } catch (error) {
    console.error("Error in analyze-resume:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      notice: "An error occurred during analysis",
    });
  }
});

module.exports = router;
