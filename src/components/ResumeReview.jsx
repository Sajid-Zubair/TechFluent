import React, { useState } from 'react';
import Sidenav from './Sidenav';
import { FaBars, FaUpload, FaRegFileAlt, FaRegLightbulb, FaTools } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://techfluent.onrender.com";  // deployed backend


function ResumeReview() {
  const [file, setFile] = useState(null);
  const [answer, setAnswer] = useState(null); // Can be string or object
  const [loading, setLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please upload your resume first.');
      return;
    }
    setLoading(true);
    setAnswer(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${BASE_URL}/api/resume_analyzer/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("Data from backend:", data);

      // Store as-is; could be JSON object or markdown string
      setAnswer(data.analysis || data || 'No feedback received.');
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setAnswer('Sorry, something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const isStructured = answer && typeof answer === "object" && !Array.isArray(answer);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidenav for Desktop */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidenav />
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="text-3xl text-blue-700"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40 p-4">
          <Sidenav />
          <button
            onClick={() => setMobileNavOpen(false)}
            className="absolute mt-2 right-2 text-2xl text-red-600"
          >
            ❌
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-start">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            Resume Review & Feedback
          </h1>

          {/* Upload Section */}
          <div className="bg-white p-6 rounded-xl shadow-md w-full flex flex-col items-center space-y-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
            />
            <button
              onClick={handleFileUpload}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <FaUpload className="mr-2" /> Analyze Resume
            </button>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="mt-6 text-blue-600 font-semibold animate-pulse">
              Analyzing your resume...
            </div>
          )}

          {/* Output Section */}
          {!loading && answer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-l-4 border-indigo-500 shadow-md rounded-xl p-6 w-full max-w-3xl"
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
                <FaRegFileAlt className="text-indigo-500" /> Resume Analysis
              </h2>

              {isStructured ? (
                <div className="space-y-5 text-gray-800">
                  {answer.overall_impression && (
                    <Section
                      icon={<FaRegLightbulb className="text-green-500" />}
                      title="Overall Impression"
                      color="text-green-700"
                      content={answer.overall_impression}
                      delay={0.1}
                    />
                  )}

                  {answer.content_skills && (
                    <Section
                      icon={<FaRegFileAlt className="text-blue-500" />}
                      title="Content & Skills"
                      color="text-blue-700"
                      content={answer.content_skills}
                      delay={0.2}
                    />
                  )}

                  {answer.clarity_impact && (
                    <Section
                      icon={<FaTools className="text-purple-500" />}
                      title="Clarity & Impact"
                      color="text-purple-700"
                      content={answer.clarity_impact}
                      delay={0.3}
                    />
                  )}

                  {answer.formatting_readability && (
                    <Section
                      icon={<FaRegFileAlt className="text-pink-500" />}
                      title="Formatting & Readability"
                      color="text-pink-700"
                      content={answer.formatting_readability}
                      delay={0.4}
                    />
                  )}

                  {answer.ats_compatibility && (
                    <Section
                      icon={<FaRegFileAlt className="text-orange-500" />}
                      title="ATS Compatibility"
                      color="text-orange-700"
                      content={answer.ats_compatibility}
                      delay={0.5}
                    />
                  )}

                  {answer.final_score && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-red-700">
                        <FaRegFileAlt className="text-red-500" /> Final Score
                      </h3>
                      <p className="text-xl font-bold">{answer.final_score}</p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-gray-800">
                  <ReactMarkdown>{String(answer)}</ReactMarkdown>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function Section({ icon, title, color, content, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <h3 className={`text-lg font-semibold flex items-center gap-2 ${color}`}>
        {icon} {title}
      </h3>
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </motion.div>
  );
}

export default ResumeReview;
