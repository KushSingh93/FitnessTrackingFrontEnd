import React from "react";
import { TextField } from "@mui/material";

const InputField = ({ type, name, placeholder, value, onChange }) => {
  return (
    <TextField
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      variant="outlined" // Use "outlined", "filled", or "standard"
      fullWidth // Makes the input take up the full width
      sx={{
        marginTop: "8px",
        marginBottom: "16px",
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#1e1e1e", // Dark background
          color: "white", // White text
          borderRadius: "8px",
          "& fieldset": {
            borderColor: "#4f46e5", // Indigo border
          },
          "&:hover fieldset": {
            borderColor: "#9333ea", // Purple border on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "#9333ea", // Purple border when focused
          },
        },
        "& .MuiInputLabel-root": {
          color: "#9ca3af", // Gray label
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#9333ea", // Purple label when focused
        },
      }}
    />
  );
};

export default InputField;