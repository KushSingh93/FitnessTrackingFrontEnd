import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Private from "../components/private";
import Cookies from 'js-cookie';

class PrivateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: !!Cookies.get('token'),
    };
  }

  render() {
    if (!this.state.isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <Private />;
  }
}

export default PrivateContainer;
