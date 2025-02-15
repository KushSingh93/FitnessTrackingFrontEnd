import { apiClient } from "../../../lib/api"; 
const API_URL = "/favorites";

export const getFavoriteExercises = async (token) => {
    try {
      const response = await apiClient.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Fetched Favorite Exercises:", response.data); 
  

      return response.data.map((fav) => fav.exercise.exerciseId); 
    } catch (error) {
      console.error("Error fetching favorite exercises:", error);
      return [];
    }
  };
  

//  Add Favorite Exercise (Already Correct)
export const addToFavorites = async (token, exerciseId) => {
  try {
    await apiClient.post(`${API_URL}/add`, { exerciseId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error adding favorite exercise:", error);
  }
};

// Remove Favorite Exercise (Fixed)
export const removeFromFavorites = async (token, favExerciseId) => {
  try {
    await apiClient.delete(`${API_URL}/remove/${favExerciseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error removing favorite exercise:", error);
  }
};
