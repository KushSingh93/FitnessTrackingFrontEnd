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
import { getUserStreak } from "../api/userApi";
import { useNavigate } from "react-router-dom";

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
  const [streak, setStreak] = useState(0); // Streak Count
  const [repeatWorkoutExercises, setRepeatWorkoutExercises] = useState([]);
  const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false);

  

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          navigate("/login"); 
          return;
        }
  
        const data = await getUserStreak(token); 
        setStreak(data.streakCount);
      } catch (error) {
        console.error("Error fetching streak:", error);
      }
    };
  
    fetchStreak();
  }, []); 

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
  const bodyParts = ["ARMS", "BACK", "CHEST", "SHOULDER", "ABS", "LEGS"];

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

  useEffect(() => {
    const savedWorkout = localStorage.getItem("todaysWorkout");
    if (savedWorkout) {
      setTodaysWorkout(JSON.parse(savedWorkout));
    }
  }, []);

  const handleCopyWorkout = () => {
    console.log("Copying workout to today's workout...");

    // Clear today's workout first
    setTodaysWorkout([]);

    //  Copy selected workout into today's workout with correct calorie calculations
    const copiedWorkout = repeatWorkoutExercises.map((exercise) => ({
      ...exercise,
      caloriesBurntPerRep: Number(exercise.caloriesBurntPerRep), //  Ensures it's a valid number
    }));

    // Save the copied workout to localStorage
    localStorage.setItem("todaysWorkout", JSON.stringify(copiedWorkout));

    setTodaysWorkout(copiedWorkout);
    setIsRepeatModalOpen(false); // Close modal
  };

  // Clear today's workout from state and localStorage
  const clearTodaysWorkout = () => {
    localStorage.removeItem("todaysWorkout");
    setTodaysWorkout([]);
  };

  const navigate = useNavigate();

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Today's Workout</h2>
            {todaysWorkout.length > 0 && (
              <button
                onClick={() => {
                  /* Implement clear all function */
                }}
                className="text-red-500 hover:text-red-600 focus:outline-none"
              >
                Clear All
              </button>
            )}
          </div>

          {todaysWorkout.length === 0 ? (
            <div className="text-gray-400 italic">
              No exercises added yet. Let's get moving!
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {todaysWorkout.map((exercise, index) => (
                  <li
                    key={index}
                    className="bg-gray-700 rounded-md p-4 flex items-center justify-between hover:bg-gray-600 transition-colors duration-200"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {exercise.exerciseName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {exercise.sets} sets, {exercise.reps} reps
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-3">
                        {(
                          (exercise.caloriesBurntPerRep || 0) *
                          exercise.sets *
                          exercise.reps
                        ).toFixed(2)}{" "}
                        kcal
                      </span>
                      <button
                        onClick={() =>
                          handleRemoveFromWorkout(exercise.workoutExerciseId)
                        }
                        className="text-red-400 hover:text-red-500 focus:outline-none"
                        aria-label={`Remove ${exercise.exerciseName}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 py-2 px-4 bg-gray-700 rounded-md flex justify-between items-center">
                <span className="text-lg font-semibold text-white">
                  Total Calories Burned:
                </span>
                <span className="text-2xl font-bold text-green-400">
                  {totalCalories} kcal
                </span>
              </div>
            </>
          )}

          {/* Repeat Workout Button */}
          <button
            onClick={() => setShowDatePicker(true)}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:bg-gradient-to-l hover:shadow-md text-white py-3 rounded-lg flex justify-center items-center transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 animate-spin-slow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2A8.003 8.003 0 0119.417 15m0 0h-4m-1.273 0a2 2 0 11-3.142 0m-1.273 0A2 2 0 112.65 12"
              />
            </svg>
            Repeat Workout
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
        onClick={() => navigate("/profile")}
      >
        <FaUserCircle className="text-white text-3xl" />
      </button>

      {/* Analysis Button (Top Right) */}
      <button
        className="absolute top-4 right-4 flex items-center bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-700 transition duration-200"
        onClick={() => navigate("/analysis")}
      >
        <FaChartBar className="text-white text-2xl" />
      </button>
    </div>
  );
};

export default UserDashboard;
