import React, { useEffect, useState } from 'react';
import Sidenav from './Sidenav';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

function Custom_Interview() {
  const navigate = useNavigate();
  // Form state
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [interviewStyle, setInterviewStyle] = useState('');
  const [interviewGoal, setInterviewGoal] = useState('');
  const [interviewDuration, setInterviewDuration] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  // Validation error state
  const [errors, setErrors] = useState({});

  // Loading state on submit
  const [loading, setLoading] = useState(false);

  // Mobile nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Disable background scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : 'auto';
  }, [mobileNavOpen]);

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!jobDescription.trim()) newErrors.jobDescription = 'Job description is required.';
    if (!experienceLevel) newErrors.experienceLevel = 'Please select your experience level.';
    if (!interviewType) newErrors.interviewType = 'Please select interview type.';
    if (!interviewStyle) newErrors.interviewStyle = 'Please select interview style.';
    if (!interviewGoal) newErrors.interviewGoal = 'Please select interview goal.';
    if (!interviewDuration) newErrors.interviewDuration = 'Please select interview duration.';
    if (!resumeFile) newErrors.resumeFile = 'Please upload your resume.';
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
        navigate('/start-custom-interview', {
          state: {
            formData: {
              jobDescription,
              experienceLevel,
              interviewType,
              interviewStyle,
              interviewGoal,
              interviewDuration
            }
          }
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
          mobileNavOpen ? 'opacity-30 pointer-events-none' : ''
        } md:ml-64`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="text-center mb-8 mt-12 sm:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Your Personalized Mock Interview
            </h1>
            <p className="mt-2 text-gray-600 text-md">
              Fill out your preferences below and start practicing interviews tailored to your needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Job Description */}
            <div className="mb-6">
              <label
                htmlFor="jobDescription"
                className="block mb-2 text-lg font-semibold text-gray-700"
              >
                Job Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter the job description you want to be interviewed for."
                className={`w-full border-2 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.jobDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-describedby={errors.jobDescription ? 'jobDescription-error' : undefined}
              />
              {errors.jobDescription && (
                <p id="jobDescription-error" className="mt-1 text-sm text-red-600">
                  {errors.jobDescription}
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label
                htmlFor="experienceLevel"
                className="block mb-2 text-lg font-semibold text-gray-700"
              >
                Experience Level <span className="text-red-600">*</span>
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className={`w-full border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.experienceLevel ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-describedby={errors.experienceLevel ? 'experienceLevel-error' : undefined}
              >
                <option value="">Select Experience Level</option>
                <option value="fresher">Fresher</option>
                <option value="entry">Junior Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="expert">Specialist Roles</option>
                <option value="manager">Managerial / Leadership Roles</option>
              </select>
              {errors.experienceLevel && (
                <p id="experienceLevel-error" className="mt-1 text-sm text-red-600">
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            {/* Interview Type */}
            <div className="mb-6">
              <label
                htmlFor="interviewType"
                className="block mb-2 text-lg font-semibold text-gray-700"
              >
                Interview Type <span className="text-red-600">*</span>
              </label>
              <select
                id="interviewType"
                name="interviewType"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className={`w-full border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.interviewType ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-describedby={errors.interviewType ? 'interviewType-error' : undefined}
              >
                <option value="">Select Interview Type</option>
                <option value="technical">Technical (DSA / Coding Round)</option>
                <option value="system_design">System Design</option>
                <option value="core_cs">Core Computer Science Fundamentals</option>
                <option value="web_tech">Web Technologies</option>
                <option value="aptitude">Aptitude Test</option>
                <option value="hr">HR Interview (Behavioral)</option>
              </select>
              {errors.interviewType && (
                <p id="interviewType-error" className="mt-1 text-sm text-red-600">
                  {errors.interviewType}
                </p>
              )}
            </div>

            {/* Interview Style */}
            <div className="mb-6">
              <label
                htmlFor="interviewStyle"
                className="block mb-2 text-lg font-semibold text-gray-700"
              >
                Interview Style <span className="text-red-600">*</span>
              </label>
              <select
                id="interviewStyle"
                name="interviewStyle"
                value={interviewStyle}
                onChange={(e) => setInterviewStyle(e.target.value)}
                className={`w-full border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.interviewStyle ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-describedby={errors.interviewStyle ? 'interviewStyle-error' : undefined}
              >
                <option value="">Select Interview Style</option>
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
                <option value="stress">Stress-Based</option>
                <option value="mentor">Mentor-Style</option>
              </select>
              {errors.interviewStyle && (
                <p id="interviewStyle-error" className="mt-1 text-sm text-red-600">
                  {errors.interviewStyle}
                </p>
              )}
            </div>

            {/* Interview Goal */}
            <div className="mb-6">
              <label
                htmlFor="interviewGoal"
                className="block mb-2 text-lg font-semibold text-gray-700"
              >
                Interview Goal <span className="text-red-600">*</span>
              </label>
              <select
                id="interviewGoal"
                name="interviewGoal"
                value={interviewGoal}
                onChange={(e) => setInterviewGoal(e.target.value)}
                className={`w-full border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.interviewGoal ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-describedby={errors.interviewGoal ? 'interviewGoal-error' : undefined}
              >
                <option value="">Select Interview Goal</option>
                <option value="internship">Internship Preparation</option>
                <option value="fulltime_job">Fulltime Job Preparation</option>
                <option value="practice">Practice</option>
              </select>
              {errors.interviewGoal && (
                <p id="interviewGoal-error" className="mt-1 text-sm text-red-600">
                  {errors.interviewGoal}
                </p>
              )}
            </div>

            {/* Interview Duration */}
            <div className="mb-6">
              <label
                htmlFor="interviewDuration"
                className="block mb-2 text-lg font-semibold text-gray-700"
              >
                Interview Duration <span className="text-red-600">*</span>
              </label>
              <select
                id="interviewDuration"
                name="interviewDuration"
                value={interviewDuration}
                onChange={(e) => setInterviewDuration(e.target.value)}
                className={`w-full border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.interviewDuration ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-describedby={errors.interviewDuration ? 'interviewDuration-error' : undefined}
              >
                <option value="">Select Interview Duration</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
              {errors.interviewDuration && (
                <p id="interviewDuration-error" className="mt-1 text-sm text-red-600">
                  {errors.interviewDuration}
                </p>
              )}
            </div>

            {/* Resume Upload */}
              <div>
                <label
                  htmlFor="resumeFile"
                  className="block mb-3 text-lg font-semibold text-gray-800"
                >
                  Upload Resume <span className="text-red-500">*</span>
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
                  errors.resumeFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}>
                  <input
                    id="resumeFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500">PDF, DOC, or DOCX files (Max 10MB)</p>
                  </div>
                </div>
                {errors.resumeFile && (
                  <p className="mt-2 text-sm text-red-600">{errors.resumeFile}</p>
                )}
              </div>

            {/* Submit Button */}
            <div className="text-center mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-green-600 ${
                  loading ? 'bg-green-800 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Starting Interview...' : 'Start Mock Interview'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Custom_Interview;
