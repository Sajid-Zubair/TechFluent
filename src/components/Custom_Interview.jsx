import React, { useEffect, useState } from "react";
import Sidenav from "./Sidenav";
import { FaBars } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

function Custom_Interview() {
  const navigate = useNavigate();
  // Form state
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [interviewStyle, setInterviewStyle] = useState("");
  const [interviewGoal, setInterviewGoal] = useState("");
  const [interviewDuration, setInterviewDuration] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  // Validation error state
  const [errors, setErrors] = useState({});

  // Loading state on submit
  const [loading, setLoading] = useState(false);

  // Mobile nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Disable background scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "auto";
  }, [mobileNavOpen]);

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!jobDescription.trim())
      newErrors.jobDescription = "Job description is required.";
    if (!experienceLevel)
      newErrors.experienceLevel = "Please select your experience level.";
    if (!interviewType)
      newErrors.interviewType = "Please select interview type.";
    if (!interviewStyle)
      newErrors.interviewStyle = "Please select interview style.";
    if (!interviewGoal)
      newErrors.interviewGoal = "Please select interview goal.";
    if (!interviewDuration)
      newErrors.interviewDuration = "Please select interview duration.";
    if (!resumeFile) newErrors.resumeFile = "Please upload your resume.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0] || null);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // navigate to the AI Interview page with state
      navigate("/start-custom-interview", {
        state: {
          formData: {
            jobDescription,
            experienceLevel,
            interviewType,
            interviewStyle,
            interviewGoal,
            interviewDuration,
          },
        },
      });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidenav for Desktop */}
      <div className="hidden md:block">
        <Sidenav />
      </div>

      {/* Hamburger for Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="text-3xl text-blue-700"
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40 p-4 overflow-y-auto">
          <Sidenav />
          <button
            onClick={() => setMobileNavOpen(false)}
            className="absolute top-2 right-2 text-2xl text-red-600 mt-4"
            aria-label="Close menu"
          >
            ❌
          </button>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 transition-opacity duration-300 ${
          mobileNavOpen ? "opacity-30 pointer-events-none" : ""
        } md:ml-64`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="text-center mb-8 mt-12 sm:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Your Personalized Mock Interview
            </h1>
            <p className="mt-2 text-gray-600 text-md">
              Fill out your preferences below and start practicing interviews
              tailored to your needs.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-200"
          >
            {/* Job Description */}
            <div>
              <label
                htmlFor="jobDescription"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Job Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="jobDescription"
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description you're preparing for..."
                className={`w-full border-2 rounded-xl p-4 text-gray-700 placeholder-gray-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition ${
                  errors.jobDescription ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.jobDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.jobDescription}
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label
                htmlFor="experienceLevel"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Experience Level <span className="text-red-600">*</span>
              </label>
              <select
                id="experienceLevel"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className={`w-full border-2 rounded-xl p-4 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition ${
                  errors.experienceLevel ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Experience Level</option>
                <option value="fresher">🌱 Fresher</option>
                <option value="entry">🚀 Junior Level</option>
                <option value="mid">⚙️ Mid Level</option>
                <option value="senior">🧠 Senior Level</option>
                <option value="expert">🎯 Specialist Roles</option>
                <option value="manager">
                  🏆 Managerial / Leadership Roles
                </option>
              </select>
              {errors.experienceLevel && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            {/* Interview Type */}
            <div>
              <label
                htmlFor="interviewType"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Interview Type <span className="text-red-600">*</span>
              </label>
              <select
                id="interviewType"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className={`w-full border-2 rounded-xl p-4 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition ${
                  errors.interviewType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Interview Type</option>
                <option value="technical">💻 Technical (DSA / Coding)</option>
                <option value="system_design">🏗️ System Design</option>
                <option value="core_cs">📘 Core CS Fundamentals</option>
                <option value="web_tech">🌐 Web Technologies</option>
                <option value="aptitude">🧠 Aptitude</option>
                <option value="hr">🤝 HR (Behavioral)</option>
              </select>
              {errors.interviewType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.interviewType}
                </p>
              )}
            </div>

            {/* Interview Style */}
            <div>
              <label
                htmlFor="interviewStyle"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Interview Style <span className="text-red-600">*</span>
              </label>
              <select
                id="interviewStyle"
                value={interviewStyle}
                onChange={(e) => setInterviewStyle(e.target.value)}
                className={`w-full border-2 rounded-xl p-4 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition ${
                  errors.interviewStyle ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Style</option>
                <option value="formal">🎩 Formal</option>
                <option value="friendly">😊 Friendly</option>
                <option value="stress">🔥 Stress-Based</option>
                <option value="mentor">🎓 Mentor-Style</option>
              </select>
              {errors.interviewStyle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.interviewStyle}
                </p>
              )}
            </div>

            {/* Interview Goal */}
            <div>
              <label
                htmlFor="interviewGoal"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Interview Goal <span className="text-red-600">*</span>
              </label>
              <select
                id="interviewGoal"
                value={interviewGoal}
                onChange={(e) => setInterviewGoal(e.target.value)}
                className={`w-full border-2 rounded-xl p-4 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition ${
                  errors.interviewGoal ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Goal</option>
                <option value="internship">🎒 Internship Preparation</option>
                <option value="fulltime_job">
                  💼 Full-time Job Preparation
                </option>
                <option value="practice">🧪 Practice</option>
              </select>
              {errors.interviewGoal && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.interviewGoal}
                </p>
              )}
            </div>

            {/* Interview Duration */}
            <div>
              <label
                htmlFor="interviewDuration"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Interview Duration <span className="text-red-600">*</span>
              </label>
              <select
                id="interviewDuration"
                value={interviewDuration}
                onChange={(e) => setInterviewDuration(e.target.value)}
                className={`w-full border-2 rounded-xl p-4 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition ${
                  errors.interviewDuration
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Choose Duration</option>
                <option value="15">🕒 15 Minutes</option>
                <option value="30">🕒 30 Minutes</option>
                <option value="45">🕒 45 Minutes</option>
                <option value="60">🕒 60 Minutes</option>
              </select>
              {errors.interviewDuration && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.interviewDuration}
                </p>
              )}
            </div>

            {/* Resume Upload */}
            <div>
              <label
                htmlFor="resumeFile"
                className="block text-lg font-semibold text-gray-800 mb-3"
              >
                Upload Resume <span className="text-red-600">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 text-center ${
                  errors.resumeFile
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <input
                  id="resumeFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-lg font-medium text-gray-700">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-500">
                  Accepted: PDF, DOC, DOCX • Max size: 10MB
                </p>
              </div>
              {errors.resumeFile && (
                <p className="mt-2 text-sm text-red-600">{errors.resumeFile}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Starting Interview..." : "Start Mock Interview"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Custom_Interview;
