export const modal = {
  pagoInmediato: {
    title: "Pago inmediato y reserva confirmada",
    content: `Esta actividad requiere pago inmediato al momento de la reserva. Solo se confirmará tu participación una vez que el pago se haya procesado con éxito.
    Asegura tu lugar ahora y recibe la confirmación de tu reserva al instante. No se permite el pago posterior.`,
    link: {
      title: "Más información",
      text: "sobre los tipos de pago.",
    },
    path: "/politicasdeuso/pagos/pagoInmediato"
  },
  reservaAhora: {
    timeBefore: "Reserva ahora",
    title: "Reserva ahora y paga después",
    content:
      `Disfruta de mayor flexibilidad en tus planes reservando ahora y pagando hasta dos días antes del inicio de la experiencia.La fecha de vencimiento del pago dependerá del método seleccionado, pero también puedes pagarlo en cualquier momento antes del plazo límite.
      Para garantizar tu reserva, deberás ingresar una tarjeta de pago al momento de la reserva.El cobro se realizará automáticamente máximo 48 horas antes de la actividad, a menos que realices el pago manualmente antes.
      Puedes revisar y gestionar tu pago en cualquier momento desde tu cuenta.`,
    link: {
      title: "Más información",
      text: "sobre los tipos de pago.",
    },
    path: "/politicasdeuso/pagos/reserveAhora"
  },
  reembolso24: {
    timeBefore: "24 horas",
    title: "Reembolso Total hasta 24 horas antes",
    content:
      "Para recibir un reembolso completo, debes cancelar la experiencia al menos 24 horas antes de su inicio. Si la cancelación se realiza con menos tiempo, no se realizará ningún reembolso. La hora límite se basa en la hora local del destino de la experiencia. Además, si las condiciones meteorológicas no permiten llevar a cabo la actividad, se te ofrecerá una nueva fecha o el reembolso total del importe pagado.",
    link: {
      title: "Más información",
      text: "sobre las cancelaciones.",
    },
    path: "/politicasdeuso/cancelaciones/reembolso24horas"
  },
  reembolso7dias: {
    timeBefore: "7 días antes",
    title: "Reembolso Total hasta 7 dias antes",
    content: `Para obtener un reembolso completo, debes cancelar tu reserva al menos 7 días antes de la fecha de la experiencia. Si cancelas con menos de 7 días de antelación, no se reembolsará el importe abonado.
    La cancelación se basa en la hora local del destino donde se realiza la experiencia.
    Además, si la experiencia se cancela por condiciones meteorológicas adversas, podrás elegir entre reprogramarla para otra fecha o recibir un reembolso total.`,
    link: {
      title: "Más información",
      text: "sobre las cancelaciones.",
    },
    path: "/politicasdeuso/cancelaciones/reembolso7dias"
  },
  noReembolsable: {
    title: "No reembolsable",
    content: "Estas experiencias no son reembolsables y no se pueden cambiar por ningún motivo. Si cancelas o pides una modificación, no se reembolsará el importe abonado.",
    link: {
      title: "Más información",
      text: "sobre las cancelaciones.",
    },
    path: "/politicasdeuso/cancelaciones/noReembolsable"
  },

}
