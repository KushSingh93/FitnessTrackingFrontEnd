import React, { Component } from "react";
import { signup } from "../api";
import SignupForm from "../components/SignupForm";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../assets/images/ironLogLogo.png";
import Cookies from 'js-cookie'; // Import js-cookie

class SignupContainer extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSignup = async () => {
    this.setState({ loading: true, error: "" });
    const { name, email, password } = this.state;

    try {
      // Send the correct payload structure
      const response = await signup({
        name,
        email,
        password,
      });

      const token = response.token || response.data?.token;

      if (token) {
        Cookies.set('token', token, { expires: 7, path: '/' }); // Store token in cookie
        console.log("Signup successful, Token stored:", token);
        this.props.navigate("/login");
      } else {
        throw new Error("No token received from API.");
      }
    } catch (err) {
      this.setState({ error: err.message || "Signup failed." });
    }

    this.setState({ loading: false });
  };

  render() {
    const { name, email, password, error, loading } = this.state;
    const { handleChange, handleSignup } = this;
    return (
      <SignupForm
        name={name}
        email={email}
        password={password}
        error={error}
        loading={loading}
        handleChange={handleChange}
        handleSignup={handleSignup}
        logo={Logo}
      />
    );
  }
}

export default function SignupContainerWithNavigation() {
  const navigate = useNavigate();
  return <SignupContainer navigate={navigate} />;
}