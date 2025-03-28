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
        return valorTarifa; // Si el tipo de tarifa no es reconocido, devolver el valor base
    }
  };
  
  export const fetchBookings = async (user, token) => {
    if (!token) return [];
  
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
  