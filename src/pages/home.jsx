import Carousel from '../components/Carousel';
import SearchBox from '../components/SearchBox';

const Home = () => {
  const images = [
    '/img_bckg_home1.jpg',
    '/img_bckg_home2.jpg',
    '/img_bckg_home3.jpg'
  ];

  return (
    <div className="min-h-screen w-full relative">
      <Carousel images={images} />
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h1 className="font-['Archivo'] text-[40px] text-white font-bold mb-4 whitespace-nowrap">
          Descubre, reserva y vive nuevas experiencias
        </h1>
        <h6 className="font-['Archivo'] text-base text-white">
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