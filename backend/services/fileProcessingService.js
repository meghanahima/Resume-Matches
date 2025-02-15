const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { PythonShell } = require("python-shell");
const path = require("path");
const axios = require("axios");

class FileProcessingService {
  static async extractText(file) {
    try {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      let text = "";

      if (fileExtension === ".pdf") {
        const pdfData = await pdfParse(file.buffer);
        text = pdfData.text;
      } else if (fileExtension === ".docx") {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        text = result.value;
      } else {
        throw new Error("Unsupported file format");
      }

      return text;
    } catch (error) {
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  }

  static async analyzeText(text, jobDescriptions = null) {
    return new Promise((resolve, reject) => {
      try {
        console.log("Starting analysis...");
        const sanitizedText = Buffer.from(text).toString("base64");
        const pythonPath = process.env.PYTHON_PATH.replace(/\\/g, "/");
        const scriptPath = path
          .join(__dirname, "../python")
          .replace(/\\/g, "/");

        console.log(
          "Python script path:",
          path.join(scriptPath, "analyze_resume.py")
        );
        console.log("Python executable:", pythonPath);

        const options = {
          mode: "text",
          pythonPath: pythonPath,
          pythonOptions: ["-u"], // Unbuffered output
          scriptPath: scriptPath,
          args: [sanitizedText],
        };

        if (jobDescriptions) {
          const sanitizedJobs = jobDescriptions.map((job) => ({
            jobId: job._id.toString(),
            jobTitle: job.jobTitle,
            company: job.company,
            jobDescription: job.jobDescription,
          }));
          options.args.push(JSON.stringify(sanitizedJobs));
        }

        console.log("Executing Python script...");
        PythonShell.run("analyze_resume.py", options)
          .then((results) => {
            console.log("Python execution completed");
            const analysis = JSON.parse(results[0]);
            resolve(analysis);
          })
          .catch((err) => {
            console.error("Python execution failed:", err);
            reject(err);
          });
      } catch (error) {
        console.error("General Error:", error);
        reject(error);
      }
    });
  }

  static calculateATSScore(analysis) {
    let score = 0;
    const maxScore = 100;

    // Comprehensive scoring based on Resume-Matcher analysis
    if (analysis.skills?.length > 0) score += 15;
    if (analysis.experience?.length > 0) score += 20;
    if (analysis.education?.length > 0) score += 15;
    if (analysis.certifications?.length > 0) score += 10;
    if (analysis.projects?.length > 0) score += 10;
    if (analysis.contact_info?.email || analysis.contact_info?.phone)
      score += 10;
    if (analysis.key_terms?.technical?.length > 0) score += 10;
    if (analysis.key_terms?.domain?.length > 0) score += 5;
    if (analysis.key_terms?.soft_skills?.length > 0) score += 5;

    return Math.min(score, maxScore);
  }

  static async downloadFileFromUrl(url) {
    try {
      const response = await axios({
        method: "get",
        url: url,
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(response.data);
      const fileExtension = url.split(".").pop().toLowerCase();

      return {
        buffer,
        originalname: `file.${fileExtension}`,
        mimetype: `application/${fileExtension}`,
      };
    } catch (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }
}

module.exports = FileProcessingService;
