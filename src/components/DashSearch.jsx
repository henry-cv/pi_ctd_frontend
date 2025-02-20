import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";

export default function DashSearch() {
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 200,
        borderRadius: "30px",
        height: "45px",
        boxShadow: "5px 5px 10px -7px rgba(0, 0, 0, 0.67)",
        border: "1px solid #D6D6D6",
      }}
    >
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Buscar" />
    </Paper>
  );
}
