export const calcularPrecio = (cantidadPersonas, tipoTarifa, valorTarifa) => {
    switch (tipoTarifa) {
      case "POR_PERSONA":
        return cantidadPersonas * valorTarifa;
      case "POR_PAREJA":
        return Math.ceil(cantidadPersonas / 2) * valorTarifa;
      case "POR_GRUPO_6":
        return Math.ceil(cantidadPersonas / 6) * valorTarifa;
      case "POR_GRUPO_10":
        return Math.ceil(cantidadPersonas / 10) * valorTarifa;
      default:
        return valorTarifa;
    }
  };
  
  export const fetchBookings = async (user, token) => {
    if (!token) return [];

    console.log("entre al fetchBookings", user, token);
    
  
    try {
      const response = await fetch(`/api/reserva/usuario/${user.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener reservas");
      }
  
      const data = await response.json();
  
      const reservations = await Promise.all(
        data.map(async (reserva) => {
          const id = reserva.disponibilidadProductoSalidaDto.productoId;
  
          try {
            const productResponse = await fetch(`/api/producto/${id}`);
  
            if (!productResponse.ok) {
              throw new Error("Error al obtener producto");
            }
  
            const product = await productResponse.json();
  
            return {
              bookingData: reserva,
              productData: product,
            };
          } catch (productError) {
            console.warn("Error al obtener el producto:", productError.message);
            return {
              bookingData: null,
              productData: null,
            };
          }
        })
      );
  
      return reservations;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };



  export const onlyFetchBooking = async (id, token) => {
    if (!token) return [];
  
    console.log("entre al onlyfetchBookings", id);
  
    try {
      const response = await fetch(`/api/reserva/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Error al obtener reservas");
  
      const reserva = await response.json();
      const id2 = reserva.disponibilidadProductoSalidaDto.productoId;
  
      const productResponse = await fetch(`/api/producto/${id2}`);
      if (!productResponse.ok) throw new Error("Error al obtener producto");
  
      const product = await productResponse.json();
      const id3 = product.id
     
      const disponibilityResponse = await fetch(`/api/disponibilidad/${id3}`);
      if (!disponibilityResponse.ok) throw new Error("Error al obtener disponibilidad de actividad");
      
      const disponibility = await disponibilityResponse.json();
  
      return { bookingData: reserva, productData: product, disponibilityData:disponibility };  
  
    } catch (error) {
      console.error("Error:", error);
      return { bookingData: null, productData: null };
    }
  };
  

  export const formatFecha = (fechaStr)=> {
    const fecha = new Date(fechaStr + "T00:00:00");
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  export const calcularCupos = (cantidadPersonas, tipoTarifa) => {
    switch (tipoTarifa) {
      case "POR_PERSONA":
        return cantidadPersonas /1;
      case "POR_PAREJA":
        return Math.ceil(cantidadPersonas / 2) ;
      case "POR_GRUPO_6":
        return Math.ceil(cantidadPersonas / 6) ;
      case "POR_GRUPO_10":
        return Math.ceil(cantidadPersonas / 10) ;
      default:
        return "no es posible calcular los cupos";
    }
  };

  
  export const handleGoWhatsApp = (phoneNumber ) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

