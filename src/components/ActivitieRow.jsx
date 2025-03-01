import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
const ActivitieRow = ({ id, imagen, titulo, reservas, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const response = await fetch(`/api/producto/eliminar?id=${id}`, {
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
        <button className="btn_blueAction">
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
