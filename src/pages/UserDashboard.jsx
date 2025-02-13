import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import { getAllExercises } from "../api/exerciseApi";
import { addCustomExercise } from "../api/exerciseApi";
import {
  getFavoriteExercises,
  addToFavorites,
  removeFromFavorites,
} from "../api/favExerciseApi";
import {
  getTodaysWorkoutExercises,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  getWorkoutExercisesByDate,
} from "../api/workoutExerciseApi";

const UserDashboard = () => {
  const [arsenalExercises, setArsenalExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaysWorkout, setTodaysWorkout] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [streak, setStreak] = useState(8); // Streak Count
  const [repeatWorkoutExercises, setRepeatWorkoutExercises] = useState([]);
  const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false);

  //  Fetch Arsenal Exercises on Component Mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from storage
        if (!token) {
          setError("User not authenticated.");
          return;
        }

        const exercises = await getAllExercises(token); // Call API function
        setArsenalExercises(exercises);
      } catch (err) {
        setError("Failed to load exercises.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const fetchTodaysWorkout = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated.");
          return;
        }

        const exercises = await getTodaysWorkoutExercises(token);
        console.log("Fetched Today's Workout:", exercises);
        setTodaysWorkout(exercises);
      } catch (err) {
        setError("Failed to load today's workout.");
      }
    };

    fetchTodaysWorkout();
  }, []);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // 🔹 Mock function to get past workouts (Replace with API later)
  const getWorkoutForDate = (date) => {
    const mockWorkouts = {
      "2025-02-08": [{ name: "Bench Press", sets: 3, reps: 10, calories: 5 }],
      "2025-02-09": [{ name: "Deadlift", sets: 4, reps: 6, calories: 8 }],
      "2025-02-10": [{ name: "Squats", sets: 3, reps: 12, calories: 6 }],
    };

    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    return mockWorkouts[formattedDate] || [];
  };

  //  Handle Date Selection
  const handleDateChange = async (newDate) => {
    setSelectedDate(newDate);
    setShowDatePicker(false); // Close calendar

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      // Format date for API request
      const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
      const todayDate = dayjs().format("YYYY-MM-DD");

      console.log("User selected date:", formattedDate);

      if (formattedDate === todayDate) {
        console.log("Fetching today's workout...");
        const todaysWorkoutData = await getTodaysWorkoutExercises(token);
        setTodaysWorkout(todaysWorkoutData);
        setRepeatWorkoutExercises(todaysWorkoutData); // Open preview with today's workout
      } else {
        console.log("Fetching past workout...");
        const pastWorkout = await getWorkoutExercisesByDate(
          token,
          formattedDate
        );
        console.log("Workout Data for Selected Date:", pastWorkout);

        if (pastWorkout.length === 0) {
          setRepeatWorkoutExercises([]); // Show "No exercises in this workout" message
        } else {
          setRepeatWorkoutExercises(pastWorkout);
        }
      }

      setIsRepeatModalOpen(true); // Open preview modal
    } catch (error) {
      setError("Failed to load workout from the selected date.");
      console.error("Error fetching workout:", error);
      setRepeatWorkoutExercises([]); // Reset in case of an error
      setIsRepeatModalOpen(true); // Open preview modal with error message
    }
  };

  // Custom Exercise Inputs
  const [customName, setCustomName] = useState("");
  const [customBodyPart, setCustomBodyPart] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [showBodyPartDropdown, setShowBodyPartDropdown] = useState(false);

  // Predefined body parts
  const bodyParts = ["ARMS", "BACK", "CHEST", "SHOULDERS", "ABS", "LEGS"];

  //  Open Add Exercise Dialog when clicking "+"
  const handleAddExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setDialogOpen(true);
  };

  const handleAddToWorkout = async () => {
    if (!sets || !reps) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      const exerciseData = {
        exerciseId: selectedExercise.exerciseId,
        sets: Number(sets),
        reps: Number(reps),
      };

      const addedExercise = await addExerciseToWorkout(token, exerciseData);

      setTodaysWorkout((prevWorkout) => [...prevWorkout, addedExercise]);

      setDialogOpen(false);
      setSets("");
      setReps("");
    } catch (error) {
      setError("Failed to add exercise to today's workout.");
    }
  };

  // Remove exercise from Today’s Workout
  const handleRemoveFromWorkout = async (workoutExerciseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      // ✅ Call backend API to remove exercise
      await removeExerciseFromWorkout(token, workoutExerciseId);

      // ✅ Update state: Remove exercise from UI immediately
      setTodaysWorkout((prevWorkout) =>
        prevWorkout.filter(
          (exercise) => exercise.workoutExerciseId !== workoutExerciseId
        )
      );
    } catch (error) {
      setError("Failed to remove exercise.");
    }
  };

  //  Open Custom Exercise Dialog
  const handleOpenCustomExerciseDialog = () => {
    setCustomDialogOpen(true);
  };

  //  Close Custom Exercise Dialog
  const handleCloseCustomDialog = () => {
    setCustomDialogOpen(false);
    setCustomName("");
    setCustomBodyPart("");
    setCustomCalories("");
  };

  // Modify handleAddCustomExercise function
  const handleAddCustomExercise = async () => {
    if (!customName || !customBodyPart || !customCalories) return;

    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      const exerciseData = {
        exerciseName: customName,
        bodyPart: customBodyPart,
        caloriesBurntPerRep: isNaN(parseFloat(customCalories))
          ? 0.0
          : parseFloat(customCalories), // Ensure it's a number
      };

      const newExercise = await addCustomExercise(exerciseData, token); // Call API
      setArsenalExercises([...arsenalExercises, newExercise]); // Update state
      handleCloseCustomDialog(); // Close dialog
    } catch (error) {
      setError("Failed to add exercise.");
    }
  };

  //  Calculate total calories burned
  const totalCalories = todaysWorkout.reduce(
    (sum, exercise) =>
      sum + exercise.caloriesBurntPerRep * exercise.sets * exercise.reps,
    0
  );

  const [favoriteExercises, setFavoriteExercises] = useState(new Set()); // Store as a Set
  const token = localStorage.getItem("token");

  // ✅ Fetch Favorites on Component Mount
  useEffect(() => {
    // const fetchFavorites = async () => {
    //   if (!token) return;
    //   // const favorites = await getFavoriteExercises(token);
    //   // setFavoriteExercises(new Set(favorites)); // Store favorite exercise IDs

    // };

    // fetchFavorites();
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from storage
        if (!token) {
          setError("User not authenticated.");
          return;
        }

        const exercises = await getAllExercises(token); // Call API function
        setArsenalExercises(exercises);
      } catch (err) {
        setError("Failed to load exercises.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // ✅ Toggle Favorite
  const handleToggleFavorite = async (exercise) => {
    if (!token) {
      console.error("User not authenticated.");
      return;
    }

    // Optimistically update the UI
    const updatedExercises = arsenalExercises.map((ex) =>
      ex.exerciseId === exercise.exerciseId
        ? { ...ex, favourite: !ex.favourite }
        : ex
    );
    setArsenalExercises(updatedExercises);

    try {
      if (exercise.favourite) {
        await removeFromFavorites(token, exercise.exerciseId);
      } else {
        await addToFavorites(token, exercise.exerciseId);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);

      // Revert UI change on failure
      setArsenalExercises(arsenalExercises);
    }
  };

  //  Filter exercises based on search input (by name or body part)
  const filteredExercises = arsenalExercises.filter(
    (exercise) =>
      exercise.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    return b.favourite - a.favourite; // Keep favorites on top after filtering
  });

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
                  {exercise.exerciseName} - {exercise.sets} sets,{" "}
                  {exercise.reps} reps
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
              Copy
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleCopyWorkout = () => {
    console.log("Copying workout to today's workout...");

    // Clear today's workout first
    setTodaysWorkout([]);

    //  Copy selected workout into today's workout with correct calorie calculations
    const copiedWorkout = repeatWorkoutExercises.map((exercise) => ({
      ...exercise,
      caloriesBurntPerRep: Number(exercise.caloriesBurntPerRep), //  Ensures it's a valid number
    }));

    setTodaysWorkout(copiedWorkout);
    setIsRepeatModalOpen(false); // Close modal
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center relative">
      {/* Streak Icon */}
      <div className="absolute top-4 left-4 flex justify-center items-center">
        <div className="relative">
          {/* Flame Icon */}
          <img
            src="/src/assets/images/fireFinal.png"
            alt="Streak"
            className="w-12 h-12 drop-shadow-lg"
          />

          {/* Streak Number (Smaller, Less Dark, and Cool) */}
          <span className="absolute inset-0 flex justify-center items-center text-white font-bold text-xl tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.7)] opacity-90">
            {streak}
          </span>
        </div>
      </div>

      {/* Logo */}
      <div className="mt-6">
        <img
          src="/src/assets/images/ironLogLogo.png"
          alt="Iron Log"
          className="w-32 h-auto"
        />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arsenal Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Arsenal</h2>

          {/* Loading & Error Handling */}
          {loading && <p className="text-gray-400">Loading exercises...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
          />

          {/* Add Custom Exercise Button */}
          <button
            onClick={handleOpenCustomExerciseDialog}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
          >
            + Add Custom Exercise
          </button>

          {/* Exercises List with Body Part & Favorite Toggle */}
          <div className="mt-4">
            {sortedExercises.length === 0 ? (
              <p className="text-gray-400">No exercises found.</p>
            ) : (
              sortedExercises.map((exercise) => (
                <div
                  key={exercise.exerciseId}
                  className="flex justify-between bg-gray-700 p-3 rounded mb-2"
                >
                  <span>
                    {exercise.exerciseName}{" "}
                    <span className="text-gray-400">({exercise.bodyPart})</span>{" "}
                    - {exercise.caloriesBurntPerRep} kcal
                  </span>
                  <div className="flex items-center space-x-4">
                    {/* ❤️ Favorite Button (Fixed Toggle) */}
                    <button
                      onClick={() => handleToggleFavorite(exercise)}
                      className={`text-lg hover:text-red-500 transition ${
                        exercise.favourite ? "text-red-400" : "text-gray-400"
                      }`}
                    >
                      {exercise.favourite ? "❤️" : "🤍"}
                    </button>

                    {/* ➕ Add to Workout Button */}
                    <button
                      onClick={() => handleAddExerciseClick(exercise)}
                      className="text-green-400 text-lg hover:text-green-500"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Workout Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Today's Workout</h2>
          {todaysWorkout.length === 0 ? (
            <p className="text-gray-400">No exercises added yet.</p>
          ) : (
            <>
              {todaysWorkout.map((exercise, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-gray-700 p-3 rounded mb-2"
                >
                  <span>
                    {exercise.exerciseName} - {exercise.sets} sets,{" "}
                    {exercise.reps} reps -{" "}
                    <span className="text-gray-400">
                      {(
                        (exercise.caloriesBurntPerRep || 0) *
                        exercise.sets *
                        exercise.reps
                      ).toFixed(2)}{" "}
                      kcal
                    </span>
                  </span>
                  <button
                    onClick={() =>
                      handleRemoveFromWorkout(exercise.workoutExerciseId)
                    }
                    className="text-red-400 text-lg hover:text-red-500"
                  >
                    −
                  </button>
                </div>
              ))}
              <div className="mt-4 text-lg font-semibold text-green-400">
                Total Calories Burned: {totalCalories} kcal
              </div>
            </>
          )}

          {/* Repeat Workout Button */}
          <button
            onClick={() => setShowDatePicker(true)}
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white py-2 px-4 rounded-lg flex justify-center items-center transition-all duration-300 transform hover:scale-105"
          >
            🔄 Repeat Workout
          </button>
        </div>

        {/* Calendar Popup for Selecting a Workout Date */}
        {showDatePicker && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Select Date</h2>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={(newDate) => {
                    setSelectedDate(newDate);
                    handleDateChange(newDate);
                    setShowDatePicker(false);
                  }}
                  className="bg-white rounded p-2 w-full"
                />
              </LocalizationProvider>

              {/* Close Button */}
              <button
                onClick={() => setShowDatePicker(false)}
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
            onClose={() => setIsRepeatModalOpen(false)}
            onCopy={handleCopyWorkout} 
          />
        )}
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {selectedExercise.name} ({selectedExercise.bodyPart})
            </h2>
            <label className="block mb-2">Sets:</label>
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              className="w-full p-2 mb-2 bg-gray-700 rounded text-white"
            />
            <label className="block mb-2">Reps:</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setDialogOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToWorkout}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Exercise Dialog */}
      {customDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative w-96">
            {/* Close Button */}
            <button
              onClick={handleCloseCustomDialog}
              className="absolute top-2 right-2 text-white text-2xl hover:text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">
              Add Custom Exercise
            </h2>

            {/* Exercise Name Input */}
            <input
              type="text"
              placeholder="Exercise Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full p-2 mb-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Body Part Dropdown */}
            <select
              onChange={(e) => setCustomBodyPart(e.target.value)}
              value={customBodyPart}
              className="w-full p-2 mb-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Body Part</option>
              {bodyParts.map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </select>

            {/* Calories Burned Per Set */}
            <input
              type="number"
              placeholder="Calories per rep"
              value={customCalories}
              onChange={(e) => setCustomCalories(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Error Message */}
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

            {/* Submit Button */}
            <button
              onClick={handleAddCustomExercise}
              disabled={
                !customName || !customBodyPart || !customCalories || loading
              }
              className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                !customName || !customBodyPart || !customCalories
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {loading ? "Adding..." : "Add Exercise"}
            </button>
          </div>
        </div>
      )}

      {/* User Profile (Bottom Right) */}
      <button
        className="absolute bottom-4 right-4 flex items-center bg-gray-800 p-3 rounded-lg shadow-lg rounded-full hover:bg-gray-700 transition duration-200"
        onClick={() => console.log("Navigate to User Management Page")} // Replace with navigation logic later
      >
        <FaUserCircle className="text-white text-3xl" /> {/* User icon */}
      </button>

      {/* Analysis (Top Right) */}
      <button
        className="absolute top-4 right-4 flex items-center bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-700 transition duration-200"
        onClick={() => console.log("Navigate to Analysis Page")} // Replace with navigation logic later
      >
        <FaChartBar className="text-white text-2xl" /> {/* Graph icon */}
      </button>
    </div>
  );
};

export default UserDashboard;
