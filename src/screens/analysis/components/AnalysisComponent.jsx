import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import CaloriesChart from "./CaloriesChart";
import BodyPartChart from "./BodyPartChart";
import TimelineDropdown from "./TimelineDropdown";

const AnalysisComponent = ({
  analysisData,
  loading,
  error,
  streak,
  selectedPeriod,
  setSelectedPeriod,
  handleStreakClick,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center p-6 w-full">
        
      {/* Header Section */}
      <div className="flex justify-between w-full container mx-auto px-12 items-center mb-6 relative">
        <button
          onClick={() => window.history.back()}
          className="absolute left-0 top-0 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
        >
          <FaArrowLeft className="text-white text-lg" />
        </button>

        <button onClick={handleStreakClick} className="relative w-12 h-12 focus:outline-none">
          <img src="/src/assets/images/fireFinal.png" alt="Streak" className="w-12 h-12 animate-pulse" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
            {streak?.streakCount || 0}
          </span>
        </button>

        <TimelineDropdown selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
      </div>

      {/* Main Content */}
      {loading ? (
        <p className="text-gray-300 italic">Loading analysis...</p>
      ) : error ? (
        <p className="text-red-500 font-semibold">Error: {error}</p>
      ) : (
        <>
          <div className="bg-gray-700 rounded-xl shadow-md p-6 mb-10 w-full container mx-auto px-12">
            <p className="text-2xl font-semibold text-center">Total Workouts</p>
            <p className="text-5xl font-bold text-center">{analysisData.totalWorkouts}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full container mx-auto px-12">
            <CaloriesChart data={analysisData.dailyCalories} totalCalories={analysisData.totalCaloriesBurned} />
            <BodyPartChart data={analysisData.bodyPartFrequency} mostTrainedBodyPart={analysisData.mostTrainedBodyPart} />
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisComponent;
