export const funtionsBookingModal = ({
    setBookingDate,
    setQuantity,
    setPriceQuantity,
    setErrorsBooking,
    setResetCalendar,
    handleClose,
    setAnchorEl,
    setAnchorElQuantity,
    setOpenQuantity,
    valorTarifa,
    errorsBooking,
  }) => {
    const validateCreateBooking = (bookingDate, quantity) => {
      const newErrors = {};
  
      if (!bookingDate) {
        newErrors.date = "Escoger la fecha es requerida";
      }
  
      if (quantity === 0) {
        newErrors.slot = "La cantidad de reservas es requerido";
      }
  
      setErrorsBooking(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleOpenCalendar = (event) => setAnchorEl(event.currentTarget);
  
    const handleCloseCalendar = () => setAnchorEl(null);
  
    const handleOpenBookingQuantity = (event) => {
      setAnchorElQuantity(event.currentTarget);
      setOpenQuantity(true);
    };
  
    const handleCloseBookingQuantity = (newQuantity) => {
      if (typeof newQuantity === "number") {
        setPriceQuantity(newQuantity * valorTarifa);
      }
      setOpenQuantity(false);
      setAnchorElQuantity(null);
    };
  
    const resetBookingData = () => {
      setBookingDate(null);
      setQuantity(0);
      setPriceQuantity(0);
    };
  
    const handleCloseBookingModal = () => {
      resetBookingData();
      setErrorsBooking((prevErrors) => ({
        ...prevErrors,
        date: "",
        slot: "",
      }));
      setResetCalendar(true);
      handleClose();
    };
  
    const handleSelectDate = (date) => {
      setBookingDate(date);
      if (errorsBooking.date) {
        setErrorsBooking((prevErrors) => ({
          ...prevErrors,
          date: "",
        }));
      }
    };
  
    const handleSelectQuantity = (newQuantity) => {
      setQuantity(newQuantity);
      if (errorsBooking.slot) {
        setErrorsBooking((prevErrors) => ({
          ...prevErrors,
          slot: "",
        }));
      }
      setOpenQuantity(false);
    };
  
    return {
      validateCreateBooking,
      handleOpenCalendar,
      handleCloseCalendar,
      handleOpenBookingQuantity,
      handleCloseBookingQuantity,
      resetBookingData,
      handleCloseBookingModal,
      handleSelectDate,
      handleSelectQuantity,
    };
  };
  