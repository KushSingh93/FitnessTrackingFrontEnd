import React from "react";
import { FaUserCircle, FaChartBar } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ExerciseList from "./ExerciseList";
import TodaysWorkout from "./TodaysWorkout";
import WorkoutModals from "./WorkoutModals";
import RepeatWorkoutModal from "./RepeatWorkoutModal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { BODY_PARTS, BODY_PART_ICONS, theme } from "../constants";
import { ThemeProvider } from '@mui/material/styles';

function MyDateCalendar({ selectedDate, handleDateChange }) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

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
  onAddCustomExerciseSubmit,
  onCopyWorkout,
  onCloseRepeatModal,
  handleDateChange,
  handleCloseCustomDialog,
  onDeleteExercise,
  currentUserId
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center relative">
      <div className="w-full text-center mb-8 mt-4">
        <img
          src="/src/assets/images/ironLogLogo.png"
          alt="Iron Log Logo"
          className="h-24 mx-auto"
        />
      </div>

      <div className="absolute top-4 left-4 flex justify-center items-center">
        <Tippy content={`Streak`}>
          <div className="relative">
            <img
              src="/src/assets/images/fireFinal.png"
              alt="Streak"
              className="w-12.6 h-12.6 drop-shadow-lg"
            />
            <span className="absolute top-[69%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl">
              {streak}
            </span>
          </div>
        </Tippy>
      </div>

      <Tippy content="Analysis" placement="bottom">
        <button
          className="absolute top-4 right-4 bg-gray-800 p-5 rounded-lg shadow-lg hover:bg-gray-700 transition"
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
          bodyPartIcons={BODY_PART_ICONS}
          currentUserId={currentUserId}
          onDeleteExercise={onDeleteExercise}
        />

        <TodaysWorkout
          exercises={todaysWorkout}
          onRemoveExercise={onRemoveExercise}
          onRepeatWorkout={onRepeatWorkout}
          onDateSelect={onDateSelect}
        />
      </div>

      {showDatePicker && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Select Date</h2>
            <MyDateCalendar
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
            />
            <button
              onClick={() => onRepeatWorkout(false)}
              className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isRepeatModalOpen && (
        <RepeatWorkoutModal
          exercises={repeatWorkoutExercises}
          onClose={onCloseRepeatModal}
          onCopy={onCopyWorkout}
        />
      )}

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
              {BODY_PARTS.map((part) => (
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
                onClick={onAddCustomExerciseSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      <Tippy content="Profile" placement="top">
        <button
          className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-full shadow-lg hover:bg-gray-700 transition"
          onClick={() => (window.location.href = "/profile")}
        >
          <FaUserCircle className="text-white text-3xl" />
        </button>
      </Tippy>
    </div>
  );
};

export default UserDashboardView;
