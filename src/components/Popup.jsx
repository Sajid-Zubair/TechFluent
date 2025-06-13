
import React from 'react';
import { MdClose } from 'react-icons/md';

function Popup({ setShowPopup, onclose, handleDoneClick }) {
  const [selectedInterviewType, setSelectedInterviewType] = React.useState('');

  const handleSelectChange = (event) => {
    setSelectedInterviewType(event.target.value);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-white-300 bg-opacity-40 backdrop-blur-sm flex justify-center items-center"
      onClick={onclose} // clicking on backdrop will close
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()} // stops closing when interacting with content
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          onClick={onclose}
        >
          <MdClose size={24} />
        </button>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Select a Subject
        </h1>

        {/* Dropdown */}
        <div className="mb-6">
          <select
                value={selectedInterviewType}
                onChange={handleSelectChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                >
                <option value="">Choose Subject</option>

                <optgroup label="Core CSE Subjects">
                    <option value="Data Structures and Algorithms">Data Structures and Algorithms</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Database Management Systems">Database Management Systems (DBMS)</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Object Oriented Programming">Object Oriented Programming (OOP)</option>
                    <option value="Computer Organization and Architecture">Computer Organization and Architecture (COA)</option>
                    <option value="Compiler Design">Compiler Design</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Theory of Computation">Theory of Computation (TOC)</option>
                    <option value="Design and Analysis of Algorithms">Design and Analysis of Algorithms (DAA)</option>
                    <option value="Programming in C/C++/Java">Programming in C/C++/Java</option>
                </optgroup>

                <optgroup label="Core AI/ML Subjects">
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Deep Learning">Deep Learning</option>
                    <option value="Natural Language Processing">Natural Language Processing (NLP)</option>
                    <option value="Reinforcement Learning">Reinforcement Learning</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Knowledge Representation and Reasoning">Knowledge Representation and Reasoning</option>
                    <option value="Ethics in AI">Ethics in AI</option>
                    <option value="Human-Centered AI">Human-Centered AI</option>
                </optgroup>

                <optgroup label="Core Data Science Subjects">
                    <option value="Probability and Statistics">Probability and Statistics</option>
                    <option value="Data Visualization">Data Visualization</option>
                    <option value="Big Data Analytics">Big Data Analytics</option>
                    <option value="Data Mining">Data Mining</option>
                    <option value="Statistical Inference">Statistical Inference</option>
                    <option value="Data Wrangling and Preprocessing">Data Wrangling and Preprocessing</option>
                    <option value="Time Series Analysis">Time Series Analysis</option>
                    <option value="Applied Linear Algebra">Applied Linear Algebra</option>
                    <option value="Data Ethics and Privacy">Data Ethics and Privacy</option>
                    <option value="Cloud Computing for Data Science">Cloud Computing for Data Science</option>
                </optgroup>
            </select>
        </div>

        {/* Done Button */}
        <button
          onClick={() => {
            if (selectedInterviewType) {
              handleDoneClick(selectedInterviewType);
            }
          }}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default Popup;

