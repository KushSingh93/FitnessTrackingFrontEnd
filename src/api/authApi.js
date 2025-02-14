import axios from "axios";

const API_URL = "http://localhost:3000/api";

//  Utility function to get JWT from local storage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Signup failed" };
  }
};

export const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
  
      const responseData = response.data;
  
      const tokenMatch = responseData.match(/Token:\s(\S+)/);
      if (!tokenMatch) throw new Error("Token not found in response");
  
      const token = tokenMatch[1]; 
      console.log("Extracted Token:", token);
  
      localStorage.setItem("token", token); 
  
      return token;
    } catch (error) {
      console.error("Login API Error:", error);
      throw error.response ? error.response.data : { message: "Login failed" };
    }
  };