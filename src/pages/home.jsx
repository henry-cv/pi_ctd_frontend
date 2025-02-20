import Carousel from '../components/Carousel';
import SearchBox from '../components/SearchBox';
import CategoryCard from '../components/CategoryCard';
import NavDash from '../components/NavDash';
import ActivityCard from '../components/ActivityCard';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  const [isLoggedIn] = useState(false);
  const [randomActivities, setRandomActivities] = useState([]);
  const [randomPopularActivities, setRandomPopularActivities] = useState([]);

  const carouselImages = [
    '/bkgd_slider1.jpg',
    '/bkgd_slider2.jpg',
    '/bkgd_slider3.jpg',
  ];

  const categories = [
    { image: "/cultural-category.png", title: "Cultural" },
    { image: "/food-category.png", title: "Gastronomía" },
    { image: "/outdoor-category.png", title: "Aire libre" },
    { image: "/wellness-category.png", title: "Bienestar" }
  ];

  const activities = [
    {
      id: 1,
      image: "/activity1.jpg",
      title: "Tour gastronómico por la ciudad",
      location: "Buenos Aires, Argentina",
      duration: "3 horas",
      price: 45,
      rating: 4.8
    },
    {
      id: 2,
      image: "/activity2.jpg",
      title: "Clase de cocina tradicional",
      location: "Lima, Perú",
      duration: "2 horas",
      price: 35,
      rating: 4.9
    },
    {
      id: 3,
      image: "/activity3.jpg",
      title: "Visita guiada al Museo de Arte Moderno",
      location: "Ciudad de México, México",
      duration: "2 horas",
      price: 25,
      rating: 4.7
    },
    {
      id: 4,
      image: "/activity4.jpg",
      title: "Clase de Tenis",
      location: "Ciudad de México, México",
      duration: "1 hora",
      price: 30,
      rating: 4.2
    }
  ];

  const popularActivities = [
    {
      id: 1,
      image: "/popular1.jpg",
      title: "Taller de Arte Urbano",
      location: "Buenos Aires, Argentina",
      duration: "4 horas",
      price: 55,
      rating: 4.9
    },
    {
      id: 2,
      image: "/popular2.jpg",
      title: "Clase de Tango",
      location: "Buenos Aires, Argentina",
      duration: "2 horas",
      price: 40,
      rating: 4.8
    },
    {
      id: 3,
      image: "/popular3.jpg",
      title: "Tour Gastronómico",
      location: "Lima, Perú",
      duration: "5 horas",
      price: 65,
      rating: 4.9
    },
    {
      id: 4,
      image: "/popular4.jpg",
      title: "Experiencia de Café",
      location: "Bogotá, Colombia",
      duration: "3 horas",
      price: 45,
      rating: 4.7
    },
    {
      id: 5,
      image: "/popular5.jpg",
      title: "Tour Fotográfico",
      location: "Ciudad de México, México",
      duration: "4 horas",
      price: 50,
      rating: 4.8
    },
    {
      id: 6,
      image: "/popular6.jpg",
      title: "Clase de Cocina Gourmet",
      location: "Santiago, Chile",
      duration: "3 horas",
      price: 60,
      rating: 4.9
    },
    {
      id: 7,
      image: "/popular7.jpg",
      title: "Degustación de Vinos",
      location: "Mendoza, Argentina",
      duration: "4 horas",
      price: 70,
      rating: 4.8
    }
  ];

  const shuffleArray = array => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setRandomActivities(shuffleArray(activities));
    setRandomPopularActivities(shuffleArray(popularActivities));
  }, []);

  const renderFeatureCard = (title, description, color) => (
    <div className={`feature-card ${color}`}>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );

  const renderActivityCards = (activities) => (
    activities.map(activity => (
      <Link 
        key={activity.id} 
        to={`/actividad/${activity.id}`}
        className="activity-link"
      >
        <ActivityCard {...activity} />
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
        <section className="things-to-do">
          <div className="content-wrapper">
            <h2 className="section-title">
              Cosas que debe <span className="highlight">hacer</span>
            </h2>
            <p className="section-subtitle">
              Nos aseguramos de que se embarque en unas vacaciones perfectamente planificadas y seguras a un precio asequible.
            </p>
            <div className="features-grid">
              {renderFeatureCard(
                "Momentos de relajación",
                "Descansa en lugares de ensueño, y recarga energías para tu próxima gran aventura.",
                "blue"
              )}
              {renderFeatureCard(
                "Viajes apasionantes",
                "Comience y explore una amplia gama de emocionantes experiencias de viaje.",
                "yellow"
              )}
              {renderFeatureCard(
                "Escapadas culturales",
                "Descubre la esencia de cada destino a través de su historia, arte y gastronomía.",
                "blue"
              )}
            </div>
          </div>
        </section>

        <section className="categories-section">
          <div className="content-wrapper">
            <h2 className="section-title">Categorías</h2>
            <div className="categories-grid">
              {categories.map((category, index) => (
                <CategoryCard
                  key={index}
                  {...category}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="activities-section">
          <div className="content-wrapper">
            <h2 className="section-title">Actividades cercanas</h2>
            <div className="activities-grid">
              {renderActivityCards(randomActivities)}
            </div>
          </div>
        </section>

        <section className="activities-section popular-section">
          <div className="content-wrapper">
            <h2 className="section-title">Los más populares</h2>
            <div className="activities-grid">
              {renderActivityCards(randomPopularActivities)}
            </div>
          </div>
        </section>

        <section className="products-section">
          <div className="content-wrapper">
            <h2 className="section-title">Experiencias recomendadas</h2>
            <div className="products-grid">
              {/* Aquí irán las ProductCards */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;