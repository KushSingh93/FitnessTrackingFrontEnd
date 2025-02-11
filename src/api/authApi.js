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