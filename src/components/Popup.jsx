import React from 'react'
import { MdClose } from 'react-icons/md';

function Popup({setShowPopup, onclose, handleDoneClick}) {
    const [selectedInterviewType, setSelectedInterviewType] = React.useState('');

    const handleSelectChange = (event) => {
    setSelectedInterviewType(event.target.value);
  };
  return (
    <div className='fixed inset-0 z-50 bg-white-300 bg-opacity-30 backdrop-blur-sm flex flex-col justify-center items-center gap-6'>
        <div>
            <div className='flex justify-end w-full mb-3'>
                <button className='cursor-pointer' onClick={onclose}>
                <MdClose size={24} />
                </button>
            </div>
            <div className='bg-blue-200 p-10 rounded-lg flex flex-col justify-center items-center gap-6 max-w-md'>
                <h1 className='text-3xl font-bold text-black'>Select a Subject</h1>
                <div className='dropdown-menu mb-1 w-fit md:w-1/3 flex flex-col justify-center items-center'>
                                <select
                                    value={selectedInterviewType}
                                    onChange={handleSelectChange}
                                 className='w-45 p-2 rounded-lg border border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-800'>
                                    <option value="">Choose Subject</option>
                                    <option value="dsa">Data Structures</option>
                                    <option value="os">Operating Systems</option>
                                    <option value="dbms">DBMS</option>
                                    <option value="networking">Computer Networks</option>
                                </select>
                </div>
                <div>
                    <button
                        onClick={() => {
                            if (selectedInterviewType) {
                            handleDoneClick(selectedInterviewType);
                            }
                        }}
                        className='start-btn py-3 px-8 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 cursor-pointer'
                        >
                        Done
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Popup
