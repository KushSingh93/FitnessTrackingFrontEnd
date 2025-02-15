import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BodyPartChart = ({ data, mostTrainedBodyPart }) => {
  if (!data || Object.keys(data).length === 0) return <p className="text-gray-400 italic">No data available</p>;

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Frequency",
        data: Object.values(data),
        backgroundColor: "rgba(0, 191, 255, 0.7)", // ✅ Using a single muted blue
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
      x: { ticks: { autoSkip: false } },
    },
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Most Trained Body Parts" },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2">Most Trained Body Parts</h3>
      <div style={{ height: "300px" }}>
        <Bar data={chartData} options={options} />
      </div>
      <p className="mt-4 text-xl text-blue-400 font-semibold text-center">
        Most Trained Body Part: <span className="text-blue-300 ml-1">{mostTrainedBodyPart}</span>
      </p>
    </div>
  );
};

export default BodyPartChart;
