import React from "react";
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

// ✅ Register ALL required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CaloriesChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0)
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold mb-2">Calories Burnt Over Time</h3>
        <p className="text-gray-400">No data available</p>
      </div>
    );

  // ✅ Sort dates in ascending order
  const sortedData = Object.entries(data)
    .sort((a, b) => new Date(a[0]) - new Date(b[0])) // Sort by date
    .reduce((acc, [date, value]) => {
      acc.labels.push(date);
      acc.values.push(value);
      return acc;
    }, { labels: [], values: [] });

  const chartData = {
    labels: sortedData.labels, // Sorted Dates
    datasets: [
      {
        label: "Calories Burned",
        data: sortedData.values,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // ✅ Smooth curve
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Calories Burnt Over Time" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} kcal`, // ✅ Show kcal unit
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} kcal`, // ✅ Adds "kcal" to Y-axis
        },
      },
      x: {
        ticks: {
          autoSkip: true, // ✅ Prevents clutter on X-axis
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2">Calories Burnt Over Time</h3>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CaloriesChart;
