import React, { Component } from "react";
import { getWorkoutSummary } from "../api";
import { getUserStreak } from "../../profile/api";
import AnalysisComponent from "../components";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import Swal from "sweetalert2";

class AnalysisContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPeriod: "monthly",
      analysisData: null,
      loading: true,
      streak: 0,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedPeriod !== this.state.selectedPeriod) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true });

      const [summaryData, streakData] = await Promise.all([
        getWorkoutSummary(this.state.selectedPeriod),
        getUserStreak(),
      ]);

      this.setState({
        analysisData: summaryData,
        streak: streakData,
        loading: false,
      });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  setSelectedPeriod = (newPeriod) => {
    this.setState({ selectedPeriod: newPeriod });
  };

  handleStreakClick = () => {
    const { streak } = this.state;
    if (streak && streak.startDate) {
      Swal.fire({
        title: `Streak started on: ${streak.startDate}`,
        icon: "info",
        confirmButtonText: "Cool",
        customClass: {
          popup: "custom-popup-dark-blue",
          confirmButton: "custom-confirm-button-dark-blue",
        },
        background: "#1a1a2e",
        color: "#ffffff",
      });
    } else {
      Swal.fire({
        title: " No Streak",
        text: "No streak start date available.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          popup: "custom-popup-dark-blue",
          confirmButton: "custom-confirm-button-dark-blue",
        },
        background: "#1a1a2e",
        color: "#ffffff",
      });
    }
  };

  render() {
    return (
      <AnalysisComponent
        {...this.state}
        setSelectedPeriod={this.setSelectedPeriod}
        handleStreakClick={this.handleStreakClick}
      />
    );
  }
}

export default function AnalysisContainerWithNavigation(props) {
  const navigate = useNavigate();
  return <AnalysisContainer {...props} navigate={navigate} />;
}
