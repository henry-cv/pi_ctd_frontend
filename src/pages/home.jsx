import Carousel from '../components/Carousel';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const images = [
    '/img_bckg_home1.jpg',
    '/img_bckg_home2.jpg',
    '/img_bckg_home3.jpg'
  ];

  return (
    <div className="min-h-screen w-full relative">
      <Carousel images={images} />
      <div className="relative z-10">
        <SearchBar />
      </div>
      <div className="relative z-10 w-full">
        {/* Contenido que irá debajo del carousel */}
      </div>
    </div>
  );
};

export default Home;