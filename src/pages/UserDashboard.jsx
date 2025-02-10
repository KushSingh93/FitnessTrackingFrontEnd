import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import { getAllExercises } from "../api/exerciseApi";
import { addCustomExercise } from "../api/exerciseApi";
import { getFavoriteExercises, addToFavorites, removeFromFavorites } from "../api/exerciseApi";

const UserDashboard = () => {
  const [arsenalExercises, setArsenalExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Exercises on Component Mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from storage
        debugger;
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

  // 🔹 Handle Date Selection
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const workout = getWorkoutForDate(newDate);
    setTodaysWorkout(workout); // Load into Today's Workout
    setShowDatePicker(false); // Close calendar after selection
  };

  const [todaysWorkout, setTodaysWorkout] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [streak, setStreak] = useState(8); // Streak Count

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

  //  Confirm adding exercise
  const handleAddToWorkout = () => {
    if (!sets || !reps) return;
    const newWorkout = {
      ...selectedExercise,
      sets: Number(sets),
      reps: Number(reps),
    };
    setTodaysWorkout([...todaysWorkout, newWorkout]);
    setDialogOpen(false);
    setSets("");
    setReps("");
  };

  // Remove exercise from Today’s Workout
  const handleRemoveFromWorkout = (index) => {
    const updatedWorkout = todaysWorkout.filter((_, i) => i !== index);
    setTodaysWorkout(updatedWorkout);
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

  // Modify `handleAddCustomExercise` function
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
        caloriesBurntPerSet: parseFloat(customCalories), // Ensure it's a number
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
      sum + exercise.caloriesBurntPerSet * exercise.sets * exercise.reps,
    0
  );

  //  State for favorite exercises
const [favoriteExercises, setFavoriteExercises] = useState([]);

// Fetch token from localStorage once
const token = localStorage.getItem("token");

//  Handle Add/Remove Favorite Exercise
const handleToggleFavorite = async (exerciseId) => {
  try {
    if (!token) {
      console.error("User not authenticated.");
      return;
    }

    if (favoriteExercises.includes(exerciseId)) {
      //  Remove from Favorites
      await removeFromFavorites(token, exerciseId);
      setFavoriteExercises((prevFavorites) =>
        prevFavorites.filter((id) => id !== exerciseId)
      );
    } else {
      //  Add to Favorites
      await addToFavorites(token, exerciseId); // Removed userId (not needed in backend)
      setFavoriteExercises((prevFavorites) => [...prevFavorites, exerciseId]);
    }
  } catch (error) {
    console.error("Error handling favorite toggle:", error);
  }
};

//  Fetch Favorite Exercises on Component Mount
useEffect(() => {
  const fetchFavorites = async () => {
    try {
      if (!token) return;

      const favorites = await getFavoriteExercises(token);
      setFavoriteExercises(favorites.map((fav) => fav.exerciseId)); // Store only exercise IDs
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  fetchFavorites();
}, []); 


  //  Filter exercises based on search input (by name or body part)
  const filteredExercises = arsenalExercises.filter(
    (exercise) =>
      exercise?.exerciseName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exercise?.bodyPart?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  Sort Arsenal Exercises (Favorites on top)
  const sortedExercises = [...filteredExercises].sort(
    (a, b) =>
      favoriteExercises.includes(b.id) - favoriteExercises.includes(a.id)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center relative">
      {/* Streak Icon */}
      <div className="absolute top-4 left-4 flex justify-center items-center">
        <div className="relative">
          {/* Flame Icon */}
          <img
            src="/src/assets/fireFinal.png"
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
          src="/src/assets/ironLogLogo.png"
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
                  key={exercise.id}
                  className="flex justify-between bg-gray-700 p-3 rounded mb-2"
                >
                  <span>
                    {exercise.exerciseName}{" "}
                    <span className="text-gray-400">({exercise.bodyPart})</span>{" "}
                    - {exercise.caloriesBurntPerSet} kcal
                  </span>
                  <div className="flex items-center space-x-4">
                    {/* ❤️ Favorite Button (Individual Toggle) */}
                    <button
                      onClick={() => handleToggleFavorite(exercise.id)}
                      className={`text-lg hover:text-red-500 transition ${
                        favoriteExercises.includes(exercise.id)
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {favoriteExercises.includes(exercise.id) ? "❤️" : "🤍"}
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
                    {exercise.name} - {exercise.sets} sets, {exercise.reps} reps
                    -{" "}
                    <span className="text-gray-400">
                      {exercise.caloriesBurntPerSet *
                        exercise.sets *
                        exercise.reps}{" "}
                      kcal
                    </span>
                  </span>
                  <button
                    onClick={() => handleRemoveFromWorkout(index)}
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
                  onChange={handleDateChange}
                  className="bg-white rounded p-2"
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
