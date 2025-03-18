import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../css/components/ActivityPolitics.css";
import { faCalendarCheck, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { modal } from "../constants/data/modalsInfo.js";
import Modal from "./Modal.jsx";
import { useState, useRef, useEffect } from "react";

function ActivityPolitics() {

  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [objModal, setObjModal] = useState(null);
  const cancelRef = useRef(null);
  const reserveRef = useRef(null);
  const prevState = useRef(null);


  const handlePolicyClick = (policy) => {
    setSelectedPolicy(policy);
    setObjModal(modal[policy]);
  };
  const onCloseModal = () => {
    setSelectedPolicy(null);
    setObjModal(null);
  };
  useEffect(() => {
    const prev = prevState.current;
    prevState.current = selectedPolicy;

    if (prev !== selectedPolicy) {
      if (selectedPolicy) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }, [selectedPolicy]);

  return (

    <div className="info-card-yellow">
      <div className="info-item">
        <FontAwesomeIcon
          icon={faCalendarCheck}
          className="info-icon"
        />
        <p>
          <strong ref={cancelRef} onClick={() => handlePolicyClick("reembolso24")}>Cancelación gratis</strong> hasta 24 horas antes
          de la experiencia (hora local)
        </p>
      </div>
      <div className="info-item">
        <FontAwesomeIcon
          icon={faCreditCard}
          className="info-icon"
        />
        <p>
          <strong ref={reserveRef} onClick={() => handlePolicyClick("reserveAhora")}>Reserva ahora paga después</strong> planes
          flexibles aseguran tu reserva, sin que se te haga el
          cargo hoy.
        </p>
      </div>
      {selectedPolicy && objModal &&
        <Modal title={objModal.title} content={objModal.content} link={objModal.link} maxWidth={800} isOpen={true} onClose={onCloseModal} path={objModal.path}>

        </Modal>
      }

    </div>
  )
}

export default ActivityPolitics
