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
  }) => {
    const validateCreateBooking = (bookingDate, quantity) => {
      const newErrors = {};

      console.log(bookingDate ,"y la ", quantity);
      
  
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
      setAnchorEl(event.currentTarget)
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
      setResetCalendar(true);
      handleClose();
    };
  
    const handleSelectDate = (date) => {
      console.log("la fecha que me mandan dessde el calendario",date);
      setShowDate(true)
      
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
  