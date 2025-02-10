import axios from "axios";

const API_URL = "http://localhost:3000/api/exercises";

//  Fetch all exercises for the authenticated user
export const getAllExercises = async (token) => {
    debugger;
  try {
    const response = await axios.get(`${API_URL}/getAllExercises`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("This is the ex" , response);
    return response.data; // Return fetched exercises
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error; // Propagate error
  }
};


//  Add Custom Exercise API
export const addCustomExercise = async (exerciseData, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/addExercise`,
        exerciseData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
            "Content-Type": "application/json",
          },
        }
      );
      return response.data; // Return the created exercise
    } catch (error) {
      console.error("Error adding custom exercise:", error);
      throw error.response ? error.response.data : { message: "Failed to add exercise" };
    }
  };


  //  Get Favorite Exercises (User-specific)
export const getFavoriteExercises = async (token, userId) => {
    try {
      const response = await axios.get(`${API_URL}/favorites/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.map((exercise) => exercise.exerciseId); // Extract only IDs
    } catch (error) {
      console.error("Error fetching favorite exercises:", error);
      return [];
    }
  };

  //  Add Exercise to Favorites
export const addToFavorites = async (token, userId, exerciseId) => {
    try {
      await axios.post(
        `${API_URL}/favorites/add`,
        { userId, exerciseId }, // Send userId & exerciseId in request body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error adding exercise to favorites:", error);
    }
  };
  
  //  Remove Exercise from Favorites
  export const removeFromFavorites = async (token, exerciseId) => {
    try {
      await axios.delete(`${API_URL}/favorites/remove/${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error removing exercise from favorites:", error);
    }
  };
