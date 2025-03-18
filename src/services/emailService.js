import emailjs from '@emailjs/browser';

emailjs.init({
    publicKey: '9BXQkmT1Qi5lQYcTX',
  });
export const sendConfirmationEmail = async (userData) => {
  try {
    const templateParams = {
      to_email: userData.email,
      to_name: `${userData.nombre} ${userData.apellido}`,
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email
    };

    // Enviar el correo electrónico
    const response = await emailjs.send(
      'service_d435dcj',
      'template_t7361nx',
      templateParams
    );

    console.log('Correo de confirmación enviado:', response);
    return { success: true, message: 'Correo de confirmación enviado' };
  } catch (error) {
    console.error('Error al enviar correo de confirmación:', error);
    return { success: false, message: 'Error al enviar el correo de confirmación' };
  }
};

export const resendConfirmationEmail = async (email) => {
  try {
    // Primero, obtener los datos del usuario por email
    // Este es un ejemplo. En un caso real, deberías hacer una llamada a tu API
    const response = await fetch(`/api/usuario/${email}`);
    
    if (!response.ok) {
      throw new Error('Usuario no encontrado');
    }
    
    const userData = await response.json();
    
    // Usar la función de envío de correo existente
    return await sendConfirmationEmail(userData);
  } catch (error) {
    console.error('Error al reenviar correo de confirmación:', error);
    return { success: false, message: 'Error al reenviar el correo de confirmación' };
  }
};