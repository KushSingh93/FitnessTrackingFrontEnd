import { apiClient } from "../../lib/api"; // Import centralized API client

export const getWorkoutSummary = async (token, period) => {
  try {
    const response = await apiClient.get(`/reports/summary`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { period }, // weekly, monthly, yearly
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching workout summary:", error);
    throw error;
  }
};
