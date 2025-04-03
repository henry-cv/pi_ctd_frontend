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
  setShowDate,
  setIsBooking,
  isBooking
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

  const handleOpenCalendar = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
    setShowDate(false);
  };

  const handleCloseBookingModal = () => {
    resetBookingData();
    setErrorsBooking((prevErrors) => ({
      ...prevErrors,
      date: "",
      slot: "",
    }));
    setIsBooking(false);
    setResetCalendar(true);
    handleClose();
  };

  // This is the function that was causing the loop
  const handleSelectDate = (date) => {
    // Only update if date is valid and there's an actual change
    if (date && !isNaN(date.getTime())) {
      // Check if this is actually a different date before setting
      const currentDateString = date.toDateString();
      
      setShowDate(true);
      
      // Clear error if there was one
      if (errorsBooking.date) {
        setErrorsBooking((prevErrors) => ({
          ...prevErrors,
          date: "",
        }));
      }
      
      // Set the booking date
      setBookingDate(date);
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