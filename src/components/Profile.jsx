import React from "react";
import Sidenav from "./Sidenav";
import { FaUser, FaMedal } from "react-icons/fa";

function Profile() {
  const username = "Zubair420";
  const initials = username.charAt(0).toUpperCase();
  return (
    <div>
      <Sidenav />

      <div className="ml-64 flex justify-center items-center p-4">
        <div className="flex flex-row justify-center items-center p-4 gap-16">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex justify-center items-center text-gray-600 text-lg">
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

      <div />
    </div>
  );
}

export default Profile;
