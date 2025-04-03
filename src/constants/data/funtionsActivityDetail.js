export const separateDays = (texto) => {
    const diasSemana = [
      "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO", "DOMINGO"
    ];
  
    return diasSemana.filter((dia) => texto.includes(dia));
  };
  

  