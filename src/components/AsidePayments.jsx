import { useState } from 'react';
import "../css/components/Aside.css";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const AsidePayments = ({ setSelectedPolicy }) => {
  const [activeAccordion, setActiveAccordion] = useState(-1);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedPolicyIndex, setSelectedPolicyIndex] = useState(-1);

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
    <aside className="sidebar-policies">
      <h2 className='help-center-title'>Centro de Ayuda</h2>
      <div className="accordion">
        <div className="accordion-item" onClick={() => handleAccordionClick(1, 'planificar')}>
          <h5 className={selectedTitle === 'planificar' ? 'title-selected' : ''}>Planificar, buscar y reservar <span className="caret"></span></h5>

          {activeAccordion === 1 && (
            <div className="sub-accordion" onClick={(e) => e.stopPropagation()}>
              <p><Link to="/politicas/planificar">Planificar</Link></p>
              <p><Link to="/politicas/buscar">Buscar</Link></p>
              <p><Link to="/politicas/reservar">Reservar</Link></p>
            </div>
          )}
        </div>
        <div className="accordion-item" onClick={() => handleAccordionClick(2, 'pagos')}>
          <h5 className={selectedTitle === 'pagos' ? 'title-selected' : ''} onClick={() => handlePolicyClick('pagos')}>Pagos <span className="caret"></span></h5>
          {activeAccordion === 2 && (
            <div className="sub-accordion" onClick={(e) => e.stopPropagation()}>
              <p onClick={() => handlePolicyClick('pagoInmediato', 0)}
                className={selectedPolicyIndex === 0 ? 'selected-policy' : ''}
              ><Link to="/politicasdeuso/pagoInmediato">Pago inmediato y reserva confirmada</Link></p>
              <p onClick={() => handlePolicyClick('reserveAhora', 1)}
                className={selectedPolicyIndex === 1 ? 'selected-policy' : ''}
              ><Link to="/politicasdeuso/reservaAhora">Reserve ahora, pague después</Link></p>
            </div>
          )}
        </div>
        <div className="accordion-item" onClick={() => handleAccordionClick(3, 'cancelaciones')}>
          <h5 className={selectedTitle === 'cancelaciones' ? 'title-selected' : ''} onClick={() => handlePolicyClick('cancelaciones')}>Cancelaciones <span className="caret"></span></h5>

          {activeAccordion === 3 && (
            <div className="sub-accordion" onClick={(e) => e.stopPropagation()}>
              <p onClick={() => handlePolicyClick('reembolso7dias', 0)}
                className={selectedPolicyIndex === 0 ? 'selected-policy' : ''}
              ><Link to="/politicasdeuso/reembolso7dias">Reembolso total hasta 7 días antes</Link></p>
              <p onClick={() => handlePolicyClick('reembolso24horas', 1)}
                className={selectedPolicyIndex === 1 ? 'selected-policy' : ''}
              ><Link to="/politicasdeuso/reembolso24horas">Reembolso total hasta 24 horas antes</Link></p>
              <p
                onClick={() => handlePolicyClick('noReembolsable', 2)}
                className={selectedPolicyIndex === 2 ? 'selected-policy' : ''}
              ><Link to="/politicasdeuso/noReembolsable">No Reembolsable</Link></p>
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