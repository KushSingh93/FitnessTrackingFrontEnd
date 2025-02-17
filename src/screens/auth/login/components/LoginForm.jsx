import React from "react";
import InputField from "../../../../shared/components/InputField";
import Button from "../../../../shared/components/Button";

const LoginForm = ({
  email,
  password,
  error,
  loading,
  handleChange,
  handleLogin,
  logo,
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg w-96">
        <img src={logo} alt="Iron Log" className="w-32 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-center mb-4">
          Welcome Back!
        </h2>
        {error && <p className="text-red-400 text-center">{error}</p>}
        <InputField
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
        <InputField
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <Button
          text={loading ? "Logging in..." : "Login"}
          onClick={handleLogin}
        />
        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
