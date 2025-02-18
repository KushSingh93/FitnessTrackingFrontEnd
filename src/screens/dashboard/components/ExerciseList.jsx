import React, { useState } from "react";

const ExerciseList = ({
  exercises,
  favoriteExercises,
  searchQuery,
  onSearchChange,
  onAddExercise,
  onAddCustomExercise,
  onToggleFavorite,
  bodyPartIcons,
  currentUserId,
  onDeleteExercise,
}) => {
  const [visibleExercises, setVisibleExercises] = useState(7);
  const [selectedBodyPart, setSelectedBodyPart] = useState(""); // New state for selected body part

  // Array of available body parts
  const bodyParts = ["BACK", "CHEST", "LEGS", "SHOULDER", "ARMS", "ABS"];

  // Filter exercises by search query and selected body part
  const filteredExercises = exercises.filter((exercise) => {
    const searchMatch =
      exercise.exerciseName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase());
    const bodyPartMatch =
      selectedBodyPart === "" ||
      exercise.bodyPart.toUpperCase() === selectedBodyPart; // case-insensitive comparison

    return searchMatch && bodyPartMatch;
  });

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    return (
      favoriteExercises.has(b.exerciseId) - favoriteExercises.has(a.exerciseId)
    );
  });

  const loadMoreExercises = () => {
    setVisibleExercises((prevVisibleExercises) => prevVisibleExercises + 5);
  };

  const handleBodyPartChange = (e) => {
    setSelectedBodyPart(e.target.value);
    setVisibleExercises(7); // Reset the number of visible exercises
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide uppercase mb-6">
        Arsenal
      </h2>

      {/* Search and Filter Container */}
      <div className="flex mb-4 space-x-2">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-1/2 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />

        {/* Body Part Dropdown */}
        <select
          value={selectedBodyPart}
          onChange={handleBodyPartChange}
          className="w-1/2 p-2 rounded-lg bg-gray-700 text-white"
        >
          <option value="">All Body Parts</option>
          {bodyParts.map((part) => (
            <option key={part} value={part}>
              {part}
            </option>
          ))}
        </select>
      </div>

      {/* Add Custom Exercise Button */}
      <button
        onClick={onAddCustomExercise}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg mb-4"
      >
        + Add Custom Exercise
      </button>

      {/* Exercise List */}
      <div className="mt-4">
        {sortedExercises.length === 0 ? (
          <p className="text-gray-400">No exercises found.</p>
        ) : (
          sortedExercises.slice(0, visibleExercises).map((exercise) => (
            <div
              key={exercise.exerciseId}
              className="bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition duration-200 p-4 mb-2 flex items-center justify-between"
            >
              <div className="flex items-center">
                {/* Body Part Icon */}
                <img
                  src={
                    bodyPartIcons[exercise.bodyPart.toLowerCase()] ||
                    bodyPartIcons.default
                  }
                  alt={exercise.bodyPart}
                  className="w-6 h-6 mr-2"
                />

                {/* Exercise Name and Muscle Group */}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {exercise.exerciseName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    ({exercise.bodyPart})
                  </p>
                </div>
              </div>

              {/* Calories, Star, and Add Button */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">
                  {exercise.caloriesBurntPerRep} kcal
                </span>

                {/* Favorite Button (Star) */}
                <button
                  onClick={() => onToggleFavorite(exercise)}
                  className={`text-lg transition ${
                    favoriteExercises.has(exercise.exerciseId)
                      ? "text-yellow-500"
                      : "text-gray-400 hover:text-sky-500"
                  }`}
                >
                  {favoriteExercises.has(exercise.exerciseId) ? "★" : "☆"}
                </button>

                {/* Add to Workout Button */}
                <button
                  onClick={() => onAddExercise(exercise)}
                  className="text-teal-400 text-lg hover:text-teal-500"
                >
                  +
                </button>
                {/* Delete Button (Conditionally Rendered) */}
                {exercise.userId === currentUserId && (
                  <button
                    onClick={() => onDeleteExercise(exercise.exerciseId)}
                    className="text-red-300 text-sm hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {visibleExercises < sortedExercises.length && (
        <button
          onClick={loadMoreExercises}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mt-4"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default ExerciseList;
