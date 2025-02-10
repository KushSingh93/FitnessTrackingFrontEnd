import React, { useEffect, useState } from "react";
import { getAllExercises } from "../api/authApi";

const Arsenal = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getAllExercises();
        setExercises(data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("Failed to load exercises.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-md w-full">
      <h2 className="text-white text-lg font-bold mb-3">Arsenal</h2>

      <button className="w-full py-2 mb-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
        + Add Custom Exercise
      </button>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : exercises.length === 0 ? (
        <p className="text-gray-400">No exercises available.</p>
      ) : (
        <ul>
          {exercises.map((exercise) => (
            <li
              key={exercise.id}
              className="flex justify-between items-center p-3 mb-2 bg-gray-800 rounded-lg text-white shadow"
            >
              {exercise.name} - {exercise.calories} kcal
              <button className="text-green-400 hover:text-green-500 transition text-lg">+</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Arsenal;
