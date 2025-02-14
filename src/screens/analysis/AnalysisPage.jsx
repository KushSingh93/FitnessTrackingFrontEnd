import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkoutSummary } from "../../api/reportsApi";
import CaloriesChart from "./components/CaloriesChart";
import BodyPartChart from "./components/BodyPartChart";
import { getUserStreak } from "../../api/userApi";
import TimelineDropdown from "./components/TimelineDropdown";
import { FaArrowLeft } from "react-icons/fa";

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");

        setLoading(true);
        const data = await getWorkoutSummary(token, selectedPeriod);
        setAnalysisData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [selectedPeriod]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);

        const [summaryData, streakData] = await Promise.all([
          getWorkoutSummary(token, selectedPeriod),
          getUserStreak(token),
        ]);

        setAnalysisData(summaryData);
        setStreak(streakData.streakCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center p-6 w-full">
      {/* 🔙 Back Button + 🔥 Streak + Timeline Dropdown */}
      <div className="flex justify-between w-full container mx-auto px-12 items-center mb-6 relative">
        {/* ✅ Back Button (Navigates to Dashboard) */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute left-0 top-0 p-2 bg-gray-700 bg-opacity-50 rounded-full hover:bg-gray-600 transition duration-200"
          style={{
            marginLeft: "0", // Remove margin
            marginTop: "0", // Remove margin
            left: "10px", // Align with the page edge
            top: "10px",
          }}
        >
          <FaArrowLeft className="text-white text-lg" />
        </button>

        {/* 🔥 Streak Icon */}
        <div className="relative w-12 h-12">
          <img
            src="/src/assets/images/fireFinal.png"
            alt="Streak"
            className="w-12 h-12 animate-pulse"
          />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
            {streak}
          </span>
        </div>

        {/* 📅 Timeline Dropdown */}
        <TimelineDropdown
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          className="bg-gray-700 bg-opacity-70 hover:bg-opacity-90 text-white rounded-md shadow-md transition duration-200"
        />
      </div>

      {/* 📊 Workout Summary - Centered & More Visible */}
      {loading ? (
        <p className="text-gray-300 italic">
          Loading analysis... Please wait.{" "}
          <span className="animate-pulse">.</span>
          <span className="animate-pulse">.</span>
          <span className="animate-pulse">.</span>
        </p>
      ) : error ? (
        <p className="text-red-500 font-semibold">Error: {error}</p>
      ) : (
        <>
          {/*  Total Workouts Display */}
          <div className="bg-gray-700 bg-opacity-30 rounded-xl shadow-md p-6 mb-10 w-full container mx-auto px-12">
            <p className="text-2xl font-semibold text-center text-gray-200 mb-2">
              <i className="fas fa-dumbbell mr-2 text-indigo-300"></i> Total
              Workout Sessions
            </p>
            <p className="text-5xl font-bold text-center text-white">
              {analysisData.totalWorkouts}
            </p>
          </div>

          {/* 📈 Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full container mx-auto px-12">
            {/* Calories Chart Section */}
            <div className="bg-gray-800 bg-opacity-40 p-6 rounded-2xl shadow-lg w-full flex flex-col">
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-100">
                🔥 Calories Burned Over Time
              </h3>
              <div className="h-[400px]">
                <CaloriesChart data={analysisData.dailyCalories} />
              </div>

              {/* "Total Calories Burnt" Below Chart */}
              <p className="mt-4 text-xl text-green-400 font-semibold text-center">
                Total Calories:
                <span className="text-green-300 ml-1">
                  {analysisData.totalCaloriesBurned} kcal
                </span>
              </p>
            </div>

            {/* Body Part Chart Section */}
            <div className="bg-gray-800 bg-opacity-40 p-6 rounded-2xl shadow-lg w-full flex flex-col">
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-100">
                💪 Most Trained Body Parts
              </h3>
              <div className="h-[400px]">
                <BodyPartChart data={analysisData.bodyPartFrequency} />
              </div>

              {/* "Most Trained Body Part" Below Chart */}
              <p className="mt-4 text-xl text-blue-400 font-semibold text-center">
                Most Trained Body Part:
                <span className="text-blue-300 ml-1">
                  {analysisData.mostTrainedBodyPart}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisPage;
