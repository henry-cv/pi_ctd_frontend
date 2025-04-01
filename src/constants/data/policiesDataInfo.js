export const paymentPolicies = 
    [
        {
            id: "PAGO_TOTAL_ANTICIPADO",
            selectText: "Pago total anticipado",
            tittle:"Pago inmediato y reserva confirmada"
   ,        html: "- Cancela con 7 días de antelación para recibir un reembolso completo.\n\n- Si cancelas entre 3 y 6 días antes, recibirás un reembolso del 50 %.\n\n- Si cancelas con menos de 2 días de antelación, no habrá reembolso.\n\n- La hora límite se basa en la hora local del destino.\n\n- Si la actividad se cancela por mal clima, podrás reprogramar o recibir un reembolso total.",
            modal: "Esta actividad requiere pago inmediato al momento de la reserva. Solo se confirmará tu participación una vez que el pago se haya procesado con éxito.\n\nAsegura tu lugar ahora y recibe la confirmación de tu reserva al instante. No se permite el pago posterior.",
            infoCard: " Realiza el pago completo al reservar para asegurar tu cupo.",
            infoBooking: "Tu pago ha sido procesado, disfruta de tu experiencia.",
            bookingRefound: "En caso de cancelación dentro del período permitido, recibirás un reembolso según nuestras políticas.",
            bookingNoRefound: " Esta reserva no es reembolsable en caso de cancelación.",
        },
//         {
//             id: "PAGO_PARCIAL_ANTICIPADO",
//             selectText: "Pago parcial anticipado",
//             tittle:"Pago parcial ahora y paga el resto el día de la actividad"
//    ,        html: "",
//             modal: "Esta actividad requiere pago inmediato al momento de la reserva. Solo se confirmará tu participación una vez que el pago se haya procesado con éxito.\n\nAsegura tu lugar ahora y recibe la confirmación de tu reserva al instante. No se permite el pago posterior.",
//             infoCard: "asegura tu cupo y paga el resto el día de la experiencia."
//         },
//         {
//             id: "PAGO_AL_INICIO",
//             selectText: "Pago completo anticipado",
//             tittle:"Pago inmediato y reserva confirmada"
//    ,        html: "",
//             modal: "Esta actividad requiere pago inmediato al momento de la reserva. Solo se confirmará tu participación una vez que el pago se haya procesado con éxito.\n\nAsegura tu lugar ahora y recibe la confirmación de tu reserva al instante. No se permite el pago posterior.",
//             infoCard: "tu reserva se confirmará al procesar el pago del monto total."
//         },
        {
            id: "PAGO_AL_FINAL",
            selectText: "Reserva ahora paga despúes",
            tittle:"dsdfd"
   ,        html: "",
            modal: "Disfruta de mayor flexibilidad en tus planes reservando ahora y pagando hasta dos días antes del inicio de la experiencia. La fecha de vencimiento del pago dependerá del método seleccionado, pero también puedes pagarlo en cualquier momento antes del plazo límite.\n\nPara garantizar tu reserva, deberás ingresar una tarjeta de pago al momento de la reserva. El cobro se realizará automáticamente máximo 48 horas antes de la actividad, a menos que realices el pago manualmente antes.\n\nPuedes revisar y gestionar tu pago en cualquier momento desde tu cuenta.",
            infoCard: " planes flexibles asegura tu reserva , sin que se te haga el cargo hoy.",
            infoBooking: "Recuerda que el pago debe completarse antes del inicio de la actividad.",
            bookingRefound: "En caso de cancelación dentro del período permitido, recibirás un reembolso según nuestras políticas.",
            bookingNoRefound: " Esta reserva no es reembolsable en caso de cancelación.",
        }
    ];

export const cancellationPolicies = [
    {
        id: "FLEXIBLE",
        selectText: "Cancelación gratis hasta 24 horas",
        tittle:"Cancelación yReembolso Total hasta 24 Horas Antes",
        html: "",
        modal: "Para recibir un reembolso completo, debes cancelar la experiencia al menos 24 horas antes de su inicio. Si la cancelación se realiza con menos tiempo, no se realizará ningún reembolso. La hora límite se basa en la hora local del destino de la experiencia. Además, si las condiciones meteorológicas no permiten llevar a cabo la actividad, se te ofrecerá una nueva fecha o el reembolso total del importe pagado.",
        infoCard: "  antes de la experiencia (hora local)"
    },
    {
        id: "MODERADA",
        selectText: "Cancelación gratis hasta 7 días",
        tittle:" Cancelación y Reembolso Total hasta 7 Días Antes",
        html: "",
        modal: "Para obtener un reembolso completo, debes cancelar tu reserva al menos 7 días antes de la fecha de la experiencia. Si cancelas con menos de 7 días de antelación, no se reembolsará el importe abonado.\n\nLa cancelación se basa en la hora local del destino donde se realiza la experiencia.\n\nAdemás, si la experiencia se cancela por condiciones meteorológicas adversas, podrás elegir entre reprogramarla para otra fecha o recibir un reembolso total.",
        infoCard: "  antes de la experiencia (hora local)"
    },
    // {
    //     id: "ESTRICTA",
    //     selectText: "Estricta",
    //     tittle:"dsdfd,"
    // html: "",
    //     modal: "",
    //infoText: "",
    //  infoCard: "Otro texto largo Otro texto largo Otro texto largo Otro texto largo Otro texto largo "
    // },
    {
        id: "NO_REEMBOLSABLE",
        selectText: "No reembolsable",
        tittle:"dsdfd",
        html: "",
        modal: "Estas experiencias no son reembolsables y no se pueden cambiar por ningún motivo. Si cancelas o pides una modificación, no se reembolsará el importe abonado.",
        infoCard: " si cancelas no se reembolsará el importe abonado."
    }
];