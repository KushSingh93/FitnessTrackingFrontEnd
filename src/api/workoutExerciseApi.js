import axios from "axios";
import dayjs from "dayjs";

const API_URL = "http://localhost:3000/api/workout-exercises";

//  Fetch exercises for today's workout
export const getTodaysWorkoutExercises = async (token) => {
  try {
    const today = dayjs().format("YYYY-MM-DD"); 
    const response = await axios.get(`${API_URL}/byDate/${today}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching today's workout:", error);
    throw error; 
  }
};

// Add an exercise to today's workout (Backend auto-creates workout if needed)
export const addExerciseToWorkout = async (token, exerciseData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, exerciseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; //  Returns newly added exercise
  } catch (error) {
    console.error("Error adding exercise to workout:", error);
    throw error;
  }
};
  

//  Remove an exercise from a workout
export const removeExerciseFromWorkout = async (token, workoutExerciseId) => {
    try {
      await axios.delete(
        `${API_URL}/remove/${workoutExerciseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error removing exercise:", error);
      throw error;
    }
  };
