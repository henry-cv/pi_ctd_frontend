export const paymentPolicies = 
    [
        {
            id: "PAGO_TOTAL_ANTICIPADO",
            selectText: "Pago total anticipado",
            html: "",
            modal: "Disfruta de mayor flexibilidad en tus planes reservando ahora y pagando hasta dos días antes del inicio de la experiencia. La fecha de vencimiento del pago dependerá del método seleccionado, pero también puedes pagarlo en cualquier momento antes del plazo límite.Para garantizar tu reserva, deberás ingresar una tarjeta de pago al momento de la reserva. El cobro se realizará automáticamente máximo 48 horas antes de la actividad, a menos que realices el pago manualmente antes."
        },
        {
            id: "PAGO_PARCIAL_ANTICIPADO",
            selectText: "Pago parcial anticipado",
            html: "",
            modal: "Realiza un pago parcial para confirmar tu reserva. El resto se paga el día de la experiencia.Si cancelas con al menos 7 días de antelación, recibirás un reembolso completo."
        },
        {
            id: "PAGO_AL_INICIO",
            selectText: "Pago al inicio",
            html: "",
            modal: "Esta actividad requiere pago inmediato al momento de la reserva. Solo se confirmará tu participación una vez que el pago se haya procesado con éxito.Asegura tu lugar ahora y recibe la confirmación de tu reserva al instante. No se permite el pago posterior."
        },
        {
            id: "PAGO_AL_FINAL",
            selectText: "Pago al final",
            html: "",
            modal: "Otro texto largo Otro texto largo Otro texto largo Otro texto largo Otro texto largo "
        }
    ];

export const cancellationPolicies = [
    {
        id: "FLEXIBLE",
        selectText: "Flexible",
        html: "",
        modal: "Para obtener un reembolso completo, debes cancelar tu reserva al menos 7 días antes de la fecha de la experiencia. Si cancelas con menos de 7 días de antelación, no se reembolsará el importe abonado.La cancelación se basa en la hora local del destino donde se realiza la experiencia."
    },
    {
        id: "MODERADA",
        selectText: "Moderada",
        html: "",
        modal: "Para recibir un reembolso completo, debes cancelar la experiencia al menos 24 horas antes de su inicio. Si la cancelación se realiza con menos tiempo, no se realizará ningún reembolso. La hora límite se basa en la hora local del destino de la experiencia. Además, si las condiciones meteorológicas no permiten llevar a cabo la actividad, se te ofrecerá una nueva fecha o el reembolso total del importe pagado."
    },
    {
        id: "ESTRICTA",
        selectText: "Estricta",
        html: "",
        modal: "Otro texto largo Otro texto largo Otro texto largo Otro texto largo Otro texto largo "
    },
    {
        id: "NO_REEMBOLSABLE",
        selectText: "No reembolsable",
        html: "",
        modal: "Estas experiencias no son reembolsables y no se pueden cambiar por ningún motivo. Si cancelas o pides una modificación, no se reembolsará el importe abonado."
    }
];