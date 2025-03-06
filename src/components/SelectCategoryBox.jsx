import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";

export default function SelectCategoryBox() {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={age}
        onChange={handleChange}
        displayEmpty
        input={<InputBase sx={{ border: "none" }} />}
        className="category_box_search"
        inputProps={{ "aria-label": "Without label" }}
        sx={{
          fontFamily: "outfit",
          border: "none",
          "& .MuiSelect-select": {
            border: "none",
            padding: "0px",
            fontFamily: "outfit",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            fontFamily: "outfit",
            border: "none",
          },
        }}
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        <MenuItem value={10}>Cultural</MenuItem>
        <MenuItem value={20}>Gastronomía</MenuItem>
        <MenuItem value={30}>Aire Libre</MenuItem>
        <MenuItem value={30}>Cuidado y Bienestar</MenuItem>
      </Select>
    </FormControl>
  );
}
