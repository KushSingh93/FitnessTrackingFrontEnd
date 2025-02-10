import React from "react";

const TodaysWorkout = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-md w-full">
      <h2 className="text-white text-lg font-bold mb-3">Today's Workout</h2>
      <p className="text-gray-400">No exercises added yet.</p>

      <button className="w-full py-2 mt-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition">
        Repeat Workout 🔄
      </button>
    </div>
  );
};

export default TodaysWorkout;
