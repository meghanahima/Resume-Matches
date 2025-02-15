const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    jobPortal: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
      set: function (skills) {
        if (typeof skills === "string") {
          // Split by common delimiters and clean up
          return skills
            .split(/[,;()]/) // Split by comma, semicolon, or parentheses
            .map((skill) =>
              skill
                .replace(/e\.g\.|and|or/gi, "") // Remove common connecting words
                .trim()
                .toLowerCase()
            )
            .filter((skill) => skill.length > 0); // Remove empty strings
        }
        return skills;
      },
    },
    responsibilities: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    companyProfile: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

// Compound index for faster searching
jobSchema.index({
  skills: 1,
  jobTitle: "text",
  jobDescription: "text",
});

// Add skills-based pre-processing
jobSchema.pre("save", function (next) {
  try {
    if (this.isModified("skills")) {
      if (typeof this.skills === "string") {
        this.skills = this.skills
          .split(/[,;()]/)
          .map((skill) =>
            skill
              .replace(/e\.g\.|and|or/gi, "")
              .trim()
              .toLowerCase()
          )
          .filter((skill) => skill.length > 0);
      } else if (Array.isArray(this.skills)) {
        this.skills = this.skills
          .flatMap((skill) =>
            typeof skill === "string"
              ? skill.split(/[,;()]/).map((s) =>
                  s
                    .replace(/e\.g\.|and|or/gi, "")
                    .trim()
                    .toLowerCase()
                )
              : []
          )
          .filter((skill) => skill.length > 0);
      }
    }
    console.log("Processed skills:", this.skills);
    next();
  } catch (error) {
    next(error);
  }
});

const JobDescription = mongoose.model("job", jobSchema);

// Force index rebuild
jobSchema.on("index", function (err) {
  if (err) {
    console.error("Job Description index error: %s", err);
  } else {
    console.log("Job Description indexing complete");
  }
});

module.exports = JobDescription;
