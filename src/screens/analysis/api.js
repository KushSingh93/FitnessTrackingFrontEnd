import { apiClient } from "../../lib/api"; // Import centralized API client

export const getWorkoutSummary = async (period) => {
  try {
    const response = await apiClient.get(`/reports/summary`, {
      params: { period }, // weekly, monthly, yearly
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching workout summary:", error);
    throw error;
  }
};
