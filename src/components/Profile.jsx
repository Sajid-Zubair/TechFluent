import React from "react";
import Sidenav from "./Sidenav";
import { FaUser, FaMedal, FaFire, FaStar, FaMicrophone } from "react-icons/fa";
import RadarP from './RadarP'


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


      <RadarP/>

      <hr className="border-t border-gray-300 ml-64" />
      


      <div className="ml-64 p-4">
        <div className="p-4 flex flex-col justify-center items-center gap-8">
          <h1 className="text-3xl font-bold mb-8">Interview Feedback</h1>
          <div className="p-4 bg-blue-200 rounded-lg">
            <h2 className="text-2xl font-bold text-black-500 mb-6">Positives</h2>
            <p className="text-lg">Your speech was well-paced and easy to follow, showcasing good fluency throughout. The transitions between ideas felt natural, and you maintained a steady tone, which helped keep the listener engaged. The structure of your response showed clear organization, with a logical flow from introduction to conclusion. Your use of vocabulary was generally strong, with some effective word choices that conveyed your message precisely. Additionally, your response showed a solid understanding of the topic, indicating a good level of accuracy in the content you shared.
            </p>
          </div>
          <div className="p-4 bg-blue-200 rounded-lg">
            <h2 className="text-2xl font-bold text-black-500 mb-6">Areas for Improvement</h2>
            <p className="text-lg">While your fluency was good overall, there were a few instances where filler words such as "uh" or "like" were slightly overused, which could be minimized with more practice. In terms of structure, adding brief summaries or bullet-like cues within your response could make your arguments more impactful. Regarding vocabulary, though most word choices were appropriate, incorporating more domain-specific or expressive terms could elevate your answer. Finally, while your content was mostly accurate, there were a couple of points that lacked clarity or depth, so ensuring each statement is backed by reasoning or examples can further enhance your response.             
            </p>
          </div>
        </div>
      </div>

      <div />
    </div>
  );
}

export default Profile;
