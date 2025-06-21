# 📄 AI Powered Resume-to-Job Matching System

An intelligent platform that matches resumes to job descriptions using Generative AI and ML-based similarity models. It provides ranked job suggestions, detailed scoring, and an activity dashboard for tracking resume interactions — streamlining both job search and recruitment workflows.


## 🎥 Demo

![Project Demo](demo.gif)


## ✨ Features

### 📂 Resume Parsing
Leverages **Generative AI** to extract structured data (skills, experience, education) from resumes

### 📊 Job Matching & Scoring
Uses a combination of **SBERT** and **ML models** to assess and assign a **match score** to each job and displays ranked results

### 📈 Activity Tracking
Interactive dashboard to view saved jobs and resumes

---

## ⚙️ Tech Stack

- **Generative AI** for context-aware resume understanding
- **SBERT + cosine similarity** for semantic job matching
- **Python backend** with **MongoDB** for data storage
- **Redis** for fast match computation and caching
- **Azure S3** for storing resume files securely
