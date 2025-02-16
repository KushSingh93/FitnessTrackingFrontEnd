import React, { Component } from "react";
import { getUserProfile, updateUserProfile, logoutUser } from "../api";
import { ProfileDetails, EditProfileForm } from "../components";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'; // Import js-cookie

class ProfileContainer extends Component {
  state = {
    userData: null,
    formData: {},
    isEditing: false,
    loading: true,
    error: "",
  };

  async componentDidMount() {
    const token = Cookies.get("token"); // Get token from cookie
    if (!token) {
      this.props.navigate("/login");
      return;
    }

    try {
      const data = await getUserProfile(); 
      this.setState({
        userData: data,
        formData: {
          name: data.name || "",
          age: data.age || "",
          weightKg: data.weightKg || "",
          heightCm: data.heightCm || "",
          gender: data.gender || "MALE",
        },
        loading: false,
      });
    } catch (error) {
      this.setState({ error: "Failed to fetch user profile.", loading: false });
    }
  }

  handleChange = (e) => {
    this.setState({
      isEditing: true,
      formData: { ...this.state.formData, [e.target.name]: e.target.value },
    });
  };

  calculateBMI = () => {
    const { weightKg, heightCm } = this.state.formData;
    if (!weightKg || !heightCm) return "N/A";
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  getBMICategory = () => {
    const bmi = this.calculateBMI();
    if (bmi === "N/A") return "N/A";
    if (bmi < 18.5) return "Underweight 🟡";
    if (bmi < 25) return "Normal Weight ✅";
    if (bmi < 30) return "Overweight 🟠";
    return "Obese 🔴";
  };

  handleUpdate = async () => {
    try {
      await updateUserProfile(this.state.formData); // No token needed here
      this.setState({
        userData: { ...this.state.userData, ...this.state.formData },
        isEditing: false,
      });
    } catch (error) {
      this.setState({ error: "Failed to update profile." });
    }
  };

  handleLogout = () => {
    logoutUser();
    Cookies.remove('token', { path: '/' }); // Remove the token cookie
    this.props.navigate("/login");
  };

  render() {
    const { userData, formData, isEditing, loading, error } = this.state;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-6">
        {/* Back Button */}
        <button
          className="absolute top-4 left-4 bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition duration-200"
          onClick={() => this.props.navigate("/dashboard")}
        >
          <FaArrowLeft className="text-white text-xl" />
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-xl text-gray-300">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-red-400 text-xl">{error}</p>
          </div>
        ) : isEditing ? (
          <EditProfileForm
            formData={formData}
            handleChange={this.handleChange}
            calculateBMI={this.calculateBMI}
            getBMICategory={this.getBMICategory}
            handleSave={this.handleUpdate}
          />
        ) : (
          <ProfileDetails
            userData={userData}
            onEdit={() => this.setState({ isEditing: true })}
            handleLogout={this.handleLogout}
            calculateBMI={this.calculateBMI}
            getBMICategory={this.getBMICategory}
          />
        )}
      </div>
    );
  }
}

export default function ProfileContainerWithNavigation() {
  const navigate = useNavigate();
  return <ProfileContainer navigate={navigate} />;
}
