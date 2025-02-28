/* eslint-disable react/prop-types */
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

const CategoryRow = ({ id, nombre, descripcion, imagenCategoriaUrl, onDelete }) => {

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        const response = await fetch(`/api/categoria/eliminar?id=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar: ${response.status}`);
        }
        onDelete && onDelete(id);
      } catch (error) {
        console.error("Error eliminando la categoría:", error);
        alert("Error eliminando la categoría");
      }
    }
  };

  return (
    <div className="RegisterCategory RegisterActivitie">
      <div className="infoCategory infoActivitie">
        <input type="checkbox" className="inputCategory inputActivitie" />
        <img src={imagenCategoriaUrl} alt="Categoria" width={50} className="categoryImg activitieImg" />
        <p>{nombre}</p>
      </div>
      <div className="category-description">
        <p>{descripcion}</p>
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
  )
}

export default CategoryRow