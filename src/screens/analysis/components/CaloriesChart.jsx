import React from "react";
import { CALORIES_BURNED_DATASET } from "../constants";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CaloriesChart = ({ data, totalCalories }) => {
  if (!data || Object.keys(data).length === 0)
    return <p className="text-gray-400 italic">No data available</p>;

  const sortedData = Object.entries(data).sort(
    (a, b) => new Date(a[0]) - new Date(b[0])
  );

  const chartData = {
    labels: sortedData.map(([date]) => date),
    datasets: [
      {
        ...CALORIES_BURNED_DATASET,
        data: sortedData.map(([, value]) => value),
      },
    ],
  };

  // Controls the behavior and appearance of a chart.

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} kcal`,
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: { display: true },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2">Calories Burned Over Time</h3>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
      <p className="mt-4 text-xl text-white font-semibold text-center">
        Total Calories:{" "}
        <span className="text-gray-300 ml-1">{totalCalories} kcal</span>
      </p>
    </div>
  );
};

export default CaloriesChart;
