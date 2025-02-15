import Carousel from '../components/Carousel';
import SearchBox from '../components/SearchBox';
import '../css/Home.css'; // Importar los estilos

const Home = () => {
  const images = [
    '/img_bckg_home1.jpg',
    '/img_bckg_home2.jpg',
    '/img_bckg_home3.jpg'
  ];

  return (
    <div className="min-h-screen w-full relative">
      <Carousel images={images} />
      <div className="hero-content">
        <h1 className="hero-title">
          Descubre, reserva y vive nuevas experiencias
        </h1>
        <h6 className="hero-subtitle">
          Conéctate con la emoción de viajar, descubrir y disfrutar
        </h6>
      </div>
      <SearchBox />
      <div className="relative z-10 w-full">
        {/* Contenido que irá debajo del carousel */}
      </div>
    </div>
  );
};

export default Home;