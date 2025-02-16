import React, { lazy, Suspense } from "react";

const RepeatWorkoutModal = lazy(() => import("./RepeatWorkoutModal"));

const WorkoutModals = ({
  dialogOpen,
  selectedExercise,
  sets,
  reps,
  onSetsChange,
  onRepsChange,
  onClose,
  onAddToWorkout,
  customDialogOpen,
  customName,
  customBodyPart,
  customCalories,
  onCustomNameChange,
  onCustomBodyPartChange,
  onCustomCaloriesChange,
  onCloseCustomDialog,
  onAddCustomExercise,
  repeatWorkoutExercises,
  isRepeatModalOpen,
  onCopyWorkout,
  onCloseRepeatModal,
}) => {
  return (
    <>
      {/*  Add Exercise Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">
              {selectedExercise?.exerciseName} ({selectedExercise?.bodyPart})
            </h2>
            <label className="block text-white mb-2">Sets:</label>
            <input
              type="number"
              value={sets}
              onChange={onSetsChange}
              className="w-full p-2 mb-2 bg-gray-700 rounded text-white"
            />
            <label className="block text-white mb-2">Reps:</label>
            <input
              type="number"
              value={reps}
              onChange={onRepsChange}
              className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
            />
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onAddToWorkout}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  Add Custom Exercise Modal */}
      {customDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative w-96">
            {/* Close Button */}
            <button
              onClick={onCloseCustomDialog}
              className="absolute top-2 right-2 text-white text-2xl hover:text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center text-white">
              Add Custom Exercise
            </h2>

            {/* Exercise Name Input */}
            <input
              type="text"
              placeholder="Exercise Name"
              value={customName}
              onChange={onCustomNameChange}
              className="w-full p-2 mb-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Body Part Dropdown */}
            <select
              onChange={onCustomBodyPartChange}
              value={customBodyPart}
              className="w-full p-2 mb-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Body Part</option>
              {["ARMS", "BACK", "CHEST", "SHOULDER", "ABS", "LEGS"].map(
                (part) => (
                  <option key={part} value={part}>
                    {part}
                  </option>
                )
              )}
            </select>

            {/* Calories Burned Per Set */}
            <input
              type="number"
              placeholder="Calories per rep"
              value={customCalories}
              onChange={onCustomCaloriesChange}
              className="w-full p-2 mb-4 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Submit Button */}
            <button
              onClick={onAddCustomExercise}
              disabled={!customName || !customBodyPart || !customCalories}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                !customName || !customBodyPart || !customCalories
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              Add Exercise
            </button>
          </div>
        </div>
      )}

      {/*  Lazy-Loaded Repeat Workout Modal (It loads only when the user selects Repeat Workout.) */} 
      {isRepeatModalOpen && (
        <Suspense fallback={<div>Loading Repeat Workout...</div>}>
          <RepeatWorkoutModal
            exercises={repeatWorkoutExercises}
            onClose={onCloseRepeatModal}
            onCopy={onCopyWorkout}
          />
        </Suspense>
      )}
    </>
  );
};

export default WorkoutModals;
