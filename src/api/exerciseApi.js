import axios from "axios";

const API_URL = "http://localhost:3000/api/exercises";

//  Fetch all exercises for the authenticated user
export const getAllExercises = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getAllExercises`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("This is the ex" , response);
    debugger;
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