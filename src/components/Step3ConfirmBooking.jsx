import { useState, useEffect } from "react";
import "../css/components/Step3ConfirmBooking.css";
import ButtonGral from "./ButtonGral";
import DescargaApp from "./DescargaApp";
import { FaCalendar, FaMoneyBill, FaSearch } from 'react-icons/fa';

const Step3ConfirmBooking = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize); 

    return () => window.removeEventListener("resize", handleResize); 
  }, []);

  return (
    <div className="container-step3">
      <div className="columns-setp3">
        <section className="column-step3-right">
          <h2 className="column-step3-tittle">Tu reserva ha sido confirmada</h2>

          {isSmallScreen && (
            <div className="info-box">
              <h3>Número de la reserva</h3>
              <p> wdaqfergqrg5275786</p>
            </div>
          )}

          <p>La confirmación te llegará al correo <strong>sarame@gmail.com</strong></p>
          <p>El pago se procesará automáticamente 48 horas antes de tu reserva. 
             Asegúrate de tener fondos disponibles para evitar inconvenientes.</p>

          <section className="reservation-card">
            <div className="tour-info-container">
              <img
                src="https://i.pinimg.com/736x/fc/e2/99/fce299e293cb34d9e1f565b3639c6926.jpg"
                alt="Tour centro amurallado"
                className="tour-image"
              />
              <div className="tour-details-info">
                <div className="tour-info">
                  <h3>Tour centro amurallado</h3>
                  <p><FaCalendar/> 25 de marzo de 2026</p>
                  <p><FaMoneyBill/> Precio total: 75 USD</p>
                </div>
              </div>
            </div>

            <ButtonGral
              className="btn-info-tour"
              text={"Ver o actualizar datos"}
              color="blue"
            />
          </section>

          <section className="other-options">
            <h3>Aprovecha al máximo tu experiencia</h3>
            <p>
              Sigue explorando nuevos destinos y descubre más{" "}
              <a href="#">experiencias increíbles</a>.
            </p>
            <p>
              Revisa todas tus <a href="#">reservas aquí</a> y mantén el control
              de tu itinerario.
            </p>
          </section>
        </section>

        {!isSmallScreen && (
          <section className="column-step3-left">
            <div className="info-box">
              <h3>Número de la reserva</h3>
              <p> wdaqfergqrg5275786</p>
            </div>
            <DescargaApp forceMobileStyle={true} />
          </section>
        )}
      </div>


      {isSmallScreen && <DescargaApp forceMobileStyle={false} positionOnOff={true}/>}
    </div>
  );
};

export default Step3ConfirmBooking;
