import React from "react";
import { FaUser } from "react-icons/fa";

const ProfileDetails = ({ userData, onEdit, handleLogout, calculateBMI, getBMICategory }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {/* Profile Card */}
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-lg text-white text-center">
        {/* Header */}
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center">
          <FaUser className="mr-3 text-4xl" /> Profile Management
        </h2>

        {/* User Details */}
        <div className="text-lg text-gray-300 leading-relaxed space-y-2">
          <p><span className="font-semibold text-white">Name:</span> {userData.name}</p>
          <p><span className="font-semibold text-white">Age:</span> {userData.age}</p>
          <p><span className="font-semibold text-white">Weight:</span> {userData.weightKg} kg</p>
          <p><span className="font-semibold text-white">Height:</span> {userData.heightCm} cm</p>
          <p><span className="font-semibold text-white">Gender:</span> {userData.gender}</p>

          {/* BMI Display */}
          <p className="mt-4 text-xl font-semibold">
            <span className="text-green-400">BMI:</span> {calculateBMI()} 
            <span className="text-gray-400"> ({getBMICategory()})</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button onClick={onEdit} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-5 rounded-lg text-lg">
            Edit Profile
          </button>
          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-5 rounded-lg text-lg">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
