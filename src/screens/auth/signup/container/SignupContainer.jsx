import React, { Component } from "react";
import { signup } from "../api";  
import SignupForm from "../components/SignupForm";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../assets/images/ironLogLogo.png";  

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

    try {
      const response = await signup({ 
        name: this.state.name, 
        email: this.state.email, 
        password: this.state.password 
      });

      const token = response.token || response.data?.token; 

      if (token) {
        localStorage.setItem("token", token);  
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
    return (
      <SignupForm
        name={this.state.name}
        email={this.state.email}
        password={this.state.password}
        error={this.state.error}
        loading={this.state.loading}
        handleChange={this.handleChange}
        handleSignup={this.handleSignup}
        logo={Logo}
      />
    );
  }
}

export default function SignupContainerWithNavigation() {
  const navigate = useNavigate();
  return <SignupContainer navigate={navigate} />;
}
