import { apiClient } from "../../../lib/api";  

export const signup = async (userData) => {
  try {
    const response = await apiClient.post("/users/signup", userData);
    console.log("API Response:", response.data); // Debugging log

    // Extract token directly (assuming it's returned in response.data.token)
    const token = response.data.token || response.data; 
    if (!token) throw new Error("Signup successful but no token received.");

    console.log("Extracted Token:", token); // Debugging log

    // Store token in localStorage
    localStorage.setItem("token", token);
    console.log("Token stored in localStorage:", localStorage.getItem("token")); // Debugging log

    // Redirect to login page
    window.location.href = "/login"; // Redirect user after successful signup

    return token;
  } catch (error) {
    console.error("Signup API Error:", error);
    throw error.response ? error.response.data : { message: "Signup failed" };
  }
};
