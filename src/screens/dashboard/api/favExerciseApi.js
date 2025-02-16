import { apiClient } from "../../../lib/api";
const API_URL = "/favorites";

export const getFavoriteExercises = async () => {
  try {
    const response = await apiClient.get("/favorites");

    console.log("Fetched Favorite Exercises:", response.data);

    return response.data.map((fav) => fav.exercise.exerciseId);
  } catch (error) {
    console.error("Error fetching favorite exercises:", error);
    return [];
  }
};

//  Add Favorite Exercise (Already Correct)
export const addToFavorites = async (exerciseId) => {
  try {
    await apiClient.post(`${API_URL}/add`, { exerciseId });
  } catch (error) {
    console.error("Error adding favorite exercise:", error);
  }
};

// Remove Favorite Exercise (Fixed)
export const removeFromFavorites = async (favExerciseId) => {
  try {
    await apiClient.delete(`${API_URL}/remove/${favExerciseId}`);
  } catch (error) {
    console.error("Error removing favorite exercise:", error);
  }
};
