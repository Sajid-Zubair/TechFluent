
import React, { useState } from 'react';
import Sidenav from './Sidenav';
import { FaSearch, FaBars } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

function Resources() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/get_answer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error('Error fetching from Groq API:', err);
      setAnswer('Sorry, something went wrong.');
    } finally {
      setLoading(false);
    }
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
            className="absolute top-2 right-2 text-2xl text-red-600 mt-4 ml-6"
          >
            ❌
          </button>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 transition-opacity duration-300 ${
          mobileNavOpen ? 'opacity-30 pointer-events-none' : ''
        } md:ml-64`} // offset for sidenav on large screens
      >
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="text-center mb-6 mt-12 sm:mt-0">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Get Your Questions Answered in Seconds!
            </h2>
            <p className="text-gray-600 text-sm sm:text-md">
              Unlock Your Potential with Knowledge
            </p>
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <input
              className="p-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 w-full"
              type="text"
              placeholder="What do you want to learn?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
              <button
                onClick={handleSearch}
                className="flex items-center justify-center p-3 w-full sm:w-auto bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer"
              >
                <FaSearch />
              </button>
            </div>

            {loading ? (
              <p className="mt-4 text-gray-500">Loading...</p>
            ) : (
              answer && (
                <div className="mt-6 w-full p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                  <h3 className="text-lg font-semibold mb-2">Answer:</h3>
                  <div className="text-gray-800 whitespace-pre-line">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
