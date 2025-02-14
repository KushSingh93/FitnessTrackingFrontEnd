import React from "react";

const TimelineDropdown = ({ selectedPeriod, setSelectedPeriod }) => {
  return (
    <select
      className="bg-gray-700 text-white p-2 rounded"
      value={selectedPeriod}
      onChange={(e) => setSelectedPeriod(e.target.value)}
    >
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
    </select>
  );
};

export default TimelineDropdown;
