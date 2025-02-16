import React from "react";

const ExerciseList = ({
  exercises,
  favoriteExercises,
  searchQuery,
  onSearchChange,
  onAddExercise,
  onAddCustomExercise,
  onToggleFavorite,
  bodyPartIcons, // Receive bodyPartIcons as a prop
}) => {
  // Filter and sort exercises (favorites on top)
  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    return (
      favoriteExercises.has(b.exerciseId) - favoriteExercises.has(a.exerciseId)
    );
  });

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide uppercase mb-6">
        Arsenal
      </h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search exercises..."
        value={searchQuery}
        onChange={onSearchChange}
        className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
      />

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
          sortedExercises.map((exercise) => (
            <div
              key={exercise.exerciseId}
              className="bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition duration-200 p-4 mb-2 flex items-center justify-between" // Card styling
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
                  <p className="text-sm text-gray-400">({exercise.bodyPart})</p>
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
                      ? "text-yellow-500" // Active state: sky blue
                      : "text-gray-400 hover:text-sky-500" // Inactive state: gray with sky blue hover
                  }`}
                >
                  {favoriteExercises.has(exercise.exerciseId) ? "★" : "☆"}
                </button>

                {/* Add to Workout Button */}
                <button
                  onClick={() => onAddExercise(exercise)}
                  className="text-teal-400 text-lg hover:text-teal-500" // Teal color
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
