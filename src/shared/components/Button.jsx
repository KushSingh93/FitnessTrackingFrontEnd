import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ text, onClick, type = "button" }) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant="contained" // Use "contained", "outlined", or "text"
      fullWidth // Makes the button take up the full width
      sx={{
        background: "linear-gradient(45deg, #4f46e5, #9333ea)", // Gradient from indigo to purple
        color: "white",
        fontWeight: "bold",
        padding: "12px 0",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          opacity: 0.9,
          boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
        },
        transition: "all 0.3s ease",
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;