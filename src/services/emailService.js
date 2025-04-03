import emailjs from '@emailjs/browser';

// Inicialización de EmailJS
emailjs.init({
  publicKey: '9BXQkmT1Qi5lQYcTX',
});

/**
 * Envía un email de confirmación a un usuario recién registrado
 * @param {Object} userData - Datos del usuario (nombre, apellido, email)
 * @returns {Promise<Object>} - Resultado del envío
 */
export const sendConfirmationEmail = async (userData) => {
  try {
    // Verificar que tenemos un email válido
    if (!userData || !userData.email) {
      console.error('Error: No hay dirección de email de usuario válida para enviar la confirmación');
      return { 
        success: false, 
        message: 'No hay dirección de email válida',
      };
    }

    // Debug de datos recibidos
    console.log('Datos para email de registro:', {
      email: userData.email,
      nombre: userData.nombre,
      apellido: userData.apellido
    });

    // IMPORTANTE: Usar 'email' en lugar de 'to_email' para que coincida con la plantilla
    const templateParams = {
      from_name: "GoBook",
      reply_to: "noreply@gobook.com",
      email: userData.email, // Cambiado de to_email a email
      to_name: `${userData.nombre || ''} ${userData.apellido || ''}`.trim() || 'Estimado usuario',
      nombre: userData.nombre || '',
      apellido: userData.apellido || '',
      site_url: window.location.origin
    };

    console.log('Enviando email de confirmación a:', userData.email);
    console.log('Parámetros de la plantilla:', JSON.stringify(templateParams, null, 2));
    
    // Enviar el correo electrónico
    const response = await emailjs.send(
      'service_d435dcj',
      'template_t7361nx',
      templateParams
    );

    console.log('Correo de confirmación enviado:', response);
    return { success: true, message: 'Correo de confirmación enviado', response };
  } catch (error) {
    console.error('Error al enviar correo de confirmación:', error);
    console.error('Detalles del error:', error.text || error.message || 'Error desconocido');
    return { success: false, message: 'Error al enviar el correo de confirmación', error };
  }
};

/**
 * Reenvía un email de confirmación a un usuario existente
 * @param {string} email - Email del usuario
 * @returns {Promise<Object>} - Resultado del envío
 */
export const resendConfirmationEmail = async (email) => {
  try {
    // Obtener los datos del usuario por email
    const response = await fetch(`/api/usuario/${email}`);
    
    if (!response.ok) {
      throw new Error('Usuario no encontrado');
    }
    
    const userData = await response.json();
    
    // Usar la función de envío de correo existente
    return await sendConfirmationEmail(userData);
  } catch (error) {
    console.error('Error al reenviar correo de confirmación:', error);
    return { success: false, message: 'Error al reenviar el correo de confirmación', error };
  }
};

/**
 * Envía un email de confirmación de reserva al usuario
 * @param {Object} reservationData - Datos de la reserva
 * @param {Object} userData - Datos del usuario
 * @param {Object} activityData - Datos de la actividad
 * @returns {Promise<Object>} - Resultado del envío
 */
export const sendReservationConfirmation = async (reservationData, userData, activityData) => {
  try {
    // Verificar que tenemos un email válido
    if (!userData || !userData.email) {
      console.error('Error: No hay dirección de email de usuario válida para enviar la confirmación');
      return { 
        success: false, 
        message: 'No hay dirección de email válida',
      };
    }

    // Debug de datos recibidos
    console.log('Datos para email de confirmación:', {
      userData: { ...userData, email: userData.email },
      reservationData: { ...reservationData, id: reservationData.id },
      activityData: { ...activityData, nombre: activityData?.nombre }
    });
    
    // Formatear la fecha para mostrarla en el email
    let formattedDate = "No disponible";
    let formattedTime = "No disponible";
    
    if (reservationData.disponibilidadProductoSalidaDto?.fechaEvento) {
      const date = new Date(reservationData.disponibilidadProductoSalidaDto.fechaEvento);
      formattedDate = date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } else if (typeof reservationData.date === 'string') {
      const date = new Date(reservationData.date);
      formattedDate = date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    
    // Formatear la hora
    if (activityData?.horaInicio && activityData?.horaFin) {
      formattedTime = `${activityData.horaInicio.substring(0, 5)} - ${activityData.horaFin.substring(0, 5)}`;
    }
    
    // IMPORTANTE: Usar 'email' en lugar de 'to_email' para que coincida con la plantilla
    const templateParams = {
      from_name: "GoBook",
      reply_to: "noreply@gobook.com",
      email: userData.email, // Cambiado de to_email a email
      to_name: `${userData.nombre || ''} ${userData.apellido || ''}`.trim() || 'Estimado usuario',
      confirmation_code: reservationData.codigoConfirmacion || 'No disponible',
      activity_name: activityData?.nombre || 'Actividad reservada',
      reservation_date: formattedDate,
      reservation_time: formattedTime,
      num_slots: reservationData.cantidadPersonas || reservationData.slot || 1,
      price_per_person: activityData?.valorTarifa || 0,
      total_price: reservationData.totalPrice || 0,
      reservation_link: `${window.location.origin}/perfil`,
      activity_image: activityData?.imagenPrincipal || 'https://gobook-backend.up.railway.app/images/gobook-white-logo.png',
      location: `${activityData?.ciudad || ''}, ${activityData?.pais || ''}`.trim() || 'Ubicación no especificada'
    };

    console.log('Enviando email de confirmación de reserva a:', userData.email);
    console.log('Parámetros de la plantilla:', JSON.stringify(templateParams, null, 2));
    
    // Enviar el correo electrónico usando la plantilla de reserva
    const response = await emailjs.send(
      'service_d435dcj',
      'template_reservation', // Nombre correcto de la plantilla en EmailJS
      templateParams
    );

    console.log('Correo de confirmación de reserva enviado:', response);
    return { 
      success: true, 
      message: 'Correo de confirmación de reserva enviado',
      response 
    };
  } catch (error) {
    console.error('Error al enviar correo de confirmación de reserva:', error);
    console.error('Detalles del error:', error.text || error.message || 'Error desconocido');
    return { 
      success: false, 
      message: 'Error al enviar el correo de confirmación de reserva',
      error 
    };
  }
};