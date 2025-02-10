import React, { useState } from "react";

const AddExerciseModal = ({ exercise, onClose, onAdd }) => {
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const handleSubmit = () => {
    if (!sets || !reps) {
      alert("Please enter sets and reps.");
      return;
    }
    onAdd({ ...exercise, sets, reps });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-xl font-bold mb-3">{exercise.name}</h2>
        <label className="block mb-2">
          Sets: <input type="number" className="bg-gray-800 p-2 rounded" value={sets} onChange={(e) => setSets(e.target.value)} />
        </label>
        <label className="block mb-4">
          Reps: <input type="number" className="bg-gray-800 p-2 rounded" value={reps} onChange={(e) => setReps(e.target.value)} />
        </label>
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-red-500 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 rounded">Done</button>
        </div>
      </div>
    </div>
  );
};

export default AddExerciseModal;
