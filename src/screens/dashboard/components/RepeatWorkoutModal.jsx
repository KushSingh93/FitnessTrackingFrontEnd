import React from "react";

const RepeatWorkoutModal = ({ exercises, onClose, onCopy }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">
          Preview Workout
        </h2>

        {exercises.length === 0 ? (
          <p className="text-gray-400 text-center">
            No exercises in this workout.
          </p>
        ) : (
          <ul className="mb-4">
            {exercises.map((exercise, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded mb-2">
                {exercise.exerciseName} - {exercise.sets} sets, {exercise.reps} reps
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onCopy}
            className={`px-4 py-2 rounded ${
              exercises.length === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            disabled={exercises.length === 0}
          >
            Copy Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepeatWorkoutModal;
