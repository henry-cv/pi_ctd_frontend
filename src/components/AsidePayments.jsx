import { useState } from 'react';
import "../css/Aside.css";

const AsidePayments = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);

  const handleAccordionClick = (index, title) => {
    setActiveAccordion(prevIndex => prevIndex === index ? null : index);
    setSelectedTitle(title);
  };

  return (
    <div className="sidebar">
      <h2 className='help-center-title'>Centro de Ayuda</h2>
      <div className="accordion">
        <div className="accordion-item" onClick={() => handleAccordionClick(1, 'planificar')}>
          <h5 className={selectedTitle === 'planificar' ? 'title-selected' : ''}>Planificar, buscar y reservar <span className="caret"></span></h5>

          {activeAccordion === 1 && (
            <div className="sub-accordion">
              <p>Subtítulo 1</p>
              <p>Subtítulo 2</p>
            </div>
          )}
        </div>
        <div className="accordion-item" onClick={() => handleAccordionClick(2, 'pagos')}>
          <h5 className={selectedTitle === 'pagos' ? 'title-selected' : ''}>Pagos <span className="caret"></span></h5>
          {activeAccordion === 2 && (
            <div className="sub-accordion">
              <p>Subtítulo 1</p>
              <p>Subtítulo 2</p>
            </div>
          )}
        </div>
        <div className="accordion-item" onClick={() => handleAccordionClick(3, 'cancelaciones')}>
          <h5 className={selectedTitle === 'cancelaciones' ? 'title-selected' : ''}>Cancelaciones <span className="caret"></span></h5>

          {activeAccordion === 3 && (
            <div className="sub-accordion">
              <p>Subtítulo 1</p>
              <p>Subtítulo 2</p>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default AsidePayments;