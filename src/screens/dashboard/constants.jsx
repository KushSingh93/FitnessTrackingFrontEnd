import { createTheme } from "@mui/material/styles";
import chestIcon from "/src/assets/images/chest.png";
import legsIcon from "/src/assets/images/legs.png";
import armsIcon from "/src/assets/images/arms.png";
import backIcon from "/src/assets/images/back.png";
import absIcon from "/src/assets/images/abs.png";
import shoulderIcon from "/src/assets/images/shoulder.png";

export const BODY_PARTS = ["arms", "back", "legs", "shoulder", "chest", "abs"];

export const BODY_PART_ICONS = {
  chest: chestIcon,
  legs: legsIcon,
  arms: armsIcon,
  back: backIcon,
  abs: absIcon,
  shoulder: shoulderIcon,
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
          "&.Mui-selected": {
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          },
          "&.Mui-disabled": {
            color: "rgba(255, 255, 255, 0.3)",
          },
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
        },
        viewTransitionContainer: {
          backgroundColor: "#1e293b",
        },
        header: {
          color: "#fff",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
  },
});
