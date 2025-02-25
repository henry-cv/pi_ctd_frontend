import Carousel from '../components/Carousel';
import SearchBox from '../components/SearchBox';
import CategoryCard from '../components/CategoryCard';
import NavDash from '../components/NavDash';
import ActivityCard from '../components/ActivityCard';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Footer from '../components/Footer';

const Home = () => {
  const [isLoggedIn] = useState(false);
  const [activities, setActivities] = useState([]);
  const [popularActivities, setPopularActivities] = useState([]); // Nuevo estado

  const carouselImages = [
    '/bkgd_slider1.webp',
    '/bkgd_slider2.webp',
    '/bkgd_slider3.webp',
  ];

  const categories = [
    { image: "/cultural-category.webp", title: "Cultural" },
    { image: "/food-category.webp", title: "Gastronomía" },
    { image: "/outdoor-category.webp", title: "Aire libre" },
    { image: "/wellness-category.webp", title: "Bienestar" }
  ];

  const fetchActivities= async()=>{
    try {
      const response = await fetch("/api/producto/listaAleatoria");
      if (!response.ok) {
        throw new Error("Error al obtener las actividades");
      }
      const data = await response.json();
      console.log("Actividades obtenidas:", data);
      setActivities(data);  // 🔹 Guardamos las actividades en el estado
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  const fetchPopularActivities = async () => {
    try {
      const response = await fetch("/api/producto/listaAleatoria"); 
      if (!response.ok) {
        throw new Error("Error al obtener las actividades populares");
      }
      const data = await response.json();
      console.log("Actividades populares obtenidas:", data);
      setPopularActivities(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchPopularActivities(); 
  }, []);

  const renderActivityCards = (activities) => (
    activities.map(activity => (
      <Link 
        key={activity.id} 
        to={`/actividad/${activity.id}`}
        className="activity-link"
      >
        <ActivityCard 
          image={activity.imagenesSalidaDto?.[0]?.rutaImagen || "/activitie.webp"}  // ✅ Muestra la primera imagen o una por defecto
          title={activity.nombre} 
          location={activity.direccion || "Ubicación no disponible"}  // ✅ Fallback si no hay dirección
          duration={`${activity.horaInicio} - ${activity.horaFin}`} 
          price={activity.valorTarifa}
          rating={4.5}  // 🔹 Asigna una calificación temporal (si no hay en el backend)
        />
      </Link>
    ))
  );

  return (
    <div className="home-container">
      <section className="hero-section">
        <header className="header-container">
          <div className="content-wrapper">
            <NavDash variant="home" isLoggedIn={isLoggedIn} />
          </div>
        </header>
        <Carousel images={carouselImages} />
        <div className="hero-overlay">
          <div className="content-wrapper">
            <div className="hero-content">
              <h1 className="hero-title">
                Descubre, reserva y vive nuevas experiencias
              </h1>
              <h6 className="hero-subtitle">
                Conéctate con la emoción de viajar, descubrir y disfrutar
              </h6>
            </div>
            <SearchBox />
          </div>
        </div>
      </section>

      <main className="main-content">
        <section className="categories-section">
          <div className="content-wrapper">
            <h2 className="section-title">Categorías</h2>
            <div className="categories-grid">
              {categories.map((category, index) => (
                <CategoryCard key={index} {...category} />
              ))}
            </div>
          </div>
        </section>

        <section className="activities-section">
          <div className="content-wrapper">
            <h2 className="section-title">Actividades cercanas</h2>
            <div className="activities-grid">
              {activities.length > 0 ? renderActivityCards(activities) : <p>Cargando actividades...</p>}
            </div>
          </div>
        </section>

        {/* Nueva sección de actividades populares */}
        <section className="activities-section popular-section">
          <div className="content-wrapper">
            <h2 className="section-title">Los más populares</h2>
            <div className="activities-grid">
              {popularActivities.length > 0 ? 
                renderActivityCards(popularActivities) : 
                <p>Cargando actividades populares...</p>
              }
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default Home;