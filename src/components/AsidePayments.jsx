import { useState } from 'react';
import "../css/components/Aside.css";
import PropTypes from 'prop-types';


const AsidePayments = ({ setSelectedPolicy }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);

  const handleAccordionClick = (index, title) => {
    setActiveAccordion(prevIndex => prevIndex === index ? null : index);
    setSelectedTitle(title);
  };
  const handlePolicyClick = (policy) => {
    setSelectedPolicy(policy);
  };
  return (
    <aside className="sidebar-policies">
      <h2 className='help-center-title'>Centro de Ayuda</h2>
      <div className="accordion">
        <div className="accordion-item" onClick={() => handleAccordionClick(1, 'planificar')}>
          <h5 className={selectedTitle === 'planificar' ? 'title-selected' : ''}>Planificar, buscar y reservar <span className="caret"></span></h5>

          {activeAccordion === 1 && (
            <div className="sub-accordion">
              <p>Planificar</p>
              <p>Buscar</p>
              <p>Reservar</p>
            </div>
          )}
        </div>
        <div className="accordion-item" onClick={() => handleAccordionClick(2, 'pagos')}>
          <h5 className={selectedTitle === 'pagos' ? 'title-selected' : ''} onClick={() => handlePolicyClick('pagos')}>Pagos <span className="caret"></span></h5>
          {activeAccordion === 2 && (
            <div className="sub-accordion">
              <p onClick={() => handlePolicyClick('pago_inmediato')}>Pago inmediato y reserva confirmada</p>
              <p onClick={() => handlePolicyClick('reserva_ahora')}>Reserve ahora, pague después</p>
            </div>
          )}
        </div>
        <div className="accordion-item" onClick={() => handleAccordionClick(3, 'cancelaciones')}>
          <h5 className={selectedTitle === 'cancelaciones' ? 'title-selected' : ''}>Cancelaciones <span className="caret"></span></h5>

          {activeAccordion === 3 && (
            <div className="sub-accordion">
              <p>Reembolso total hasta 7 días antes</p>
              <p>Reembolso total hast 25 horas antes</p>
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