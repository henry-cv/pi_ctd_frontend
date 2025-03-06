import { RiDashboardFill } from "react-icons/ri";
import { FaTicketAlt } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { AiFillTags } from "react-icons/ai";


const size = "1.7rem";

export const ListSidebar = [
  {
    id: "1",
    label: "Panel de Control",
    icon: <RiDashboardFill size={size} />,
    to: "panel",
  },
  {
    id: "2",
    label: "Lista de Productos",
    icon: <FaTicketAlt size={size} />,
    to: "actividades",
  },
  {
    id: "3",
    label: "Categorias",
    icon: <MdCategory size={size} />,
    to: "categorias",
  },  
  {
    id: "4",
    label: "Características", // Nueva entrada
    icon: <AiFillTags size={size} />, // Nuevo icono
    to: "caracteristicas", // Nueva ruta
  },
  {
    id: "5",
    label: "Ajustes",
    icon: <IoMdSettings size={size} />,
    to: "ajustes",
  },
  
];
