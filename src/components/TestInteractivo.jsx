import { useState } from "react";
import "../css/components/TestInteractivo.css";

const preguntas = [
  {
    id: 1,
    pregunta: "¿Qué tipo de experiencia prefieres?",
    opciones: [
      { texto: "Relajante", valor: "Yoga" },
      { texto: "Gastronómica", valor: "Cocina peruana" },
      { texto: "Estimulante", valor: "Videojuegos" },
      { texto: "Aventura", valor: "Aventura" },
    ],
  },
  {
    id: 2,
    pregunta: "¿Qué ambiente te llama más la atención?",
    opciones: [
      { texto: "Ciudad y cultura", valor: "Arte urbano" },
      { texto: "Naturaleza", valor: "Micoturismo" },
      { texto: "Interior/espacio cerrado", valor: "Videojuegos" },
      { texto: "Espacio al aire libre", valor: "Yoga" },
    ],
  },
  {
    id: 3,
    pregunta: "¿Con qué estilo te identificas más?",
    opciones: [
      { texto: "Creativo", valor: "Arte express" },
      { texto: "Tranquilo y conectado", valor: "Yoga" },
      { texto: "Explorador y curioso", valor: "Tour al centro de la ciudad" },
      { texto: "Competitivo o gamer", valor: "Videojuegos" },
    ],
  },
];

const TestInteractivo = () => {
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState("");

  const manejarCambio = (preguntaId, valor) => {
    setRespuestas({ ...respuestas, [preguntaId]: valor });
  };

  const calcularResultado = () => {
    const conteo = {};
    Object.values(respuestas).forEach((actividad) => {
      conteo[actividad] = (conteo[actividad] || 0) + 1;
    });

    const actividadRecomendada = Object.entries(conteo).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      ["", 0]
    )[0];

    setResultado(`¡Tu actividad ideal es: ${actividadRecomendada}!`);
  };

  return (
    <div className="test-container">
      <div className="test-grid">
        {preguntas.map((pregunta) => (
          <div key={pregunta.id} className="test-pregunta">
            <p className="pregunta-texto">{pregunta.pregunta}</p>
            <div className="opciones-horizontal">
              {pregunta.opciones.map((opcion, index) => (
                <label key={index} className="test-opcion">
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.valor}
                    onChange={() => manejarCambio(pregunta.id, opcion.valor)}
                  />
                  {opcion.texto}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="test-boton" onClick={calcularResultado}>
        Ver recomendación
      </button>
      {resultado && <p className="test-resultado">{resultado}</p>}
    </div>
  );
};

export default TestInteractivo;
