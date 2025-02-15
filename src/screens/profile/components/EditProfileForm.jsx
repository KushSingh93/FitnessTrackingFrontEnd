import React from "react";

const EditProfileForm = ({ formData, handleChange, calculateBMI, getBMICategory, handleSave }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
      <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white mb-3" placeholder="Name" />
      <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white mb-3" placeholder="Age" />
      <input type="number" name="weightKg" value={formData.weightKg} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white mb-3" placeholder="Weight (kg)" />
      <input type="number" name="heightCm" value={formData.heightCm} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white mb-3" placeholder="Height (cm)" />

      <p className="mt-3 text-center text-lg">
        <strong>Your BMI:</strong> {calculateBMI()} ({getBMICategory()})
      </p>

      <button onClick={handleSave} className="w-full py-2 mt-4 bg-green-500 hover:bg-green-600 rounded">
        Save Changes
      </button>
    </div>
  );
};

export default EditProfileForm;
