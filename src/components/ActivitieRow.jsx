import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useContextGlobal } from "../gContext/globalContext";

const ActivitieRow = ({ id, imagen, titulo, reservas, onDelete, onUpdate }) => {
  const { state } = useContextGlobal();
  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const token = state.token || localStorage.getItem("token");
        const response = await fetch(`/api/producto/eliminar?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar: ${response.status}`);
        }
        onDelete && onDelete(id);
      } catch (error) {
        console.error("Error eliminando el producto:", error);
        alert("Error eliminando el producto");
      }
    }
  };

  return (
    <div className="RegisterActivitie">
      <div className="infoActivitie">
        <input type="checkbox" className="inputActivitie" />
        <img src={imagen} alt="Actividad" width={50} className="activitieImg" />
        <p>{titulo}</p>
      </div>
      <div className="amount_reservation">
        <span className="dark_activities">{reservas}</span>
      </div>
      <div className="btn_action">
        <button className="btn_blueAction" onClick={onUpdate}>
          <FaEdit size={"1.2rem"} />
        </button>
        <button className="btn_redAction" onClick={handleDelete}>
          <RiDeleteBin5Fill size={"1.2rem"} />
        </button>
      </div>
    </div>
  );
};

export default ActivitieRow;
