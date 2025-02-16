import React from "react";
import { FaUser } from "react-icons/fa";

const ProfileDetails = ({ userData, onEdit, handleLogout, calculateBMI, getBMICategory }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Profile Card */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg text-white text-center transform transition-all hover:scale-105">
        {/* Header */}
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center">
          <FaUser className="mr-3 text-4xl text-blue-400" /> Profile Management
        </h2>

        {/* User Details */}
        <div className="text-lg text-gray-300 leading-relaxed space-y-3">
          <p><span className="font-semibold text-blue-400">Name:</span> {userData.name}</p>
          <p><span className="font-semibold text-blue-400">Age:</span> {userData.age}</p>
          <p><span className="font-semibold text-blue-400">Weight:</span> {userData.weightKg} kg</p>
          <p><span className="font-semibold text-blue-400">Height:</span> {userData.heightCm} cm</p>
          <p><span className="font-semibold text-blue-400">Gender:</span> {userData.gender}</p>

          {/* BMI Display */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-xl font-semibold">
              <span className="text-green-400">BMI:</span> {calculateBMI()} 
              <span className="text-gray-400"> ({getBMICategory()})</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button 
            onClick={onEdit} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-5 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Edit Profile
          </button>
          <button 
            onClick={handleLogout} 
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-5 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;