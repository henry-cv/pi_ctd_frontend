import { useLocation, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import "../css/pages/ActivityDetail.css";
import { useContextGlobal } from "../gContext/globalContext";
import { useNavigate } from "react-router-dom";

export default function DynamicBreadcrumbs() {
  const { dispatch } = useContextGlobal();
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const handlePerfilClick = () => {
    
    navigate("/perfil");
  };

  return (
    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs breadcrumbs-mobile">
      <Link underline="hover" color="inherit" component={RouterLink} to="/">
        Inicio
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1; // Último elemento no es un enlace

        return isLast ? (
          <Typography key={to} color="text.primary" className="breadcrumbs">
            {decodeURIComponent(value)}
          </Typography>
        ) : (
          <Link
            key={to}
            underline="hover"
            color="inherit"
            component={RouterLink}
            to={to}
            onClick={(e) => {
              if (value === "misreservas") {
                e.preventDefault();
                handlePerfilClick();
              }
            }}
          >
            {decodeURIComponent(value)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
