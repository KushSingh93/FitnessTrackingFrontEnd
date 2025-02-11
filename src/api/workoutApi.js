import axios from "axios";

const API_URL = "http://localhost:3000/api/workouts";

//  Create a new workout
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
