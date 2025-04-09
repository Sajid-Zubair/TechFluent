import React from "react";
import Sidenav from "./Sidenav";
import { FaUser, FaMedal, FaFire, FaStar, FaMicrophone } from "react-icons/fa";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

function Profile() {
  const username = "Zubair420";
  const initials = username.charAt(0).toUpperCase();
  return (
    <div>
      <Sidenav />

      <div className="ml-64 flex justify-center items-center p-4">
        <div className="flex flex-row justify-center items-center p-4 gap-16">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex justify-center items-center text-gray-600 text-4xl">
              {initials}
            </div>
            <p className="text-xl text-gray-600 mt-2">{username}</p>
          </div>
          <div className="ml-4 flex flex-col mb-4">
            <h1 className="text-2xl font-bold">
              Gokaraju Rangaraju Institute of Engineering and Technology
            </h1>
            <div className="flex flex-row gap-4 mt-4 items-center">
              <FaMedal size={28} className="text-yellow-500" />
              <h3 className="text-2xl font-bold">Rank : 56</h3>
            </div>
          </div>

          <div className="flex flex-row items-center">
            <button className="px-6 py-3 bg-blue-500 text-white text-sm whitespace-nowrap rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-300 ml-64" />
      <div className="ml-64 flex flex-row justify-between items-center p-4">
        <div className=" p-4 rounded-lg flex flex-row items-center">
          <div className="text-lg font-bold">Max Streak : 7</div>
          <FaFire size={24} className="ml-4 text-orange-500" />
        </div>
        <div className=" p-4 rounded-lg flex flex-row items-center">
          <div className="text-lg font-bold">Rating : 8.89</div>
          <FaStar size={24} style={{ color: "FFD700" }} className="ml-4" />
        </div>
        <div className=" p-4 rounded-lg flex flex-row items-center">
          <div className="text-lg font-bold">
            Total Interviews Completed : 7
          </div>
          <FaMicrophone
            style={{ color: "3498DB" }}
            size={24}
            className="ml-4"
          />
        </div>
      </div>
      <hr className="border-t border-gray-300 ml-64" />


      <div />
    </div>
  );
}

export default Profile;
