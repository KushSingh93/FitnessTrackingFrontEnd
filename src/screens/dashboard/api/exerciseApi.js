import { apiClient } from "../../../lib/api";

// Fetch all exercises for the authenticated user
export const getAllExercises = async () => {
  try {
    const response = await apiClient.get("/exercises/getAllExercises");
    console.log("Fetched Exercises:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error.response?.data || { message: "Failed to fetch exercises." };
  }
};

// Add Custom Exercise API
export const addCustomExercise = async (exerciseData) => {
  try {
    const response = await apiClient.post("/exercises/addExercise", exerciseData);
    return response.data;
  } catch (error) {
    console.error("Error adding custom exercise:", error);
    throw error.response?.data || { message: "Failed to add exercise." };
  }
};
