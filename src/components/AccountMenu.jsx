import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import GridViewIcon from "@mui/icons-material/GridView";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { Link, useNavigate } from "react-router-dom";
import { useContextGlobal } from "../gContext/globalContext";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { dispatch, state } = useContextGlobal();
  const { user, isLoading } = state;
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT_USER" });
    navigate("/", { replace: true });
  };

  const nameUser = `${user.nombre} ${user.apellido}`;
  const getUserInitials = `${user?.nombre?.[0] || "U"}${
    user?.apellido?.[0] || "U"
  }`.toUpperCase();

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Typography
          sx={{ minWidth: 100, marginLeft: 2 }}
          className="user_name_account"
          color={state.theme === "dark" ? "white" : "black"}
        >
          {isLoading ? "Cargando..." : user ? nameUser : "Usuario"}
        </Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 38, height: 38, background: "#3E10DA" }}>
              {getUserInitials}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              bgcolor: state.theme === "dark" ? "#383F4C" : "white",
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="menu_name_account">
          <MenuItem>
            <Typography sx={{ minWidth: 100 }}>{nameUser}</Typography>
          </MenuItem>
          <Divider />
        </div>

        <MenuItem onClick={handleClose}>
          <Link to="/perfil" className="listAvatar">
            <ListItemIcon>
              <PersonOutlineRoundedIcon />
            </ListItemIcon>
            Perfil
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/administrador" className="listAvatar">
            <ListItemIcon>
              <GridViewIcon />
            </ListItemIcon>
            Dashboard
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Salir
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
