const express = require("express");
const userRoutes = require("./userRoutes");
const resumeRoutes = require("./resumeRoutes");
const analyzeRoutes = require("./analyzeRoutes");
const app = express();

app.use('/users', userRoutes);
app.use('/resumes', resumeRoutes);
app.use('/analyze', analyzeRoutes);

module.exports = app;
