import React, { Component } from "react";
import {
  getAllExercises,
  addCustomExercise,
  deleteExercise,
} from "../api/exerciseApi";
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
import UserDashboardView from "../components/UserDashboardView";
import dayjs from "dayjs";

class UserDashboardContainer extends Component {
  state = {
    arsenalExercises: [],
    todaysWorkout: [],
    favoriteExercises: new Set(),
    searchQuery: "",
    dialogOpen: false,
    customDialogOpen: false,
    showDatePicker: false, // Controls the visibility of the date picker modal
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
    currentUserId: null,
  };

  async componentDidMount() {
    try {
      this.setState({ loading: true });

      const [exercises, todaysWorkout, streakData, favoriteExercises] =
        await Promise.all([
          getAllExercises(),
          getTodaysWorkoutExercises(),
          getUserStreak(),
          getFavoriteExercises(),
        ]);

      this.setState({
        arsenalExercises: exercises,
        todaysWorkout: todaysWorkout,
        streak: streakData.streakCount,
        favoriteExercises: new Set(favoriteExercises),
        currentUserId: exercises[0]?.userId,
        loading: false,
      });
    } catch (error) {
      this.setState({ error: "Failed to fetch data", loading: false });
    }
  }

  // Function to handle showing/hiding the date picker modal
  onRepeatWorkout = (shouldShow) => {
    console.log("onRepeatWorkout called with:", shouldShow); // Debugging
    this.setState({ showDatePicker: shouldShow });
  };

  // Function to close the repeat workout modal
  onCloseRepeatModal = () => {
    this.setState({ isRepeatModalOpen: false });
  };

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
      const exerciseData = {
        exerciseName: customName,
        bodyPart: customBodyPart,
        caloriesBurntPerRep: parseFloat(customCalories),
      };

      const newExercise = await addCustomExercise(exerciseData);
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

    // Convert sets and reps to integers
    const setsInt = parseInt(sets);
    const repsInt = parseInt(reps);

    if (setsInt <= 0 || repsInt <= 0) {
      this.setState({ error: "Sets and reps must be greater than 0." });
      return;
    }

    const exerciseData = {
      exerciseId: selectedExercise.exerciseId,
      sets: setsInt,
      reps: repsInt,
    };

    try {
      const newExercise = await addExerciseToWorkout(exerciseData);
      this.setState({
        todaysWorkout: [...todaysWorkout, newExercise],
        dialogOpen: false,
        sets: "",
        reps: "",
        error: "", // Clear any previous error message
      });
    } catch (error) {
      console.error("Failed to add exercise to workout:", error);
      this.setState({ error: "Failed to add exercise to workout." });
    }
  };

  handleRemoveExercise = async (workoutExerciseId) => {
    const { todaysWorkout } = this.state;

    try {
      await removeExerciseFromWorkout(workoutExerciseId);
      const updatedWorkout = todaysWorkout.filter(
        (exercise) => exercise.workoutExerciseId !== workoutExerciseId
      );
      this.setState({ todaysWorkout: updatedWorkout });
      console.log("Exercise removed successfully.");
    } catch (error) {
      console.error("Failed to remove exercise from workout:", error);
      this.setState({ error: "Failed to remove exercise from workout." });
    }
  };

  handleDateChange = async (newDate) => {
    this.setState({ selectedDate: newDate, showDatePicker: false });

    try {
      const formattedDate = newDate.format("YYYY-MM-DD");

      const pastWorkout = await getWorkoutExercisesByDate(formattedDate);
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

    const { repeatWorkoutExercises } = this.state;

    // Clear today's workout on the backend
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const todaysWorkoutExercises = await getTodaysWorkoutExercises();

      // Ensure todaysWorkoutExercises is an array
      if (!Array.isArray(todaysWorkoutExercises)) {
        console.error("Expected an array but got:", todaysWorkoutExercises);
        return;
      }

      // Delete each exercise
      for (const exercise of todaysWorkoutExercises) {
        await removeExerciseFromWorkout(exercise.workoutExerciseId); // Use workoutExerciseId
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
        await addExerciseToWorkout({
          ...exercise,
          date: dayjs().format("YYYY-MM-DD"),
        });
      }

      this.setState({ todaysWorkout: copiedWorkout, isRepeatModalOpen: false });

      console.log("Workout copied successfully!");
    } catch (error) {
      console.error("Error copying workout to today's workout:", error);
    }
  };

  handleToggleFavorite = async (exercise) => {
    const { favoriteExercises } = this.state;

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
        await removeFromFavorites(exercise.exerciseId);
      } else {
        await addToFavorites(exercise.exerciseId);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
      this.setState({ favoriteExercises });
    }
  };

  handleDeleteExercise = async (exerciseId) => {
    try {
      // Call API to delete the exercise
      await deleteExercise(exerciseId);
      // Update state by removing the deleted exercise
      this.setState((prevState) => ({
        arsenalExercises: prevState.arsenalExercises.filter(
          (exercise) => exercise.exerciseId !== exerciseId
        ),
      }));
    } catch (error) {
      console.error("Failed to delete exercise:", error);
      this.setState({ error: "Failed to delete exercise." });
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
      currentUserId,
    } = this.state;
    return (
      <UserDashboardView
        arsenalExercises={arsenalExercises}
        todaysWorkout={todaysWorkout}
        favoriteExercises={favoriteExercises}
        searchQuery={searchQuery}
        dialogOpen={dialogOpen}
        customDialogOpen={customDialogOpen}
        showDatePicker={showDatePicker}
        isRepeatModalOpen={isRepeatModalOpen}
        selectedExercise={selectedExercise}
        selectedDate={selectedDate}
        repeatWorkoutExercises={repeatWorkoutExercises}
        sets={sets}
        reps={reps}
        streak={streak}
        customName={customName}
        customBodyPart={customBodyPart}
        customCalories={customCalories}
        onSearchChange={(e) => this.setState({ searchQuery: e.target.value })}
        onAddExercise={this.handleAddExerciseClick}
        onAddCustomExercise={this.handleOpenCustomExerciseDialog}
        onToggleFavorite={this.handleToggleFavorite}
        onRemoveExercise={this.handleRemoveExercise}
        onRepeatWorkout={this.onRepeatWorkout} // Updated to handle both open and close
        onCloseRepeatModal={this.onCloseRepeatModal}
        onDateSelect={this.handleDateChange}
        onSetsChange={(e) => this.setState({ sets: e.target.value })}
        onRepsChange={(e) => this.setState({ reps: e.target.value })}
        onClose={() => this.setState({ dialogOpen: false })}
        onAddToWorkout={this.handleAddToWorkout}
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
        onAddCustomExerciseSubmit={this.handleAddCustomExercise}
        onCopyWorkout={this.handleCopyWorkout}
        handleDateChange={this.handleDateChange}
        handleCloseCustomDialog={this.handleCloseCustomDialog}
        onDeleteExercise={this.handleDeleteExercise}
        currentUserId={currentUserId}
      />
    );
  }
}

export default UserDashboardContainer;
