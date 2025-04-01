
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../css/global/variables.css";
import { useContextGlobal } from "../gContext/globalContext";
import PropTypes from "prop-types";

export default function BasicPagination({ count, onChange, page }) {
  const { state } = useContextGlobal();
  return (
    <Stack spacing={2}>
      <Pagination
        count={count}
        onChange={onChange}
        page={page}
        color={`${state.theme === "dark" ? "secondary" : "inherit"}`}
        renderItem={(item) => (
          <PaginationItem
            className="dark_activities"
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
          />
        )}
      />
    </Stack>
  );
}
BasicPagination.propTypes = {
  count: PropTypes.number,
  onChange: PropTypes.func,
  page: PropTypes.number,
}