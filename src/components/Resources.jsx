import React from 'react'
import Sidenav from './Sidenav'
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';



function Resources() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/get_answer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div>
      <Sidenav />
      <div className='ml-64 flex flex-col items-center w-full'>
        <div className='p-6 flex flex-row justify-between items-center gap-6 w-full max-w-4xl'>
          <div className='flex flex-col justify-between items-center gap-3'>
            <h2 className='text-3xl font-bold'>Get Your Questions Answered in Seconds!</h2>
            <p className='text-gray-600 text-md'>Unlock Your Potential with Knowledge</p>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center w-full'>
          <div className='flex flex-row items-center justify-center gap-2 w-2xl max-w-xl mr-64'>
            <input
              className='p-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 w-full'
              type="text"
              placeholder='What do you want to learn?'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch} className='p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer'>
              Search
            </button>
          </div>

          {loading ? (
            <p className="mr-64 mt-4 text-gray-500">Loading...</p>
          ) : (
            answer && (
              <div className="mr-64 mt-6 p-4 border border-gray-300 rounded-lg shadow-md max-w-xl bg-white">
                <h3 className="text-lg font-semibold mb-2">Answer:</h3>
                {/* <p className="text-gray-800 whitespace-pre-line">{answer}</p> */}
                <div className='text-gray-800 whitespace-pre-line'>
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  )
}

export default Resources
