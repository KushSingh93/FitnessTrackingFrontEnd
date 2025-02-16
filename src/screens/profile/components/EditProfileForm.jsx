import React from "react";

const EditProfileForm = ({ formData, handleChange, calculateBMI, getBMICategory, handleSave }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Edit Profile</h2>

      {/* Input Fields with Labels */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your age"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weightKg"
            value={formData.weightKg}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your weight"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Height (cm)</label>
          <input
            type="number"
            name="heightCm"
            value={formData.heightCm}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your height"
          />
        </div>
      </div>

      {/* BMI Display */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg text-center">
        <p className="text-lg font-semibold">
          <span className="text-green-400">Your BMI:</span> {calculateBMI()}{" "}
          <span className="text-gray-400">({getBMICategory()})</span>
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3 mt-6 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105 active:scale-95"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditProfileForm;