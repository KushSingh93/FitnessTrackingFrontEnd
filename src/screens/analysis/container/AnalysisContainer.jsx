import React, { Component } from "react";
import { getWorkoutSummary } from "../api";
import { getUserStreak } from "../../profile/api";
import AnalysisComponent from "../components";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'; // Import js-cookie

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
      alert(`🔥 Your streak started on: ${streak.startDate}`);
    } else {
      alert("🔥 No streak start date available.");
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
