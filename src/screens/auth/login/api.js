import { apiClient } from "../../../lib/api";
import Cookies from 'js-cookie'; // Import js-cookie

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/users/login", credentials);
    console.log("API Response:", response.data); // Debugging log

    // Extract token using regex
    const responseData = response.data;
    const tokenMatch = responseData.match(/Token:\s(\S+)/);
    if (!tokenMatch) throw new Error("Token not found in response");

    const token = tokenMatch[1]; 

    // Store the token in cookies instead of local storage
    Cookies.set('token', token, { expires: 7, path: '/' }); // Set cookie with an expiration of 7 days
    console.log("Token stored in cookies:", Cookies.get('token')); 

    return token; 
  } catch (error) {
    console.error("Login API Error:", error);
    throw error.response ? error.response.data : { message: "Login failed" };
  }
};
