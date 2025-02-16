import { apiClient } from "../../../lib/api";

// Create a New Workout
export const createWorkout = async (workoutData) => {
  try {
    const response = await apiClient.post("/workouts/createWorkout", workoutData);
    return response.data;
  } catch (error) {
    console.error("Error creating workout:", error);
    throw error;
  }
};

// Fetch User Workouts
export const getUserWorkouts = async () => {
  try {
    const response = await apiClient.get("/workouts/userWorkout");
    return response.data;
  } catch (error) {
    console.error("Error getting user workouts:", error);
    throw error;
  }
};
