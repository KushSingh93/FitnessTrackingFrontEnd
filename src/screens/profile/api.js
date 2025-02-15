import { apiClient } from "../../lib/api";

//  Fetch User Profile
export const getUserProfile = async (token) => 
  apiClient.get("/users/profile", { headers: { Authorization: `Bearer ${token}` } })
  .then(res => res.data);

//  Update User Profile
export const updateUserProfile = async (token, data) => 
  apiClient.put("/users/profile", data, { headers: { Authorization: `Bearer ${token}` } })
  .then(res => res.data);

//  Logout User
export const logoutUser = () => {
    localStorage.removeItem("token");  
    window.location.href = "/login";  
};

// Fetch User Streak
export const getUserStreak = async (token) => 
  apiClient.get("/streaks/getStreak", { headers: { Authorization: `Bearer ${token}` } })
  .then(res => res.data)
  .catch(error => {
    console.error("Error fetching streak:", error);
    return { streakCount: 0, startDate: null }; // Default response on error
  });
