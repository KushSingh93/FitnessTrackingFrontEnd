import axios from "axios";

const API_URL = "http://localhost:3000/api/workout-exercises";

//  Add an exercise to a workout
export const addExerciseToWorkout = async (token, exerciseData) => {
  try {
    const response = await axios.post(
      `${API_URL}/add`,
      exerciseData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding exercise:", error);
    throw error;
  }
};

//  Get all exercises in a workout
export const getWorkoutExercises = async (token, workoutId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${workoutId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching workout exercises:", error);
    throw error;
  }
};

// Remove an exercise from a workout
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
