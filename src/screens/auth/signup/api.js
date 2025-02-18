import { apiClient } from "../../../lib/api";
import Cookies from 'js-cookie'; // Import js-cookie

export const signup = async (userData) => {
  try {
    const response = await apiClient.post("/users/signup", userData);
    console.log("API Response:", response.data); // Debugging log

    // Extract token using regex (same logic as login)
    const responseData = response.data;
    const tokenMatch = responseData.match(/Token:\s(\S+)/); // Use regex to find the token
    if (!tokenMatch) throw new Error("Token not found in response");

    const token = tokenMatch[1]; // Extract the token from the regex match

    // Store the token in cookies
    Cookies.set('token', token, { expires: 7, path: '/' }); // Set cookie with an expiration of 7 days
    console.log("Token stored in cookies:", Cookies.get('token')); // Debugging log

    // Redirect to login page
    window.location.href = "/dashboard"; // Redirect user after successful signup

    return token; // Return the token (optional)
  } catch (error) {
    console.error("Signup API Error:", error);
    throw error.response ? error.response.data : { message: "Signup failed" };
  }
};