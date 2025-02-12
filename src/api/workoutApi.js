import axios from "axios";

const API_URL = "http://localhost:3000/api/workouts";

export const createWorkout = async (token, workoutData) => {
    try {
      const response = await axios.post(
        `${API_URL}/createWorkout`,
        workoutData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating workout:", error);
      throw error;
    }
  };
  
  export const getUserWorkouts = async (token) => {
    try {
      const response = await axios.get(
        `${API_URL}/userWorkout`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting user workouts:", error);
      throw error;
    }
  };
