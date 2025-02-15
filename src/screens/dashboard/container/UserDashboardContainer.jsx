import React, { Component } from "react";
import { getAllExercises, addCustomExercise } from "../api/exerciseApi";
import { FaUserCircle, FaChartBar } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  getTodaysWorkoutExercises,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  getWorkoutExercisesByDate,
} from "../api/workoutExerciseApi";
import { getUserStreak } from "../../profile/api";
import {
  getFavoriteExercises,
  addToFavorites,
  removeFromFavorites,
} from "../api/favExerciseApi";
import ExerciseList from "../components/ExerciseList";
import TodaysWorkout from "../components/TodaysWorkout";
import WorkoutModals from "../components/WorkoutModals";
import RepeatWorkoutModal from "../components/RepeatWorkoutModal";

class UserDashboardContainer extends Component {
  state = {
    arsenalExercises: [],
    todaysWorkout: [],
    favoriteExercises: new Set(),
    searchQuery: "",
    dialogOpen: false,
    customDialogOpen: false,
    showDatePicker: false,
    isRepeatModalOpen: false,
    selectedExercise: null,
    selectedDate: null,
    repeatWorkoutExercises: [],
    sets: "",
    reps: "",
    streak: 0,
    customName: "",
    customBodyPart: "",
    customCalories: "",
    error: null,
    loading: true,
  };

  async componentDidMount() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const [exercises, todaysWorkout, streakData, favoriteExercises] =
        await Promise.all([
          getAllExercises(token),
          getTodaysWorkoutExercises(token),
          getUserStreak(token),
          getFavoriteExercises(token),
        ]);

      this.setState({
        arsenalExercises: exercises,
        todaysWorkout: todaysWorkout,
        streak: streakData.streakCount,
        favoriteExercises: new Set(favoriteExercises),
        loading: false,
      });
    } catch (error) {
      this.setState({ error: "Failed to fetch data", loading: false });
    }
  }

  handleOpenCustomExerciseDialog = () =>
    this.setState({ customDialogOpen: true });

  handleCloseCustomDialog = () =>
    this.setState({
      customDialogOpen: false,
      customName: "",
      customBodyPart: "",
      customCalories: "",
    });

  handleAddCustomExercise = async () => {
    const { customName, customBodyPart, customCalories, arsenalExercises } =
      this.state;
    if (!customName || !customBodyPart || !customCalories) return;

    try {
      const token = localStorage.getItem("token");
      const exerciseData = {
        exerciseName: customName,
        bodyPart: customBodyPart,
        caloriesBurntPerRep: parseFloat(customCalories),
      };

      const newExercise = await addCustomExercise(exerciseData, token);
      this.setState({
        arsenalExercises: [...arsenalExercises, newExercise],
        customDialogOpen: false,
      });
    } catch {
      this.setState({ error: "Failed to add exercise" });
    }
  };

  handleAddExerciseClick = (exercise) => {
    this.setState({ dialogOpen: true, selectedExercise: exercise });
  };

  handleAddToWorkout = async () => {
    const { selectedExercise, sets, reps, todaysWorkout } = this.state;
    if (!selectedExercise || !sets || !reps) return;

    const token = localStorage.getItem("token");
    if (!token) {
      this.setState({ error: "User not authenticated." });
      return;
    }
    const exerciseData = {
      exerciseId: selectedExercise.exerciseId,
      sets: parseInt(sets),
      reps: parseInt(reps),
    };
    try {
      const newExercise = await addExerciseToWorkout(token, exerciseData);
      this.setState({
        todaysWorkout: [...todaysWorkout, newExercise],
        dialogOpen: false,
        sets: "",
        reps: "",
      });
    } catch (error) {
      console.error("Failed to add exercise to workout:", error);
      this.setState({ error: "Failed to add exercise to workout." });
    }
  };

  handleRemoveExercise = async (workoutExerciseId) => {
    const { todaysWorkout } = this.state;

    const token = localStorage.getItem("token");
    if (!token) {
      this.setState({ error: "User not authenticated." });
      return;
    }

    try {
      const updatedWorkout = todaysWorkout.filter(
        (exercise) => exercise.workoutExerciseId !== workoutExerciseId
      );
      this.setState({ todaysWorkout: updatedWorkout });

      await removeExerciseFromWorkout(token, workoutExerciseId);

      console.log("Exercise removed successfully.");
    } catch (error) {
      console.error("Failed to remove exercise from workout:", error);
      this.setState({ error: "Failed to remove exercise from workout." });

      this.setState({ todaysWorkout });
    }
  };

  handleDateChange = async (newDate) => {
    this.setState({ selectedDate: newDate, showDatePicker: false });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        this.setState({ error: "User not authenticated." });
        return;
      }

      const formattedDate = newDate.format("YYYY-MM-DD");

      const pastWorkout = await getWorkoutExercisesByDate(token, formattedDate);
      this.setState({
        repeatWorkoutExercises: pastWorkout.length ? pastWorkout : [],
        isRepeatModalOpen: true,
      });
    } catch (error) {
      this.setState({ error: "Failed to fetch past workout." });
    }
  };

  handleCopyWorkout = async () => {
    console.log("Copying workout to today's workout...");
  
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }
  
    const { repeatWorkoutExercises } = this.state;
  
    // Clear today's workout on the backend
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const todaysWorkoutExercises = await getTodaysWorkoutExercises(token); // Fetch today's exercises
      console.log("Today's Workout Exercises:", todaysWorkoutExercises); // Debugging: Log the exercises
  
      // Ensure todaysWorkoutExercises is an array
      if (!Array.isArray(todaysWorkoutExercises)) {
        console.error("Expected an array but got:", todaysWorkoutExercises);
        return;
      }
  
      // Delete each exercise
      for (const exercise of todaysWorkoutExercises) {
        await removeExerciseFromWorkout(token, exercise.workoutExerciseId); // Use workoutExerciseId
      }
    } catch (error) {
      console.error("Error clearing today's workout:", error);
      return;
    }
  
    // Copy the selected day's workout to today's workout on the backend
    try {
      const copiedWorkout = repeatWorkoutExercises.map((exercise) => ({
        ...exercise,
        caloriesBurntPerRep: Number(exercise.caloriesBurntPerRep),
      }));
  
      for (const exercise of copiedWorkout) {
        await addExerciseToWorkout(token, {
          ...exercise,
          date: dayjs().format("YYYY-MM-DD"),
        });
      }
  
      // Update frontend state and localStorage
      localStorage.setItem("todaysWorkout", JSON.stringify(copiedWorkout));
      this.setState({ todaysWorkout: copiedWorkout, isRepeatModalOpen: false });
  
      console.log("Workout copied successfully!");
    } catch (error) {
      console.error("Error copying workout to today's workout:", error);
    }
  };

  handleToggleFavorite = async (exercise) => {
    const { favoriteExercises } = this.state;
    const token = localStorage.getItem("token");
    if (!token) return;

    const updatedFavorites = new Set(favoriteExercises);
    const isFavorite = updatedFavorites.has(exercise.exerciseId);

    if (isFavorite) {
      updatedFavorites.delete(exercise.exerciseId);
    } else {
      updatedFavorites.add(exercise.exerciseId);
    }
    this.setState({ favoriteExercises: updatedFavorites });

    try {
      if (isFavorite) {
        await removeFromFavorites(token, exercise.exerciseId);
      } else {
        await addToFavorites(token, exercise.exerciseId);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
      this.setState({ favoriteExercises });
    }
  };

  render() {
    const {
      arsenalExercises,
      todaysWorkout,
      favoriteExercises,
      searchQuery,
      dialogOpen,
      customDialogOpen,
      selectedExercise,
      sets,
      reps,
      streak,
      repeatWorkoutExercises,
      isRepeatModalOpen,
      showDatePicker,
      selectedDate,
      customName,
      customBodyPart,
      customCalories,
    } = this.state;

    const bodyParts = ["ARMS", "BACK", "LEGS", "SHOULDER", "CHEST", "ABS"];

    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center relative">
        {/* Streak Display */}
        <div className="absolute top-4 left-4 flex justify-center items-center">
          <div className="relative">
            <img
              src="/src/assets/images/fireFinal.png"
              alt="Streak"
              className="w-12 h-12 drop-shadow-lg"
            />
            <span className="absolute inset-0 flex justify-center items-center text-white font-bold text-xl">
              {streak}
            </span>
          </div>
        </div>

        {/*  Analysis Button */}
        <button
          className="absolute top-4 right-4 bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-700 transition"
          onClick={() => (window.location.href = "/analysis")}
        >
          <FaChartBar className="text-white text-2xl" />
        </button>

        <div className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExerciseList
            exercises={arsenalExercises}
            favoriteExercises={favoriteExercises}
            searchQuery={searchQuery}
            onSearchChange={(e) =>
              this.setState({ searchQuery: e.target.value })
            }
            onAddExercise={this.handleAddExerciseClick}
            onAddCustomExercise={this.handleOpenCustomExerciseDialog}
            onToggleFavorite={this.handleToggleFavorite}
          />

          <TodaysWorkout
            exercises={todaysWorkout}
            onRemoveExercise={this.handleRemoveExercise}
            onRepeatWorkout={() => this.setState({ showDatePicker: true })}
            onDateSelect={this.handleDateChange}
          />
        </div>

        {/*  Calendar Popup for Selecting a Workout Date */}
        {showDatePicker && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Select Date</h2>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={(newDate) => this.handleDateChange(newDate)}
                  className="bg-white rounded p-2 w-full"
                />
              </LocalizationProvider>
              <button
                onClick={() => this.setState({ showDatePicker: false })}
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
            onClose={() => this.setState({ isRepeatModalOpen: false })}
            onCopy={this.handleCopyWorkout}
          />
        )}

        {/* Workout Modals for Adding Exercises */}
        <WorkoutModals
          dialogOpen={dialogOpen}
          selectedExercise={selectedExercise}
          sets={sets}
          reps={reps}
          onSetsChange={(e) => this.setState({ sets: e.target.value })}
          onRepsChange={(e) => this.setState({ reps: e.target.value })}
          onClose={() => this.setState({ dialogOpen: false })}
          onAddToWorkout={this.handleAddToWorkout}
          customDialogOpen={customDialogOpen}
          customName={customName}
          customBodyPart={customBodyPart}
          customCalories={customCalories}
          onCustomNameChange={(e) =>
            this.setState({ customName: e.target.value })
          }
          onCustomBodyPartChange={(e) =>
            this.setState({ customBodyPart: e.target.value })
          }
          onCustomCaloriesChange={(e) =>
            this.setState({ customCalories: e.target.value })
          }
          onCloseCustomDialog={this.handleCloseCustomDialog}
          onAddCustomExercise={this.handleAddCustomExercise}
          repeatWorkoutExercises={repeatWorkoutExercises}
          isRepeatModalOpen={isRepeatModalOpen}
          onCopyWorkout={this.handleCopyWorkout}
          onCloseRepeatModal={() => this.setState({ isRepeatModalOpen: false })}
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
                onChange={(e) => this.setState({ customName: e.target.value })}
                className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              />
              <select
                value={customBodyPart}
                onChange={(e) =>
                  this.setState({ customBodyPart: e.target.value })
                }
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
                onChange={(e) =>
                  this.setState({ customCalories: e.target.value })
                }
                className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={this.handleCloseCustomDialog}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={this.handleAddCustomExercise}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Add Exercise
                </button>
              </div>
            </div>
          </div>
        )}

        {/*  Profile Button */}
        <button
          className="absolute bottom-4 right-4 bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-700 transition"
          onClick={() => (window.location.href = "/profile")}
        >
          <FaUserCircle className="text-white text-3xl" />
        </button>
      </div>
    );
  }
}

export default UserDashboardContainer;
