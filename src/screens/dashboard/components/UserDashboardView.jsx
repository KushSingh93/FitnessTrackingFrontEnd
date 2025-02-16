import React from "react";
import { FaUserCircle, FaChartBar } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExerciseList from "./ExerciseList";
import TodaysWorkout from "./TodaysWorkout";
import WorkoutModals from "./WorkoutModals";
import RepeatWorkoutModal from "./RepeatWorkoutModal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const UserDashboardView = ({
  arsenalExercises,
  todaysWorkout,
  favoriteExercises,
  searchQuery,
  dialogOpen,
  customDialogOpen,
  showDatePicker,
  isRepeatModalOpen,
  selectedExercise,
  selectedDate,
  repeatWorkoutExercises,
  sets,
  reps,
  streak,
  customName,
  customBodyPart,
  customCalories,
  bodyPartIcons,
  onSearchChange,
  onAddExercise,
  onAddCustomExercise,
  onToggleFavorite,
  onRemoveExercise,
  onRepeatWorkout,
  onDateSelect,
  onSetsChange,
  onRepsChange,
  onClose,
  onAddToWorkout,
  onCustomNameChange,
  onCustomBodyPartChange,
  onCustomCaloriesChange,
  onCloseCustomDialog,
  onAddCustomExerciseSubmit, // Changed from onAddCustomExercise
  onCopyWorkout,
  onCloseRepeatModal,
  handleDateChange,
  handleCloseCustomDialog,
  bodyParts,
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center relative">
      {/* Logo */}
      <div className="w-full text-center mb-8 mt-4">
        <img
          src="/src/assets/images/ironLogLogo.png"
          alt="Iron Log Logo"
          className="h-20 mx-auto"
        />
      </div>

      {/* Streak Display */}
      <div className="absolute top-4 left-4 flex justify-center items-center">
        <Tippy content={`Streak`}>
          <div className="relative">
            <img
              src="/src/assets/images/fireFinal.png"
              alt="Streak"
              className="w-12.3 h-12.3 drop-shadow-lg"
            />
            <span className="absolute top-[69%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl">
              {streak}
            </span>
          </div>
        </Tippy>
      </div>
      {/* Analysis Button */}
      <Tippy content="Analysis" placement="bottom">
        <button
          className="absolute top-4 right-4 bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-700 transition"
          onClick={() => (window.location.href = "/analysis")}
        >
          <FaChartBar className="text-white text-2xl" />
        </button>
      </Tippy>

      <div className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExerciseList
          exercises={arsenalExercises}
          favoriteExercises={favoriteExercises}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onAddExercise={onAddExercise}
          onAddCustomExercise={onAddCustomExercise}
          onToggleFavorite={onToggleFavorite}
          bodyPartIcons={bodyPartIcons}
        />

        <TodaysWorkout
          exercises={todaysWorkout}
          onRemoveExercise={onRemoveExercise}
          onRepeatWorkout={onRepeatWorkout}
          onDateSelect={onDateSelect}
        />
      </div>

      {/* Calendar Popup for Selecting a Workout Date */}
      {showDatePicker && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Select Date</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedDate}
                onChange={(newDate) => handleDateChange(newDate)}
                className="bg-white rounded p-2 w-full"
              />
            </LocalizationProvider>
            <button
              onClick={() => onRepeatWorkout(false)}
              className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Repeat Workout Modal */}
      {isRepeatModalOpen && (
        <RepeatWorkoutModal
          exercises={repeatWorkoutExercises}
          onClose={onCloseRepeatModal}
          onCopy={onCopyWorkout}
        />
      )}

      {/* Workout Modals for Adding Exercises */}
      <WorkoutModals
        dialogOpen={dialogOpen}
        selectedExercise={selectedExercise}
        sets={sets}
        reps={reps}
        onSetsChange={onSetsChange}
        onRepsChange={onRepsChange}
        onClose={onClose}
        onAddToWorkout={onAddToWorkout}
        customDialogOpen={customDialogOpen}
        customName={customName}
        customBodyPart={customBodyPart}
        customCalories={customCalories}
        onCustomNameChange={onCustomNameChange}
        onCustomBodyPartChange={onCustomBodyPartChange}
        onCustomCaloriesChange={onCustomCaloriesChange}
        onCloseCustomDialog={onCloseCustomDialog}
        repeatWorkoutExercises={repeatWorkoutExercises}
        isRepeatModalOpen={isRepeatModalOpen}
        onCopyWorkout={onCopyWorkout}
        onCloseRepeatModal={onCloseRepeatModal}
      />

      {/* Custom Exercise Dialog */}
      {customDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-white mb-4">
              Add Custom Exercise
            </h2>
            <input
              type="text"
              placeholder="Exercise Name"
              value={customName}
              onChange={onCustomNameChange}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <select
              value={customBodyPart}
              onChange={onCustomBodyPartChange}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            >
              <option value="" disabled>
                Select Body Part
              </option>
              {bodyParts.map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Calories Burnt per Rep"
              value={customCalories}
              onChange={onCustomCaloriesChange}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseCustomDialog}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={onAddCustomExerciseSubmit} // Changed from onAddCustomExercise
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Button */}
      <Tippy content="Profile" placement="top">
        <button
          className="absolute bottom-4 right-4 bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-700 transition"
          onClick={() => (window.location.href = "/profile")}
        >
          <FaUserCircle className="text-white text-2xl" />
        </button>
      </Tippy>
    </div>
  );
};

export default UserDashboardView;
