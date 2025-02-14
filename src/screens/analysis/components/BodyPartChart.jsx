// BodyPartChart.js
import React from "react"; // Remove useEffect import
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement // Keep this registration
);

const BodyPartChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Frequency",
        data: Object.values(data),
        backgroundColor: ["red", "blue", "yellow", "green", "purple", "orange"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Most Trained Body Parts" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2">Most Trained Body Parts</h3>
      <div style={{ height: "300px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BodyPartChart;