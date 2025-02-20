import Carousel from '../components/Carousel';
import SearchBox from '../components/SearchBox';
import CategoryCard from '../components/CategoryCard';
import NavDash from '../components/NavDash';
import '../css/Home.css';
import { useState, useEffect } from 'react';
import ActivityCard from '../components/ActivityCard';

const Home = () => {
  const images = [
    '/bkgd_slider1.jpg',
    '/bkgd_slider2.jpg',
    '/bkgd_slider3.jpg',
  ];

  const [isLoggedIn] = useState(false);

  // Array de actividades cercanas
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

  // Array de actividades populares
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

  // Estado para las actividades cercanas aleatorias
  const [randomActivities, setRandomActivities] = useState([]);

  // Estado para las actividades populares aleatorias
  const [randomPopularActivities, setRandomPopularActivities] = useState([]);

  // Función para mezclar array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Efecto para mezclar actividades al cargar
  useEffect(() => {
    setRandomActivities(shuffleArray(activities));
  }, []);

  // Efecto para mezclar actividades populares al cargar
  useEffect(() => {
    setRandomPopularActivities(shuffleArray(popularActivities));
  }, []);

  return (
    <div className="home-container">
      {/* Header Section */}
      <section className="hero-section">
        <header className="header-container">
          <div className="content-wrapper">
            <NavDash variant="home" isLoggedIn={isLoggedIn} />
          </div>
        </header>
        <Carousel images={images} />
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

      {/* Main Content */}
      <main className="main-content">
        {/* Seccion Cosas que debe hacer */}
        <section className="things-to-do">
          <div className="content-wrapper">
            <h2 className="section-title">
              Cosas que debe <span className="highlight">hacer</span>
            </h2>
            <p className="section-subtitle">
              Nos aseguramos de que se embarque en unas vacaciones perfectamente planificadas y seguras a un precio asequible.
            </p>
            <div className="features-grid">
              <div className="feature-card blue">
                <h3 className="feature-title">Momentos de relajación</h3>
                <p className="feature-description">
                  Descansa en lugares de ensueño, y recarga energías para tu próxima gran aventura.
                </p>
              </div>
              <div className="feature-card yellow">
                <h3 className="feature-title">Viajes apasionantes</h3>
                <p className="feature-description">
                  Comience y explore una amplia gama de emocionantes experiencias de viaje.
                </p>
              </div>
              <div className="feature-card blue">
                <h3 className="feature-title">Escapadas culturales</h3>
                <p className="feature-description">
                  Descubre la esencia de cada destino a través de su historia, arte y gastronomía.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* seccion categorias */}
        <section className="categories-section">
          <div className="content-wrapper">
            <h2 className="section-title">Categorías</h2>
            <div className="categories-grid">
              <CategoryCard  
                image="/cultural-category.png" 
              />
              <CategoryCard  
                image="/food-category.png" 
              />
              <CategoryCard  
                image="/outdoor-category.png" 
              />
              <CategoryCard  
                image="/wellness-category.png" 
              />
            </div>
          </div>
        </section>

        {/* Seccion actividades cercanas */}
        <section className="activities-section">
          <div className="content-wrapper">
            <h2 className="section-title">Actividades cercanas</h2>
            <div className="activities-grid">
              {randomActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  image={activity.image}
                  title={activity.title}
                  location={activity.location}
                  duration={activity.duration}
                  price={activity.price}
                  rating={activity.rating}
                />
              ))}
            </div>
          </div>
        </section>

        {/* seccion Actividades Populares */}
        <section className="activities-section popular-section">
          <div className="content-wrapper">
            <h2 className="section-title">Los más populares</h2>
            <div className="activities-grid">
              {randomPopularActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  image={activity.image}
                  title={activity.title}
                  location={activity.location}
                  duration={activity.duration}
                  price={activity.price}
                  rating={activity.rating}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
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