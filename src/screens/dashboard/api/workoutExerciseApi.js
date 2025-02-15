import { apiClient } from "../../../lib/api";
import dayjs from "dayjs";

// Fetch exercises for today's workout
export const getTodaysWorkoutExercises = async (token) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");
    const response = await apiClient.get(`/workout-exercises/byDate/${today}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching today's workout:", error);
    throw error;
  }
};

// Fetch workout exercises by selected date
export const getWorkoutExercisesByDate = async (token, date) => {
  try {
    const response = await apiClient.get(`/workout-exercises/byDate/${date}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching workout by date:", error);
    throw error;
  }
};

// Add an exercise to today's workout (Backend auto-creates workout if needed)
export const addExerciseToWorkout = async (token, exerciseData) => {
  try {
    const response = await apiClient.post("/workout-exercises/add", exerciseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Returns newly added exercise
  } catch (error) {
    console.error("Error adding exercise to workout:", error);
    throw error;
  }
};

// Remove an exercise from a workout
export const removeExerciseFromWorkout = async (token, workoutExerciseId) => {
  try {
    await apiClient.delete(`/workout-exercises/remove/${workoutExerciseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error removing exercise:", error);
    throw error;
  }
};
