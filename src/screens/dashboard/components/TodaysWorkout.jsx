import React from "react";
import { FaTrash } from "react-icons/fa"; 
import { FaDumbbell } from "react-icons/fa";

const TodaysWorkout = ({
  exercises,
  onRemoveExercise,
  onRepeatWorkout,
  onDateSelect,
}) => {
  const totalCalories = exercises.reduce(
    (sum, exercise) =>
      sum + (exercise.caloriesBurntPerRep || 0) * exercise.sets * exercise.reps,
    0
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide uppercase mb-6">
        TODAY'S WORKOUT
      </h2>

      {exercises.length === 0 ? (
        <p className="text-gray-400 italic">No exercises added yet.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {exercises.map((exercise, index) => (
              <li
                key={index}
                className="bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition duration-200 p-4 flex justify-between items-center"
              >
                {/* Exercise Info */}
                <div className="flex items-center">
                  {/* Exercise Icon (Example) */}
                  <span className="mr-2 text-white">
                    <FaDumbbell />
                  </span>

                  <div>
                    <div className="font-medium text-white">
                      {exercise.exerciseName}
                    </div>
                    <div className="text-sm text-gray-400">
                      {exercise.sets} sets, {exercise.reps} reps
                    </div>
                  </div>
                </div>

                {/* Calories and Remove Button */}
                <div className="flex items-center">
                  <span className="text-gray-400 mr-3 text-sm">
                    {(
                      exercise.caloriesBurntPerRep *
                      exercise.sets *
                      exercise.reps
                    ).toFixed(2)}{" "}
                    kcal
                  </span>
                  <button
                    onClick={() => onRemoveExercise(exercise.workoutExerciseId)}
                    className="text-red-300 hover:text-red-400 transition" // Muted red
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 py-2 px-4 bg-gray-700 rounded-md flex justify-between items-center">
            <span className="text-lg font-semibold text-white">
              Total Calories:
            </span>
            <span className="text-2xl font-bold text-sky-400">
              {" "}
              {totalCalories} kcal
            </span>
          </div>
        </>
      )}

      <button
        onClick={onRepeatWorkout}
        className="w-full mt-6 bg-gradient-to-r from-sky-400 to-sky-500 hover:bg-gradient-to-l hover:shadow-md text-white py-3 rounded-lg"
      >
        Repeat Workout
      </button>
    </div>
  );
};

export default TodaysWorkout;
