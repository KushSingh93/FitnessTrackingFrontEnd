import axios from "axios";

// Base API URL
const API_URL = "http://localhost:3000/api";

//  Utility function to get JWT from local storage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

//  SIGNUP API
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Signup failed" };
  }
};

//  LOGIN API
export const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
  
      //  Fix: Extract Token Properly
      const responseData = response.data;
      console.log("Raw Response:", responseData); // Debugging
  
      // Extract token from response (assuming it follows a pattern)
      const tokenMatch = responseData.match(/Token:\s(\S+)/);
      if (!tokenMatch) throw new Error("Token not found in response");
  
      const token = tokenMatch[1]; // Extract actual token
      console.log("Extracted Token:", token);
  
      localStorage.setItem("token", token); // Store JWT token
  
      return token;
    } catch (error) {
      console.error("Login API Error:", error);
      throw error.response ? error.response.data : { message: "Login failed" };
    }
  };
  

// Fetch all exercises (Predefined & Custom)
export const getAllExercises = async () => {
  try {
    const response = await axios.get(`${API_URL}/exercises/getAllExercises`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch exercises" };
  }
};

//  Add an exercise to Today's Workout
export const addExerciseToWorkout = async (exerciseData) => {
  try {
    const response = await axios.post(`${API_URL}/workout-exercises/add`, exerciseData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add exercise to workout" };
  }
};

//  Fetch Favorite Exercises
export const getFavoriteExercises = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(`${API_URL}/favorites/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch favorites" };
  }
};

//  Add to Favorites
export const addToFavorites = async (exerciseId) => {
  try {
    const response = await axios.post(`${API_URL}/favorites/add`, { exerciseId }, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add favorite" };
  }
};

//  Remove from Favorites
export const removeFromFavorites = async (exerciseId) => {
  try {
    await axios.delete(`${API_URL}/favorites/remove/${exerciseId}`, { headers: getAuthHeader() });
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to remove favorite" };
  }
};
