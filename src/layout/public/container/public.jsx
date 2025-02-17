import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Public from "../components/public";
import Cookies from 'js-cookie';

class PublicContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: !!Cookies.get('token'),
    };
  }

  render() {
    if (this.state.isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Public />;
  }
}

export default PublicContainer;
