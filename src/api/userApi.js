import axios from "axios";

const API_URL = "http://localhost:3000/api/users";
const API_BASE_URL = "http://localhost:3000/api/streaks";

//  Fetch User Profile (using token)
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch profile.");
  }
};

//  Update User Profile (using token)
export const updateUserProfile = async (token, userData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile.");
  }
};

// ✅ Logout user
export const logoutUser = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to log out.");
  }
};

// Fetch user streak
export const getUserStreak = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getStreak`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching streak:", error);
      return { streakCount: 0, startDate: null }; // Default response if error
    }
  };