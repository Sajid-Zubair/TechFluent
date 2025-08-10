import React, { useState, useEffect } from "react";
import Sidenav from "./Sidenav";
import { FaBars } from "react-icons/fa";
import axios from "axios";

function Custom_Interview() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // disable scroll when nav open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "auto";
  }, [mobileNavOpen]);

  const validate = () => {
    const newErrors = {};
    if (!jobRole.trim()) newErrors.jobRole = "Job role is required.";
    if (!experience.trim()) newErrors.experience = "Experience is required.";
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!jobType.trim()) newErrors.jobType = "Job type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/jobs/", {
        params: { job_role: jobRole, location, limit: 10 },
      });
      setJobs(res.data.jobs || []);
    } catch (error) {
      if (error.response && error.response.data) {
        alert("Error from server: " + error.response.data.error);
        if (error.response.data.traceback) {
          console.error("Backend traceback:", error.response.data.traceback);
        }
      } else {
        alert("Error fetching jobs: " + (error.message || "Unknown error"));
        console.error(error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidenav */}
      <div className="hidden md:block">
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
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40 p-4 overflow-y-auto">
          <Sidenav />
          <button
            onClick={() => setMobileNavOpen(false)}
            className="absolute top-2 right-2 text-2xl text-red-600"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="text-center mb-8 mt-12 sm:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Find Jobs from Indeed
            </h1>
            <p className="mt-2 text-gray-600 text-md">
              Fill out the details below and find matching jobs instantly.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-200"
          >
            {/* Job Role */}
            <div>
              <label className="block text-lg font-semibold mb-2">
                Job Role <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className={`w-full border-2 rounded-xl p-3 sm:p-4 text-base ${
                  errors.jobRole ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.jobRole && (
                <p className="mt-1 text-sm text-red-600">{errors.jobRole}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-lg font-semibold mb-2">
                Experience <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 2 years"
                className={`w-full border-2 rounded-xl p-3 sm:p-4 text-base ${
                  errors.experience ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-lg font-semibold mb-2">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York"
                className={`w-full border-2 rounded-xl p-3 sm:p-4 text-base ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-lg font-semibold mb-2">
                Job Type <span className="text-red-600">*</span>
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className={`w-full border-2 rounded-xl p-3 sm:p-4 text-base ${
                  errors.jobType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Job Type</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              {errors.jobType && (
                <p className="mt-1 text-sm text-red-600">{errors.jobType}</p>
              )}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-semibold text-white ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Searching..." : "Search Jobs"}
              </button>
            </div>
          </form>

          {/* Job Results */}
          {jobs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Job Results
              </h2>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {jobs.map((job, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Job Title */}
                      <h3 className="text-xl font-semibold text-blue-700 mb-3 break-words">
                        {job.title}
                      </h3>

                      {/* Company Name */}
                      {job.employer?.name && (
                        <p className="text-gray-800 font-medium mb-3 break-words">
                          {job.employer.name}
                        </p>
                      )}

                      {/* Job Location */}
                      <p className="flex items-center text-gray-600 mb-4">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828 2.828l4.243 4.243a8 8 0 1111.314-11.314 8 8 0 01-11.314 11.314z"
                          ></path>
                        </svg>
                        {job.location?.city
                          ? `${job.location.city}, ${job.location.countryName}`
                          : "Location not available"}
                      </p>
                    </div>

                    {/* Apply Link */}
                    {(job.jobUrl || job.url) && (
                      <a
                        href={job.jobUrl || job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full text-center px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition sm:inline-block sm:w-auto"
                      >
                        Apply Now →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {jobs.length === 0 && !loading && (
            <p className="text-center mt-6 text-gray-500">
              No jobs found. Try changing your search criteria.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Custom_Interview;
