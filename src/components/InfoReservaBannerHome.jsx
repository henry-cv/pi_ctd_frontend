import "../css/components/InfoReservaBannerHome.css";

const InfoReservaBannerHome = () => {
  return (
    <section className="container-banner-first">
      <img
        className="banner-first-img"
        src="https://res.cloudinary.com/drq4tucwt/image/upload/v1743635689/man_with-suitcase_rtqoct.webp"
        alt="man with suitcase"
      />
      <div className="banner-text-column">
        <h4 className="banner-text-tittle">LO QUE SERVIMOS</h4>
        <h2 className="banner-text-subtittle">
          Reserva de actividades variadas
        </h2>
        <p className="banner-text-paragraph">
          Abrace la inmensidad de la vida, aventúrese y descubra las maravillas
          que le aguardan más allá. El mundo le llama.
        </p>
        <p className="banner-text-paragraph">
          ¡Aproveche ahora sus grandes ofertas!
        </p>

        <div className="banner-footer-items">
          <div>
            <h2 className="banner-footer-items-h2">100 +</h2>
            <p className="banner-footer-items-p">Destino Colaboración</p>
          </div>

          <div>
            <h2 className="banner-footer-items-h2">15K +</h2>
            <p className="banner-footer-items-p">Clientes Felices</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoReservaBannerHome;
