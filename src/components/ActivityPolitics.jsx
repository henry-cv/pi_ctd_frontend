import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/components/ActivityPolitics.css";
import {
  faCalendarCheck,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { modal } from "../constants/data/modalsInfo.js";
import Modal from "./Modal.jsx";
import { useState, useRef } from "react";
import {
  paymentPolicies,
  cancellationPolicies,
} from "../constants/data/policiesDataInfo";


function ActivityPolitics({cancelation, payment}) {
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [objModal, setObjModal] = useState(null);
  const cancelRef = useRef(null);
  const reserveRef = useRef(null);


  const policyMapping = {
    "PAGO_TOTAL_ANTICIPADO": "pagoInmediato",
    "PAGO_AL_FINAL": "reserveAhora",
    "FLEXIBLE": "reembolso24",
    "MODERADA": "reembolso7dias",
    "NO_REEMBOLSABLE": "noReembolsable",
  };

  const handlePolicyClick = (policy) => {
    setSelectedPolicy(policy);
    setObjModal(modal[policy]);
  };
  const onCloseModal = () => {
    setSelectedPolicy(null);
    setObjModal(null);
  };

  console.log("Cancelation:", cancelation);
  console.log("Payment:", payment);
  return (
    <div className="info-card-yellow">
      <div className="info-item">
        <FontAwesomeIcon icon={faCalendarCheck} className="info-icon" />
        {cancellationPolicies.map(
          (policy) =>
            policy.id === cancelation && (
              <p>
                <strong
                  key={policy.id}
                  value={policy.id}
                  ref={cancelRef}
                  onClick={() =>
                    handlePolicyClick(policyMapping[cancelation])
                  }
                >
                {policy.selectText}
                </strong>
                {policy.infoCard}
              </p>
            )
        )}
      </div>
      <div className="info-item">
        <FontAwesomeIcon icon={faCreditCard} className="info-icon" />
        {paymentPolicies.map(
          (policy) =>
            policy.id === payment &&
             (
              <p>
                <strong
                  key={policy.id}
                  value={policy.id}
                  ref={cancelRef}
                  onClick={() =>
                    handlePolicyClick(policyMapping[payment])
                  }
                >
                {policy.selectText}
                </strong>
                {policy.infoCard}
              </p>
            )
        )}
      </div>
      {selectedPolicy && objModal && (
        <Modal
          title={objModal.title}
          content={objModal.content}
          link={objModal.link}
          maxWidth={800}
          isOpen={true}
          onClose={onCloseModal}
          path={objModal.path}
        ></Modal>
      )}
    </div>
  );
}

export default ActivityPolitics;
