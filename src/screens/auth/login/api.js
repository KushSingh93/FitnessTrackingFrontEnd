import { apiClient } from "../../../lib/api";  

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/users/login", credentials);
    console.log("API Response:", response.data); // Debugging log

    // Extract token using regex
    const responseData = response.data;
    const tokenMatch = responseData.match(/Token:\s(\S+)/);
    if (!tokenMatch) throw new Error("Token not found in response");

    const token = tokenMatch[1]; 

    localStorage.setItem("token", token);
    console.log("Token stored in localStorage:", localStorage.getItem("token")); 

    return token; 
  } catch (error) {
    console.error("Login API Error:", error);
    throw error.response ? error.response.data : { message: "Login failed" };
  }
};