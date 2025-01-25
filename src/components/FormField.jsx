import React from "react";
import { Box, TextField } from "@mui/material";

const FormField = ({ label, type = "text", value, onChange, icon: Icon }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      {Icon && <Icon sx={{ color: "primary.main" }} />}
      <TextField label={label} type={type} value={value} onChange={onChange} fullWidth />
    </Box>
  );
};

export default FormField;
