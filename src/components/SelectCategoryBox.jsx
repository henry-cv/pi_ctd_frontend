import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";

export default function SelectCategoryBox({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={selectedCategory || ""}
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
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            value={category.nombre}
            disabled={selectedCategory && selectedCategory !== category.nombre}
          >
            {category.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
