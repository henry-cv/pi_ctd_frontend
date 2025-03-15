export const cancelPolicies = [
  {
    timeBefore: "24 horas",
    title: "Reembolso Total hasta 24 horas antes",
    content:
      "Para recibir un reembolso completo, debes cancelar la experiencia al menos 24 horas antes de su inicio. Si la cancelación se realiza con menos tiempo, no se realizará ningún reembolso. La hora límite se basa en la hora local del destino de la experiencia. Además, si las condiciones meteorológicas no permiten llevar a cabo la actividad, se te ofrecerá una nueva fecha o el reembolso total del importe pagado.",
    link: {
      title: "Más información",
      text: "sobre las cancelaciones.",
    },
  },
  {
    timeBefore: "48 horas",
    title: "Reembolso Parcial hasta 48 horas antes",
    content:
      "Para recibir un reembolso parcial, debes cancelar la experiencia al menos 48 horas antes de su inicio. Si la cancelación se realiza con menos tiempo, no se realizará ningún reembolso. La hora límite se basa en la hora local del destino de la experiencia.",
    link: {
      title: "Más información",
      text: "sobre las cancelaciones.",
    },
  },
];
export const articles = {
  pagos: {
    title: "Pagos",
    content:
      "Los métodos y plazos de pago dependen de la experiencia elegida. Consulta los detalles antes de reservar para conocer las opciones disponibles.",
    link1: {
      title: "Pago inmediato y reserva confirmada",
      value: "pagoInmediato",
    },
    link2: {
      title: "Reserve ahora, pague después",
      value: "reserveAhora",
    },
  },
  reserveAhora: {
    title: "Reserve ahora, pague después",
    content: [
      "Reserve ahora y pague más tarde 'le permite hacer una reserva confirmada para la mayoría de nuestros más de 200,000 tours y actividades sin pago por adelantado.",
      "No se requiere depósito, sin embargo, debe agregar una tarjeta de crédito autorizada al momento de hacer su reserva. Habrá una autorización única de un dólar (o la denominación entera más baja en cualquier moneda disponible) para validar su tarjeta de crédito.",
      "Una vez que haya completado su reserva, tendrá una reserva confirmada. Se enviará un recordatorio de pago final cinco (5) días antes de la fecha de su viaje y el pago completo deberá realizarse entre 2 y 9 * días antes de la fecha de viaje.",
      "Cuando utilice Reserve Now Pay Later, recibirá un correo electrónico de confirmación en el momento de la reserva; sin embargo, su boleto no estará disponible hasta que se haya realizado el pago completo. Tras el pago final, recibirá un correo electrónico con un enlace a su boleto.",
      "* La fecha de pago depende de la reserva / producto seleccionado."
    ],
  },
  pagoInmediato: {
    title: "Pago inmediato y reserva confirmada",
    content: ["Esta actividad requiere pago inmediato al momento de la reserva.",
      "Solo se confirmará tu participación una vez que el pago se haya procesado con éxito.",
      "Asegura tu lugar ahora y recibe la confirmación de tu reserva al instante.",
      "No se permite el pago posterior.",
      "Cuando realizas el pago de una reserva, esta se confirma de inmediato y recibirás un correo electrónico con tu boleto al instante.",
      "No es necesario realizar pagos adicionales más adelante.",
      "Asegúrate de revisar los detalles de tu reserva antes de completar la transacción, ya que las políticas de cancelación y reembolso pueden variar según la experiencia seleccionada."]
  },
  cancelaciones: {
    title: "Cancelaciones",
    content: `Las políticas de cancelación varían según la experiencia. Verifica la política aplicable antes de reservar en la sección correspondiente de cada tour o en tu boleto si ya tienes una reserva. Cancela siguiendo las instrucciones aquí.`,
    link1: {
      title: "Reembolso Total hasta 7 días antes",
      value: "reembolso7dias"
    },
    link2: {
      title: "Reembolso Total hasta 24 horas antes",
      value: "reembolso24horas"
    },
    link3: {
      title: "No reembolsable",
      value: "noReembolsable"
    },
  },
  reembolso7dias: {
    title: "Reembolso Total hasta 7 dias antes",
    content: ["Para obtener un reembolso completo, debes cancelar tu reserva al menos 7 días antes de la fecha de la experiencia.",
      "Si cancelas con menos de 7 días de antelación, no se reembolsará el importe abonado.",
      "La cancelación se basa en la hora local del destino donde se realiza la experiencia.",
      "Si la experiencia se cancela por condiciones meteorológicas adversas, podrás elegir entre reprogramarla para otra fecha o recibir un reembolso total.",
      "Para obtener un reembolso completo, debes cancelar al menos 7 días completos antes de la hora de inicio de la experiencia.",
      "Para obtener un reembolso del 50 %, debes cancelar entre 3 y 6 días completos antes de la hora de inicio de la experiencia. (Este punto no estaba incluido en el texto original).",
      "Si cancelas con menos de 2 días completos de antelación a la hora de inicio de la experiencia, no se reembolsará el importe abonado."],
  },
  reembolso24horas: {
    title: "Reembolso Total hasta 24 horas antes",
    content: ["Para obtener un reembolso completo, debes cancelar al menos 24 horas antes de la fecha/hora de inicio de la experiencia.",
      "Si cancelas con menos de 24 horas de antelación a la fecha/hora de inicio de la experiencia, no se reembolsará el importe abonado.",
      "La hora límite para la cancelación se basa en la hora local del destino de la experiencia.",
      "Si las condiciones meteorológicas impiden realizar la actividad, se te ofrecerá una nueva fecha o el reembolso total del importe pagado.",
      "No se aceptarán cambios realizados con menos de 24 horas de antelación a la fecha / hora de inicio de la experiencia."],
  },
  noReembolsable: {
    title: "No reembolsable",
    content: "Estas experiencias no son reembolsables y no se pueden cambiar por ningún motivo. Si cancelas o pides una modificación, no se reembolsará el importe abonado.",
  },
};
