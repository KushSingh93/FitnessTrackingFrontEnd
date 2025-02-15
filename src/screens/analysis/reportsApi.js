import axios from "axios";

const API_URL = "http://localhost:3000/api/reports";

export const getWorkoutSummary = async (token, period) => {
  try {
    const response = await axios.get(`${API_URL}/summary`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { period }, // weekly, monthly, yearly
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching workout summary:", error);
    throw error;
  }
};
