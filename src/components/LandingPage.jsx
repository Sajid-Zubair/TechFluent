import React from "react";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import image from '../assets/man.png'
function LandingPage() {
  return (
    <div>
      <div className="mt-2 p-2">
        <div
          id="home"
          className="h-screen flex flex-col md:flex-row md:items-center justify-between items-center px-8 md:px-16"
        >
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
              Ace Your Interviews with
              <span className="text-blue-500"> AI-Powered Feedback</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Enhance your technical and HR communication skills with real-time
              AI-driven feedback.
            </p>
            <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer">
              Get Started
            </button>
          </div>

          <div className="mt-8 md:mt-0">
            <img
              src={image}
              alt="Interview Preparation"
              className="w-full max-w-8xl ml-20 mb-10"
            />
          </div>
        </div>


        <div
          className="h-screen flex flex-col justify-center items-center"
          id="about"
        >
          <h1>About</h1>
        </div>
        <div
          className="h-screen flex flex-col justify-center items-center"
          id="resources"
        >
          <h1>Resources</h1>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
