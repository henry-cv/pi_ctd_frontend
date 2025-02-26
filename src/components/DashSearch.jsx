
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";

import IconButton from "@mui/material/IconButton";

import SearchIcon from "@mui/icons-material/Search";


export default function DashSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = React.useState(""); // Estado para el término de búsqueda

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

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
      onSubmit={handleSearch}
    >
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Buscar"
        value={searchTerm}
        onChange={handleChange}
      />
    </Paper>
  );
}
