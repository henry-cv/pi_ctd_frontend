import Carousel from '../components/Carousel';

const Home = () => {
  const images = [
    '/img_bckg_home1.jpg',
    '/img_bckg_home2.jpg',
    '/img_bckg_home3.jpg'
  ];

  return (
    <div className="w-full min-h-screen">
      <Carousel images={images} />
      
      <div className="w-full mt-[70vh]">
        {/* Contenido que irá debajo del carousel */}
      </div>
    </div>
  );
};

export default Home;