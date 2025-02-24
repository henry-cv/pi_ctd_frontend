import { RiDashboardFill } from "react-icons/ri";
import { FaTicketAlt } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

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
    label: "Ajustes",
    icon: <IoMdSettings size={size} />,
    to: "ajustes",
  },
];
