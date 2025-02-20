import Carousel from '../components/Carousel';
import SearchBox from '../components/SearchBox';
import Navbar from '../components/NavBar';
import CategoryCard from '../components/CategoryCard';
import '../css/Home.css';

const Home = () => {
  const images = [
    '/bkgd_slider1.jpg',
    '/bkgd_slider2.jpg',
    '/bkgd_slider3.jpg',
  ];

  return (
    <div className="home-container">
      {/* Header Section */}
      <section className="hero-section">
        <header className="header-container">
          <div className="content-wrapper">
            <Navbar />
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
        {/* Info Blocks */}
        <section className="info-blocks">
          <div className="content-wrapper">
            <div className="info-grid">
              <div className="info-block purple">
                <h3>Reserva con anticipación</h3>
                <p>Asegura tu lugar en las mejores experiencias</p>
              </div>
              <div className="info-block yellow">
                <h3>Experiencias únicas</h3>
                <p>Vive momentos inolvidables en cada destino</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="content-wrapper">
            <h2 className="section-title">Categorías</h2>
            <div className="categories-grid">
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
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