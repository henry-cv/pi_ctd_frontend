import { useState } from 'react';
import "../css/components/Aside.css";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { useContextGlobal } from "../gContext/globalContext";

const AsidePayments = ({ setSelectedPolicy }) => {
  const [activeAccordion, setActiveAccordion] = useState(-1);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedPolicyIndex, setSelectedPolicyIndex] = useState(-1);
  const { state } = useContextGlobal();
  const { theme } = state;

  const handleAccordionClick = (index, title) => {
    setActiveAccordion(prevIndex => prevIndex === index ? null : index);
    setSelectedTitle(title);
  };
  //Manejador de política, establece la política según el elemento clicado
  const handlePolicyClick = (policy, index) => {
    setSelectedPolicy(policy);
    setSelectedPolicyIndex(index);
  };
  return (
    <aside className={`sidebar-policies ${theme}`}>
      <h2 className={`help-center-title ${theme}`}>Centro de Ayuda</h2>
      <div className={`accordion ${theme}`}>
        <div className={`accordion-item ${theme}`} onClick={() => handleAccordionClick(1, 'planificar')}>
          <h5 className={selectedTitle === 'planificar' ? 'title-selected' : ''} onClick={() => handlePolicyClick('planificar')}>
            <Link className={`${theme}`} to="/politicasdeuso/planificar">Planificar, buscar y reservar</Link>

            <span className="caret"></span></h5>

          {activeAccordion === 1 && (
            <div className="sub-accordion" onClick={(e) => e.stopPropagation()}>
              <p>Aún por desarrollar</p>
            </div>
          )}
        </div>
        <div className={`accordion-item ${theme}`} onClick={() => handleAccordionClick(2, 'pagos')}>
          <h5 className={selectedTitle === 'pagos' ? 'title-selected' : ''} onClick={() => handlePolicyClick('pagos')}>
            <Link className={`${theme}`} to="/politicasdeuso/pagos">Pagos</Link>
            <span className="caret"></span></h5>
          {activeAccordion === 2 && (
            <div className="sub-accordion" onClick={(e) => e.stopPropagation()}>
              <p onClick={() => handlePolicyClick('pagoInmediato', 0)}
                className={selectedPolicyIndex === 0 ? 'selected-policy' : ''}
              ><Link className={`${theme}`} to="/politicasdeuso/pagos/pagoInmediato">Pago inmediato y reserva confirmada</Link></p>
              <p onClick={() => handlePolicyClick('reserveAhora', 1)}
                className={selectedPolicyIndex === 1 ? 'selected-policy' : ''}
              ><Link className={`${theme}`} to="/politicasdeuso/pagos/reserveAhora">Reserve ahora, pague después</Link></p>
            </div>
          )}
        </div>
        <div className={`accordion-item ${theme}`} onClick={() => handleAccordionClick(3, 'cancelaciones')}>
          <h5 className={selectedTitle === 'cancelaciones' ? 'title-selected' : ''} onClick={() => handlePolicyClick('cancelaciones')}>
            <Link className={`${theme}`} to="/politicasdeuso/cancelaciones">Cancelaciones</Link>
            <span className="caret"></span></h5>

          {activeAccordion === 3 && (
            <div className="sub-accordion" onClick={(e) => e.stopPropagation()}>
              <p onClick={() => handlePolicyClick('reembolso7dias', 0)}
                className={selectedPolicyIndex === 0 ? 'selected-policy' : ''}
              ><Link className={`${theme}`} to="/politicasdeuso/cancelaciones/reembolso7dias">Reembolso total hasta 7 días antes</Link></p>
              <p onClick={() => handlePolicyClick('reembolso24horas', 1)}
                className={selectedPolicyIndex === 1 ? 'selected-policy' : ''}
              ><Link className={`${theme}`} to="/politicasdeuso/cancelaciones/reembolso24horas">Reembolso total hasta 24 horas antes</Link></p>
              <p
                onClick={() => handlePolicyClick('noReembolsable', 2)}
                className={selectedPolicyIndex === 2 ? 'selected-policy' : ''}
              ><Link className={`${theme}`} to="/politicasdeuso/cancelaciones/noReembolsable">No Reembolsable</Link></p>
            </div>
          )}
        </div>
      </div>
    </aside >
  );
};
AsidePayments.propTypes = {
  setSelectedPolicy: PropTypes.func,
}
export default AsidePayments;
