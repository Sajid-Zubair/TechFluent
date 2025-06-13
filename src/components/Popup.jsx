
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Choose Subject</option>
            <option value="DSA">Data Structures</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="Database and Management">DBMS</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Object Oriented Programming">Object Oriented Programming</option>
            <option value="Computer Organisation and Architecture">Computer Organisation and Architecture</option>
            <option value="Compiler Design">Compiler Design</option>
            <option value="Web Technologies">Web Technologies</option>
            <option value="Cloud Computing">Cloud Computing</option>
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

