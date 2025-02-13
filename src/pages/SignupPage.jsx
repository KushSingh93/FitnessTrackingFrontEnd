import React, { useState } from "react";
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";
import { signup } from "../api/authApi.js";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/ironLogLogo.png"; // 

const SignupPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signup(user);
      //alert("Signup successful! Redirecting to login...");
      navigate("/login"); // Redirect to Login
    } catch (err) {
      setError(err.message || "Signup failed.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg w-96">
        {/* ✅ Displaying the Logo */}
        <img src={Logo} alt="Iron Log" className="w-32 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-400 text-center">{error}</p>}
        <InputField type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} />
        <InputField type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} />
        <InputField type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} />
        <Button text={loading ? "Signing Up..." : "Sign Up"} onClick={handleSignup} />
        <p className="text-center text-gray-400 mt-4">
          Already a member? <a href="/login" className="text-indigo-400 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
