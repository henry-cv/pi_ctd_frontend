import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../css/components/ActivityPolitics.css";
import { faCalendarCheck, faCreditCard } from "@fortawesome/free-solid-svg-icons";


function ActivityPolitics() {
  return (
    
    <div className="info-card-yellow">
    <div className="info-item">
      <FontAwesomeIcon
        icon={faCalendarCheck}
        className="info-icon"
      />
      <p>
        <strong>Cancelación gratis</strong> hasta 24 horas antes
        de la experiencia (hora local)
      </p>
    </div>
    <div className="info-item">
      <FontAwesomeIcon
        icon={faCreditCard}
        className="info-icon"
      />
      <p>
        <strong>Reserva ahora paga después</strong> planes
        flexibles aseguran tu reserva, sin que se te haga el
        cargo hoy.
      </p>
    </div>
  </div>
  )
}

export default ActivityPolitics