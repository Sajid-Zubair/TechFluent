// import React from "react";
// import Navbar from "./Navbar";
// import { useState, useEffect } from "react";
// import image from "../assets/man.png";
// import interview from "../assets/discussion.png";
// import { FaUserPlus, FaListAlt, FaKeyboard, FaRobot, FaChartBar } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const steps = [
//   {
//     title: "Create an Account",
//     icon: <FaUserPlus size={24} />,
//     description: "Sign up and select your college to join your personalized leaderboard.",
//   },
//   {
//     title: "Choose a Section",
//     icon: <FaListAlt size={24} />,
//     description: "Pick between Technical or HR interview sections based on your goals.",
//   },
//   {
//     title: "Select core subjects",
//     icon: <FaListAlt size={24} />,
//     description: "Based on your year of joining, you'll see relevant core subjects. Select the ones you want to practice.",
//   },
//   {
//     title: "Answer Questions",
//     icon: <FaKeyboard size={24} />,
//     description: "Use voice to respond to questions. No pressure, just practice.",
//   },
//   {
//     title: "Get AI Feedback",
//     icon: <FaRobot size={24} />,
//     description: "Instantly receive a refined answer and personalized improvement tips.",
//   },
//   {
//     title: "Track & Compete",
//     icon: <FaChartBar size={24} />,
//     description: "Get ratings and see where you stand on your college leaderboard.",
//   },
// ];
// function LandingPage() {
//   const navigate = useNavigate()

//   return (
//     <div>
//       <div className="mt-2 p-2 overflow-x-hidden">
//         <div
//           id="home"
//           className="flex flex-col md:flex-row md:items-center justify-between items-center px-8 md:px-16"
//         >
//           <div className="mt-6 text-center md:text-left max-w-xl">
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
//               Ace Your Interviews with
//               <span className="text-blue-500"> AI-Powered Feedback</span>
//             </h1>
//             <p className="mt-4 text-lg text-gray-600">
//               Enhance your technical and HR communication skills with real-time
//               AI-driven feedback.
//             </p>
//             <button onClick={() => navigate('/signup')} className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer">
//               Get Started
//             </button>
//           </div>

//           <div className="mt-10 md:mt-0 flex justify-center w-full md:w-1/2">
//             <img
//               src={image}
//               alt="Interview Preparation"
//               className="w-4/5 md:w-full max-w-xl"
//             />
//           </div>
//         </div>

//         <hr className="my-8 border-gray-300 w-full" />

//         <div
//           id="aboutSection"
//           className="min-h-screen flex flex-col md:flex-row-reverse md:items-center justify-between items-center px-8 md:px-16 mt-4 md:mt-2"
//         >
//           <div className="text-center md:text-left max-w-xl">
//             <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
//               Struggling to express your thoughts during
//               <span className="text-blue-500"> Interviews ?</span>
//             </h1>
//             <p className="mt-5 text-lg text-gray-600">
//               This platform is designed to help you practice and improve your
//               communication skills for both technical and HR interviews. Whether
//               you're preparing for campus placements or internships, our
//               AI-driven system helps you turn good answers into great ones.
//             </p>
//           </div>

//           <div className="mt-10 md:mt-0 mr-3 w-full md:w-auto flex justify-center">
//             <img
//               src={interview}
//               alt="Interview Preparation"
//               className="w-4/5 md:w-[400px] lg:w-[400px] max-w-full md:h-auto"
//             />
//           </div>
//         </div>

//         <hr className="my-8 border-gray-300 w-full" />

//         <div
//           className="min-h-screen flex flex-col justify-center items-center"
//           id="resources"
//         >
//           <section className=" py-20 px-6 md:px-18" id="how-it-works">
//             <h2 id="resourcesSection" className="text-5xl font-bold text-center text-gray-800 mb-16">
//               How It Works
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//               {steps.map((step, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
//                 >
//                   <div className="w-14 h-14 mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
//                     {step.icon}
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                     {step.title}
//                   </h3>
//                   <p className="text-gray-600">{step.description}</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LandingPage;


// LandingPage.tsx
import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import image from "../assets/man.png";
import interview from "../assets/discussion.png";
import {
  FaUserPlus,
  FaListAlt,
  FaKeyboard,
  FaRobot,
  FaChartBar,
} from "react-icons/fa";

const steps = [
  {
    title: "Create an Account",
    icon: <FaUserPlus size={24} />,
    description: "Sign up and select your college to join your personalized leaderboard.",
  },
  {
    title: "Choose a Section",
    icon: <FaListAlt size={24} />,
    description: "Pick between Technical or HR interview sections based on your goals.",
  },
  {
    title: "Select Core Subjects",
    icon: <FaListAlt size={24} />,
    description: "Based on your year of joining, you'll see relevant core subjects. Select the ones you want to practice.",
  },
  {
    title: "Answer Questions",
    icon: <FaKeyboard size={24} />,
    description: "Use voice to respond to questions. No pressure, just practice.",
  },
  {
    title: "Get AI Feedback",
    icon: <FaRobot size={24} />,
    description: "Instantly receive a refined answer and personalized improvement tips.",
  },
  {
    title: "Track & Compete",
    icon: <FaChartBar size={24} />,
    description: "Get ratings and see where you stand on your college leaderboard.",
  },
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="mt-2 p-2 overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        id="home"
        className="flex flex-col md:flex-row md:items-center justify-between items-center px-8 md:px-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mt-6 text-center md:text-left max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Ace Your Interviews with
            <span className="text-blue-500"> AI-Powered Feedback</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Enhance your technical and HR communication skills with real-time AI-driven feedback.
          </p>
          <motion.button
            onClick={() => navigate("/signup")}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-10 md:mt-0 flex justify-center w-full md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img
            src={image}
            alt="Interview Preparation"
            className="w-4/5 md:w-full max-w-xl"
          />
        </motion.div>
      </motion.div>

      <hr className="my-8 border-gray-300 w-full" />

      {/* About Section */}
      <motion.div
        id="aboutSection"
        className="min-h-screen flex flex-col md:flex-row-reverse md:items-center justify-between items-center px-8 md:px-16 mt-4 md:mt-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center md:text-left max-w-xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
            Struggling to express your thoughts during
            <span className="text-blue-500"> Interviews?</span>
          </h1>
          <p className="mt-5 text-lg text-gray-600">
            This platform is designed to help you practice and improve your communication skills
            for both technical and HR interviews. Whether you're preparing for campus placements or internships,
            our AI-driven system helps you turn good answers into great ones.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 md:mt-0 mr-3 w-full md:w-auto flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <img
            src={interview}
            alt="Interview Preparation"
            className="w-4/5 md:w-[400px] lg:w-[400px] max-w-full md:h-auto"
          />
        </motion.div>
      </motion.div>

      <hr className="my-8 border-gray-300 w-full" />

      {/* How It Works Section */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center py-20 px-6 md:px-18"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 id="resourcesSection" className="text-5xl font-bold text-center text-gray-800 mb-16">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

export default LandingPage;
