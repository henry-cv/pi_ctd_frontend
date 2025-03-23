import '../css/components/DescargaApp.css';

const DescargaApp = () => {
  return (
    <div className="layout-main" >

        <h1 className="title">¡Descarga la App!</h1>
        <p className="subtitle">Comienza tu aventura hoy.</p>
        <p className="description">
          Descarga la aplicación ahora y descubre un mundo de posibilidades. Embárcate en viajes extraordinarios con{' '}
          <span className="highlight">GoBook</span>.
        </p>
        <button className="download-button">
          <a href="#">Descargar Ahora</a>
        </button>

    </div>
  );
};

export default DescargaApp;
