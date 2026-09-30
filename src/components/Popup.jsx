
// import React from 'react';
// import { MdClose } from 'react-icons/md';

// function Popup({ setShowPopup, onclose, handleDoneClick }) {
//   const [selectedInterviewType, setSelectedInterviewType] = React.useState('');

//   const handleSelectChange = (event) => {
//     setSelectedInterviewType(event.target.value);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-white-300 bg-opacity-40 backdrop-blur-sm flex justify-center items-center"
//       onClick={onclose} // clicking on backdrop will close
//     >
//       <div
//         className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md"
//         onClick={(e) => e.stopPropagation()} // stops closing when interacting with content
//       >
//         {/* Close Button */}
//         <button
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
//           onClick={onclose}
//         >
//           <MdClose size={24} />
//         </button>

//         {/* Title */}
//         <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
//           Select a Subject
//         </h1>

//         {/* Dropdown */}
//         <div className="mb-6">
//           <select
//                 value={selectedInterviewType}
//                 onChange={handleSelectChange}
//                 className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
//                 >
//                 <option value="">Choose Subject</option>

//                 <optgroup label="Core CSE Subjects">
//                     <option value="Data Structures and Algorithms">Data Structures and Algorithms</option>
//                     <option value="Operating Systems">Operating Systems</option>
//                     <option value="Database Management Systems">Database Management Systems (DBMS)</option>
//                     <option value="Computer Networks">Computer Networks</option>
//                     <option value="Object Oriented Programming">Object Oriented Programming (OOP)</option>
//                     <option value="Computer Organization and Architecture">Computer Organization and Architecture (COA)</option>
//                     <option value="Compiler Design">Compiler Design</option>
//                     <option value="Software Engineering">Software Engineering</option>
//                     <option value="Theory of Computation">Theory of Computation (TOC)</option>
//                     <option value="Design and Analysis of Algorithms">Design and Analysis of Algorithms (DAA)</option>
//                     <option value="Programming in C/C++/Java">Programming in C/C++/Java</option>
//                 </optgroup>

//                 <optgroup label="Core AI/ML Subjects">
//                     <option value="Artificial Intelligence">Artificial Intelligence</option>
//                     <option value="Machine Learning">Machine Learning</option>
//                     <option value="Deep Learning">Deep Learning</option>
//                     <option value="Natural Language Processing">Natural Language Processing (NLP)</option>
//                     <option value="Reinforcement Learning">Reinforcement Learning</option>
//                     <option value="Computer Vision">Computer Vision</option>
//                     <option value="Robotics">Robotics</option>
//                     <option value="Knowledge Representation and Reasoning">Knowledge Representation and Reasoning</option>
//                     <option value="Ethics in AI">Ethics in AI</option>
//                     <option value="Human-Centered AI">Human-Centered AI</option>
//                 </optgroup>

//                 <optgroup label="Core Data Science Subjects">
//                     <option value="Probability and Statistics">Probability and Statistics</option>
//                     <option value="Data Visualization">Data Visualization</option>
//                     <option value="Big Data Analytics">Big Data Analytics</option>
//                     <option value="Data Mining">Data Mining</option>
//                     <option value="Statistical Inference">Statistical Inference</option>
//                     <option value="Data Wrangling and Preprocessing">Data Wrangling and Preprocessing</option>
//                     <option value="Time Series Analysis">Time Series Analysis</option>
//                     <option value="Applied Linear Algebra">Applied Linear Algebra</option>
//                     <option value="Data Ethics and Privacy">Data Ethics and Privacy</option>
//                     <option value="Cloud Computing for Data Science">Cloud Computing for Data Science</option>
//                 </optgroup>

//                 <optgroup label="Core Computer Engineering Subjects">
//                     <option value="Digital Logic Design">Digital Logic Design</option>
//                     <option value="Microprocessors and Microcontrollers">Microprocessors and Microcontrollers</option>
//                     <option value="Embedded Systems">Embedded Systems</option>
//                     <option value="VLSI Design">VLSI Design</option>
//                     <option value="Analog and Digital Communication">Analog and Digital Communication</option>
//                     <option value="Signal Processing">Signal Processing</option>
//                     <option value="Control Systems">Control Systems</option>
//                     <option value="Electronics Circuits and Devices">Electronics Circuits and Devices</option>
//                     <option value="Computer Architecture">Computer Architecture</option>
//                     <option value="Hardware Description Languages (HDL)">Hardware Description Languages (HDL)</option>
//                 </optgroup>
//             </select>
//         </div>

//         {/* Done Button */}
//         <button
//           onClick={() => {
//             if (selectedInterviewType) {
//               handleDoneClick(selectedInterviewType);
//             }
//           }}
//           className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
//         >
//           Done
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Popup;

import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Check, ArrowRight, CornerDownLeft } from 'lucide-react';

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

// Same values & labels as before, grouped for the palette
const GROUPS = [
  {
    label: 'Core CSE Subjects',
    items: [
      ['Data Structures and Algorithms', 'Data Structures and Algorithms'],
      ['Operating Systems', 'Operating Systems'],
      ['Database Management Systems', 'Database Management Systems (DBMS)'],
      ['Computer Networks', 'Computer Networks'],
      ['Object Oriented Programming', 'Object Oriented Programming (OOP)'],
      ['Computer Organization and Architecture', 'Computer Organization and Architecture (COA)'],
      ['Compiler Design', 'Compiler Design'],
      ['Software Engineering', 'Software Engineering'],
      ['Theory of Computation', 'Theory of Computation (TOC)'],
      ['Design and Analysis of Algorithms', 'Design and Analysis of Algorithms (DAA)'],
      ['Programming in C/C++/Java', 'Programming in C/C++/Java'],
    ],
  },
  {
    label: 'Core AI/ML Subjects',
    items: [
      ['Artificial Intelligence', 'Artificial Intelligence'],
      ['Machine Learning', 'Machine Learning'],
      ['Deep Learning', 'Deep Learning'],
      ['Natural Language Processing', 'Natural Language Processing (NLP)'],
      ['Reinforcement Learning', 'Reinforcement Learning'],
      ['Computer Vision', 'Computer Vision'],
      ['Robotics', 'Robotics'],
      ['Knowledge Representation and Reasoning', 'Knowledge Representation and Reasoning'],
      ['Ethics in AI', 'Ethics in AI'],
      ['Human-Centered AI', 'Human-Centered AI'],
    ],
  },
  {
    label: 'Core Data Science Subjects',
    items: [
      ['Probability and Statistics', 'Probability and Statistics'],
      ['Data Visualization', 'Data Visualization'],
      ['Big Data Analytics', 'Big Data Analytics'],
      ['Data Mining', 'Data Mining'],
      ['Statistical Inference', 'Statistical Inference'],
      ['Data Wrangling and Preprocessing', 'Data Wrangling and Preprocessing'],
      ['Time Series Analysis', 'Time Series Analysis'],
      ['Applied Linear Algebra', 'Applied Linear Algebra'],
      ['Data Ethics and Privacy', 'Data Ethics and Privacy'],
      ['Cloud Computing for Data Science', 'Cloud Computing for Data Science'],
    ],
  },
  {
    label: 'Core Computer Engineering Subjects',
    items: [
      ['Digital Logic Design', 'Digital Logic Design'],
      ['Microprocessors and Microcontrollers', 'Microprocessors and Microcontrollers'],
      ['Embedded Systems', 'Embedded Systems'],
      ['VLSI Design', 'VLSI Design'],
      ['Analog and Digital Communication', 'Analog and Digital Communication'],
      ['Signal Processing', 'Signal Processing'],
      ['Control Systems', 'Control Systems'],
      ['Electronics Circuits and Devices', 'Electronics Circuits and Devices'],
      ['Computer Architecture', 'Computer Architecture'],
      ['Hardware Description Languages (HDL)', 'Hardware Description Languages (HDL)'],
    ],
  },
];

// Quick picks (the five core subjects)
const QUICK = [
  ['Data Structures and Algorithms', 'DSA'],
  ['Operating Systems', 'OS'],
  ['Database Management Systems', 'DBMS'],
  ['Computer Networks', 'CN'],
  ['Object Oriented Programming', 'OOP'],
];

function Popup({ setShowPopup, onclose, handleDoneClick }) {
  const [selectedInterviewType, setSelectedInterviewType] = React.useState('');

  const handleSelectChange = (event) => {
    setSelectedInterviewType(event.target.value);
  };

  // UI-only state
  const [query, setQuery] = React.useState('');
  const inputRef = useRef(null);
  const itemRefs = useRef({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter(([v, l]) => !q || l.toLowerCase().includes(q) || v.toLowerCase().includes(q)),
    })).filter((g) => g.items.length);
  }, [query]);

  const flat = useMemo(() => filtered.flatMap((g) => g.items.map(([v]) => v)), [filtered]);
  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);

  const select = (value) => handleSelectChange({ target: { value } });

  const confirm = () => {
    if (selectedInterviewType) {
      handleDoneClick(selectedInterviewType);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onclose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onclose]);

  useEffect(() => {
    itemRefs.current[selectedInterviewType]?.scrollIntoView({ block: 'nearest' });
  }, [selectedInterviewType]);

  const onInputKey = (e) => {
    if (!flat.length) return;
    const i = flat.indexOf(selectedInterviewType);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      select(flat[i < 0 ? 0 : Math.min(i + 1, flat.length - 1)]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      select(flat[i <= 0 ? 0 : i - 1]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!selectedInterviewType && flat.length === 1) select(flat[0]);
      else confirm();
    }
  };

  const highlight = (text) => {
    const q = query.trim();
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-emerald-300">{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 px-4 pt-[10vh] backdrop-blur-sm"
      onClick={onclose} // clicking on backdrop will close
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[78vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] text-neutral-200 shadow-2xl shadow-black/70"
        onClick={(e) => e.stopPropagation()} // stops closing when interacting with content
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

        {/* header */}
        <div className="flex items-start justify-between px-5 pb-3 pt-5">
          <div>
            <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
              <span className="text-emerald-400">--subject</span> · technical
            </p>
            <h1 id="popup-title" className={`${SERIF} mt-2 text-3xl leading-none text-neutral-50`}>
              Select a <em className="text-neutral-500">subject</em>
            </h1>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-neutral-500 transition-colors hover:border-white/25 hover:text-white"
            onClick={onclose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* search */}
        <div className="mx-5 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-3 transition-colors focus-within:border-emerald-400/50 focus-within:ring-1 focus-within:ring-emerald-400/20">
          <Search size={15} className="shrink-0 text-neutral-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search subjects…"
            className="w-full bg-transparent py-2.5 text-[15px] text-neutral-100 placeholder:text-neutral-600 outline-none"
            aria-label="Search subjects"
          />
          <span className={`${MONO} shrink-0 text-[10px] text-neutral-600`}>
            {flat.length}/{total}
          </span>
        </div>

        {/* quick picks */}
        {!query && (
          <div className="flex flex-wrap items-center gap-2 px-5 pt-4">
            <span className={`${MONO} mr-1 text-[10px] uppercase tracking-[0.18em] text-neutral-600`}>quick</span>
            {QUICK.map(([value, short]) => (
              <button
                key={value}
                onClick={() => select(value)}
                className={`${MONO} rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                  selectedInterviewType === value
                    ? 'border-emerald-400/50 bg-emerald-400/[0.08] text-emerald-300'
                    : 'border-white/10 text-neutral-400 hover:border-white/25 hover:text-neutral-100'
                }`}
              >
                {short}
              </button>
            ))}
          </div>
        )}

        {/* list */}
        <div className="mt-4 flex-1 overflow-y-auto border-t border-white/[0.08] px-2 py-2" role="listbox" aria-label="Subjects">
          {filtered.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className={`${SERIF} text-2xl text-neutral-400`}>
                No match for <em className="text-neutral-200">“{query}”</em>
              </p>
              <p className={`${MONO} mt-2 text-[11px] text-neutral-600`}>try a shorter keyword</p>
            </div>
          ) : (
            filtered.map((group) => (
              <div key={group.label} className="mb-2">
                <p className={`${MONO} sticky top-0 z-10 bg-[#0d0d0d] px-3 pb-1.5 pt-2 text-[10px] uppercase tracking-[0.18em] text-neutral-600`}>
                  {group.label}
                </p>
                {group.items.map(([value, label]) => {
                  const active = selectedInterviewType === value;
                  return (
                    <button
                      key={value}
                      ref={(el) => (itemRefs.current[value] = el)}
                      role="option"
                      aria-selected={active}
                      onClick={() => select(value)}
                      onDoubleClick={() => handleDoneClick(value)}
                      className={`group relative flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        active ? 'bg-white/[0.06] text-white' : 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-100'
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-emerald-400 transition-opacity ${
                          active ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <span className="truncate">{highlight(label)}</span>
                      {active ? (
                        <Check size={14} className="shrink-0 text-emerald-400" />
                      ) : (
                        <ArrowRight size={13} className="shrink-0 text-neutral-700 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] bg-[#0a0a0a] px-5 py-3">
          <div className={`${MONO} hidden items-center gap-3 text-[10px] text-neutral-600 sm:flex`}>
            <span><kbd className="rounded border border-white/10 px-1 text-neutral-400">↑↓</kbd> navigate</span>
            <span><kbd className="rounded border border-white/10 px-1 text-neutral-400">↵</kbd> confirm</span>
            <span><kbd className="rounded border border-white/10 px-1 text-neutral-400">esc</kbd> close</span>
          </div>

          <button
            onClick={confirm}
            disabled={!selectedInterviewType}
            className="group ml-auto inline-flex min-w-0 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-neutral-600"
          >
            <span className="truncate">
              {selectedInterviewType ? `Done · ${selectedInterviewType}` : 'Select a subject'}
            </span>
            <CornerDownLeft size={13} className="shrink-0 opacity-60" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Popup;