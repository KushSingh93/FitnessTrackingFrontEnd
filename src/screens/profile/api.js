import { apiClient } from "../../lib/api";
import Cookies from 'js-cookie';

//  Fetch User Profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

//  Update User Profile
export const updateUserProfile = async (data) => {
  try {
    const response = await apiClient.put("/users/profile", data);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

//  Logout User
export const logoutUser = () => {
  Cookies.remove('token', { path: '/' }); // Remove the token cookie
  window.location.href = "/login";
};

// Fetch User Streak
export const getUserStreak = async () => {
  try {
    const response = await apiClient.get("/streaks/getStreak");
    return response.data;
  } catch (error) {
    console.error("Error fetching streak:", error);
    return { streakCount: 0, startDate: null }; // Default response on error
  }
};
