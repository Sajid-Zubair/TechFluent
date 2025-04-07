import React from "react";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import image from "../assets/man.png";
import interview from "../assets/9195075.png";
import { FaUserPlus, FaListAlt, FaKeyboard, FaRobot, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()

  return (
    <div>
      <div className="mt-2 p-2 overflow-x-hidden">
        <div
          id="home"
          className="flex flex-col md:flex-row md:items-center justify-between items-center px-8 md:px-16"
        >
          <div className="mt-2 md:mt-4 text-center md:text-left max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
              Ace Your Interviews with
              <span className="text-blue-500"> AI-Powered Feedback</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Enhance your technical and HR communication skills with real-time
              AI-driven feedback.
            </p>
            <button onClick={() => navigate('/signup')} className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer">
              Get Started
            </button>
          </div>

          <div className="mt-10 md:mt-0 flex justify-center w-full md:w-1/2">
            <img
              src={image}
              alt="Interview Preparation"
              className="w-4/5 md:w-full max-w-xl"
            />
          </div>
        </div>

        <hr className="my-8 border-gray-300 w-full" />

        <div
          id="home"
          className="min-h-screen flex flex-col md:flex-row-reverse md:items-center justify-between items-center px-8 md:px-16 mt-4 md:mt-2"
        >
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
              Struggling to express your thoughts during
              <span className="text-blue-500"> Interviews ?</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600">
              This platform is designed to help you practice and improve your
              communication skills for both technical and HR interviews. Whether
              you're preparing for campus placements or internships, our
              AI-driven system helps you turn good answers into great ones.
            </p>
          </div>

          <div className="mt-10 md:mt-0 w-full md:w-auto flex justify-center">
            <img
              src={interview}
              alt="Interview Preparation"
              className="w-4/5 md:w-full max-w-md"
            />
          </div>
        </div>

        <hr className="my-8 border-gray-300 w-full" />

        <div
          className="min-h-screen flex flex-col justify-center items-center"
          id="resources"
        >
          <section className=" py-20 px-6 md:px-24" id="how-it-works">
            <h2 className="text-5xl font-bold text-center text-gray-800 mb-16">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
                >
                  <div className="w-14 h-14 mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
