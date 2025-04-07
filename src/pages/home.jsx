import Carousel from "../components/Carousel";
import SearchBox from "../components/SearchBox";
import CategoryCard from "../components/CategoryCard";
import NavDash from "../components/NavDash";
import { useState, useEffect } from "react";
import "../css/pages/Home.css";
import "../css/components/ActivityCard.css";
import Footer from "../components/Footer";
import { useContextGlobal } from "../gContext/globalContext";
import renderActivityCards from "../components/RenderActivityCards";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import DescargaApp from "../components/DescargaApp";
import InfoReservaBannerHome from "../components/InfoReservaBannerHome";
import TestInteractivo from "../components/TestInteractivo"; // ✅ Importación

const Home = () => {
  const { state } = useContextGlobal();
  const [isLoggedIn] = useState(false);
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularActivities, setPopularActivities] = useState([]);

  const carouselImages = [
    "/bkgd_slider1.webp",
    "/bkgd_slider2.webp",
    "/bkgd_slider3.webp",
  ];

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/producto/listaAleatoria");
      if (!response.ok) throw new Error("Error al obtener las actividades");
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchPopularActivities = async () => {
    try {
      const response = await fetch("/api/producto/listaAleatoria");
      if (!response.ok) throw new Error("Error al obtener las actividades populares");
      const data = await response.json();
      setPopularActivities(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categoria/listar");
      if (!response.ok) throw new Error(`Error al obtener categorías: ${response.status}`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchPopularActivities();
    fetchCategories();
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <header className="header-container">
          <div className="content-wrapper">
            <NavDash variant="home" isLoggedIn={isLoggedIn} />
          </div>
          <div className="header-text">
            <h1>Descubre, reserva y vive nuevas experiencias</h1>
            <p>Conéctate con la emoción de viajar, descubrir y disfrutar.</p>
          </div>
          <SearchBox />
        </header>
        <Carousel images={carouselImages} />
      </section>

      <section className="features-section">
        <div className="content-wrapper">
          <div className="features-header">
            <img
              src="./detail_plane1.svg"
              alt="img plane 1"
              className="detailPlane1"
            />
            <h2 className="features-title">
              Cosas que debe <span className="highlight">hacer</span>
            </h2>
            <p className="features-subtitle">
              Nos aseguramos de que se embarque en unas vacaciones perfectamente
              planificadas y seguras a un precio asequible.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card blue">
              <h3 className="feature-title">Momentos de relajación</h3>
              <p className="feature-description">
                Descansa en lugares de ensueño, y recarga energías para tu
                próxima gran aventura.
              </p>
            </div>

            <div className="feature-card yellow">
              <h3 className="feature-title">Viajes apasionantes</h3>
              <p className="feature-description">
                Comience y explore una amplia gama de emocionantes experiencias
                de viaje.
              </p>
            </div>

            <div className="feature-card blue">
              <h3 className="feature-title">Escapadas culturales</h3>
              <p className="feature-description">
                Descubre la esencia de cada destino a través de su historia,
                arte y gastronomía.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="main-content">
        {/* ✅ Sección para TestInteractivo centrada */}
        <div className="content-wrapper">
          <TestInteractivo />
        </div>

        <section className="categories-section">
          <div className="content-wrapper">
            <h2 className="section-title title_categories">Categorías</h2>
            <div className="categories-grid">
              <Swiper
                className="category-swiper"
                modules={[Navigation, Pagination]}
                slidesPerView={5}
                spaceBetween={20}
                breakpoints={{
                  320: { slidesPerView: 2 },
                  400: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SwiperSlide key={category.id}>
                      <CategoryCard
                        title={category.nombre}
                        image={category.imagenCategoriaUrl}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <p>Cargando categorías...</p>
                )}
              </Swiper>
            </div>
          </div>
        </section>

        <section className="activities-section">
          <div className="content-wrapper wrapper-mobile-card">
            <h2 className="section-title">Actividades cercanas</h2>
            <div className="activities-grid mobile-activities-grid">
              {activities.length > 0 ? (
                renderActivityCards(activities.slice(0, 10))
              ) : (
                <p>Cargando actividades...</p>
              )}
            </div>
          </div>
        </section>

        <section className="activities-section popular-section">
          <div className="content-wrapper wrapper-mobile-card">
            <h2 className="section-title">Los más populares</h2>
            <div className="activities-grid mobile-activities-grid">
              {popularActivities.length > 0 ? (
                renderActivityCards(popularActivities.slice(0, 10))
              ) : (
                <p>Cargando actividades populares...</p>
              )}
            </div>
          </div>
        </section>

        <section className="special-banner-section">
          <InfoReservaBannerHome />
        </section>

        <section className="second-banner-section">
          <DescargaApp />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
