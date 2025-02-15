import React from "react";

const ExerciseList = ({
  exercises,
  favoriteExercises,
  searchQuery,
  onSearchChange,
  onAddExercise,
  onAddCustomExercise,
  onToggleFavorite, //  Added favorite toggle
}) => {
  // Filter and sort exercises (favorites on top)
  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    return favoriteExercises.has(b.exerciseId) - favoriteExercises.has(a.exerciseId);
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
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
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
              className="flex justify-between bg-gray-700 p-3 rounded mb-2"
            >
              <span>
                {exercise.exerciseName}{" "}
                <span className="text-gray-400">({exercise.bodyPart})</span>{" "}
                - {exercise.caloriesBurntPerRep} kcal
              </span>
              <div className="flex items-center space-x-4">
                {/* Favorite Button */}
                <button
                  onClick={() => onToggleFavorite(exercise)}
                  className={`text-lg hover:text-red-500 transition ${
                    favoriteExercises.has(exercise.exerciseId) ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  {favoriteExercises.has(exercise.exerciseId) ? "❤️" : "🤍"}
                </button>

                {/* Add to Workout Button */}
                <button
                  onClick={() => onAddExercise(exercise)}
                  className="text-green-400 text-lg hover:text-green-500"
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
