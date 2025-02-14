import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  logoutUser,
} from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; 

const ProfileManagementPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(token); // ✅ No userId, only token
        setUserData(data);
        setFormData({
          name: data.name || "",
          age: data.age || "",
          weightKg: data.weightKg || "",
          heightCm: data.heightCm || "",
          gender: data.gender || "MALE",
        });
      } catch (error) {
        setError("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setIsEditing(true);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Calculate BMI
  const calculateBMI = () => {
    if (!formData.weightKg || !formData.heightCm) return null;
    const heightM = formData.heightCm / 100;
    return (formData.weightKg / (heightM * heightM)).toFixed(1);
  };

  //  Get BMI category
  const getBMICategory = () => {
    const bmi = calculateBMI();
    if (!bmi) return "N/A";
    if (bmi < 18.5) return "Underweight 🟡";
    if (bmi < 25) return "Normal Weight ✅";
    if (bmi < 30) return "Overweight 🟠";
    return "Obese 🔴";
  };

  //  Handle profile update
  const handleUpdate = async () => {
    try {
      await updateUserProfile(token, formData);
      setUserData({ ...userData, ...formData });
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile.");
    }
  };

  //  Handle Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      setError("Failed to log out.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
         {/* 🔙 Back Button */}
      <button
        className="absolute top-4 left-4 bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition duration-200"
        onClick={() => navigate("/dashboard")}
      >
        <FaArrowLeft className="text-white text-xl" />
      </button>
      <h2 className="text-2xl font-bold mb-6">👤 Profile Management</h2>

      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          {/* Profile Form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <label className="block text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white mb-3"
            />

            <label className="block text-gray-300">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white mb-3"
            />

            <label className="block text-gray-300">Weight (kg)</label>
            <input
              type="number"
              name="weightKg"
              value={formData.weightKg}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white mb-3"
            />

            <label className="block text-gray-300">Height (cm)</label>
            <input
              type="number"
              name="heightCm"
              value={formData.heightCm}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white mb-3"
            />

            <label className="block text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white mb-3"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>

            {/* BMI Display */}
            <p className="mt-3 text-center text-lg">
              <strong>Your BMI:</strong> {calculateBMI()} ({getBMICategory()})
            </p>

            {/* Save Button */}
            <button
              className={`w-full py-2 mt-4 rounded ${
                isEditing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!isEditing}
              onClick={handleUpdate}
            >
              Save Changes
            </button>

            {/* Logout Button */}
            <button
              className="w-full py-2 mt-4 bg-red-500 hover:bg-red-600 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileManagementPage;
