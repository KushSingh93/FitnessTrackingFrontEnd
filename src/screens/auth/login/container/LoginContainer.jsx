import React, { Component } from "react";
import { login } from "../api";  
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../assets/images/ironLogLogo.png";  

class LoginContainer extends Component {
  state = {
    email: "",
    password: "",
    error: "",
    loading: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async () => {
    this.setState({ loading: true, error: "" });

    try {
      const token = await login({ email: this.state.email, password: this.state.password });

      if (token) {
        localStorage.setItem("token", token);  
        this.props.navigate("/dashboard");  
      } else {
        throw new Error("No token received from API.");
      }
    } catch (err) {
      this.setState({ error: err.message || "Login failed." });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <LoginForm
        email={this.state.email}
        password={this.state.password}
        error={this.state.error}
        loading={this.state.loading}
        handleChange={this.handleChange}
        handleLogin={this.handleLogin}
        logo={Logo}
      />
    );
  }
}

export default function LoginContainerWithNavigation() {
  const navigate = useNavigate();
  return <LoginContainer navigate={navigate} />;
}
