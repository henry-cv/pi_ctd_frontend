import Carousel from '../components/Carousel';
import SearchBox from '../components/SearchBox';
import Navbar from '../components/NavBar';
import '../css/Home.css';

const Home = () => {
  const images = [
    '/bkgd_slider1.jpg',
    '/bkgd_slider2.jpg',
    '/bkgd_slider3.jpg',
  ];

  return (
    <div className="home-container">
      <header className="header-container">
        <div className="content-wrapper">
          <Navbar />
        </div>
      </header>
      <Carousel images={images} />
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
      <div className="content-below-carousel">
        {/* Contenido que irá debajo del carousel */}
      </div>
    </div>
  );
};

export default Home;