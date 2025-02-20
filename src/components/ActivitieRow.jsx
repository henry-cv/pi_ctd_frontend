import React from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
const ActivitieRow = ({ imagen, titulo, reservas }) => {
  return (
    <div className="RegisterActivitie">
      <div className="infoActivitie">
        <input type="checkbox" className="inputActivitie" />
        <img
          src={imagen}
          alt="Actividad"
          width={50}
          className="activitieImg"
        />
        <p>{titulo}</p>
      </div>
      <div className="amount_reservation">
        <span>{reservas}</span>
      </div>

      <div className="btn_action">
        <button className="btn_blueAction">
          <FaEdit size={"1.2rem"} />
        </button>
        <button className="btn_redAction">
          <RiDeleteBin5Fill size={"1.2rem"} />
        </button>
      </div>
    </div>
  );
};

export default ActivitieRow;
