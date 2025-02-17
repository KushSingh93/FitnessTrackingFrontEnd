import React from "react";
import InputField from "../../../../shared/components/InputField";
import Button from "../../../../shared/components/Button";

const SignupForm = ({
  name,
  email,
  password,
  error,
  loading,
  handleChange,
  handleSignup,
  logo,
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg w-96">
        <img src={logo} alt="Iron Log" className="w-32 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-400 text-center">{error}</p>}
        <InputField
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={handleChange}
        />
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
          text={loading ? "Signing Up..." : "Sign Up"}
          onClick={handleSignup}
        />
        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
