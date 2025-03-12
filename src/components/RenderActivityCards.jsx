import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Navigation, Pagination } from "swiper/modules";
import ActivityCard from "../components/ActivityCard";

const renderActivityCards = (activities) => {
  return (
    <Swiper
      navigation={true}
      modules={[Navigation, Pagination]}
      slidesPerView={"auto"}
      spaceBetween={20}
    >
      {activities.map((activity) => (
        <SwiperSlide key={activity.id} style={{ width: "auto" }}>
          <ActivityCard
            id={activity.id}
            image={
              activity.productoImagenesSalidaDto?.[0]?.rutaImagen ||
              "/activitie.webp"
            }
            title={activity.nombre}
            location={activity.direccion || "Ubicación no disponible"}
            tipoEvento={activity.tipoEvento}
            horaInicio={activity.horaInicio}
            horaFin={activity.horaFin}
            diasDisponible={activity.diasDisponible}
            duration={activity.duracion}
            price={activity.valorTarifa}
            rating={4.5}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default renderActivityCards;
