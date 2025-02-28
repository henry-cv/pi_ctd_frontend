import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DurationInfo = ({ tipoEvento, horaInicio, horaFin, diasDisponible }) => {
  
  const abreviaciones = {
    "LUNES": "Lun",
    "MARTES": "Mar",
    "MIERCOLES": "Mié",
    "JUEVES": "Jue",
    "VIERNES": "Vie",
    "SABADO": "Sáb",
    "DOMINGO": "Dom"
  };

  const esEntreSemana = (dias) => {
    const semana = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];
    return semana.every(dia => dias.includes(dia)) && dias.length === 5;
  };

  const esFinDeSemana = (dias) => {
    const finde = ["VIERNES", "SABADO", "DOMINGO"];
    return finde.every(dia => dias.includes(dia)) && dias.length === 3;
  };

  const getEventDurationText = () => {
    
    if (tipoEvento === "FECHA_UNICA") {
      const start = dayjs(horaInicio, "HH:mm");
      const end = dayjs(horaFin, "HH:mm");

      if (!start.isValid() || !end.isValid()) return "Horario no válido";

      const diffHours = Math.round(end.diff(start, "hour", true)); 
      return `${diffHours} ${diffHours === 1 ? "hora" : "horas"}`; 
    } 
    
    else if (tipoEvento === "RECURRENTE") {
      if (!Array.isArray(diasDisponible) || diasDisponible.length === 0) {
        return "Días no disponibles"; 
      }

      let diasTexto = diasDisponible.map(dia => abreviaciones[dia] || dia).join(", ");

      if (esEntreSemana(diasDisponible)) {
        diasTexto = "Entre semana";
      } else if (esFinDeSemana(diasDisponible)) {
        diasTexto = "Fin de semana";
      } else if (diasDisponible.length > 3) {
        diasTexto = "Varios días";
      }

      const horaInicioFormatted = dayjs(horaInicio, "HH:mm").format("HH:mm");
      const horaFinFormatted = dayjs(horaFin, "HH:mm").format("HH:mm");

      return `${diasTexto} (${horaInicioFormatted} - ${horaFinFormatted})`;
    }

    return "Horario no disponible";
  };

  return <span>{getEventDurationText()}</span>;
};

export default DurationInfo;
