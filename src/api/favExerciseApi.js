import axios from "axios";

const API_URL = "http://localhost:3000/api/favorites";

//  Get Favorite Exercises (No userId needed anymore)
export const getFavoriteExercises = async (token) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map((exercise) => exercise.exerciseId); // Extract exercise IDs
  } catch (error) {
    console.error("Error fetching favorite exercises:", error);
    return [];
  }
};

//  Add Favorite Exercise
export const addToFavorites = async (token, exerciseId) => {
    console.log(exerciseId);
    
  try {
    await axios.post(
      `${API_URL}/add`,
      { exerciseId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error adding favorite exercise:", error);
  }
};

//  Remove Favorite Exercise
export const removeFromFavorites = async (token, favExerciseId) => {
    console.log(favExerciseId);
  try {
    await axios.delete(`${API_URL}/remove/${favExerciseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error removing favorite exercise:", error);
  }
};
