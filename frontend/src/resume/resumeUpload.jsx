import React, { useState } from "react";
import axios from "axios";
import * as pdfjs from "pdfjs-dist";
import { uploadFileToAzure } from "../services/azure";
import { useSpring, animated } from "@react-spring/web";

const ResumeUpload = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0); // 0: initial, 1: uploading, 2: processing, 3: complete

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 200,
  });

  const fetchData = async (pdfFile) => {
    try {
      const response = await axios.get(pdfFile, {
        responseType: "arraybuffer",
      });

      console.log("response:", response);

      const pdfData = response.data;
      const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
      let fullText = "";

      console.log("pdf number of pages:", pdf.numPages);

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join("\n");
        fullText += pageText + "\n";
      }
      console.log(fullText);
      return fullText;
    } catch (error) {
      console.error("Error fetching or parsing PDF file", error);
    }
  };

  const validateFile = (file) => {
    if (!file || file.size === 0) {
      alert("Please select a file before uploading.");
      console.error(`File is not accessible or empty.`);
      return false;
    }

    if (!file.name.endsWith(".pdf") || file.size < 100) {
      alert("Please select a valid PDF file.");
      console.error(`${file.name} is not a valid PDF or is too small.`);
      return false;
    }

    return true;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!validateFile(file)) return;

    setResumeFile(file);
    setIsLoading(true);
    setUploadStep(1);

    const timestamp = Date.now().toString();
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const filename = `${randomNumber}_${timestamp}_${file.name}`;

    try {
      setUploadStep(2);
      const fileUploaded = await uploadFileToAzure(filename, file);

      setUploadStep(3);
      const extractedText = await fetchData(fileUploaded.url);
      setText(extractedText);

      // Save to localStorage
      localStorage.setItem("userResume", extractedText);
    } catch (error) {
      console.error("Error uploading file or extracting text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <animated.div
      style={fadeIn}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Upload Your Resume
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer block">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-gray-600 mb-2">
                Drag and drop your PDF resume here
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </label>
          </div>

          {isLoading && (
            <div className="mt-8">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${(uploadStep / 3) * 100}%` }}
                ></div>
              </div>
              <p className="text-center mt-4 text-gray-600">
                {uploadStep === 1 && "Uploading resume..."}
                {uploadStep === 2 && "Processing document..."}
                {uploadStep === 3 && "Analyzing content..."}
              </p>
            </div>
          )}

          {resumeFile && !isLoading && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-green-600 font-medium">
                ✓ Resume uploaded successfully
              </p>
              <p className="text-sm text-gray-600 mt-1">{resumeFile.name}</p>
            </div>
          )}
        </div>
      </div>
    </animated.div>
  );
};

export default ResumeUpload;
