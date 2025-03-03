/* ---------------------------------- texto --------------------------------- */
export function validarTexto(texto, maximo) {
  texto = normalizarTexto(texto);
  /* console.log(`Texto normalizado: ${texto}`);
  console.log(`Texto validado: ${/^[a-záéíóúñ]{3,}$/i.test(texto)}`); */
  const regex = new RegExp(`^[a-záéíóúñ ]{4,${maximo}}$`, 'i');
  return regex.test(texto);
}
export function validarAreaTexto(texto, maximo) {
  texto = normalizarTexto(texto);
  /* console.log(`Texto normalizado: ${texto}`);
  console.log(`Texto validado: ${/^[a-záéíóúñ]{3,}$/i.test(texto)}`); */
  const regex = new RegExp(`^[\\wáéíóúñ ,.;-]{4,${maximo}}$`, 'i');
  return regex.test(texto);
}
export function longitudPermitida(texto, maximo) {
  texto = normalizarTexto(texto);
  return texto.length <= maximo;
}
export function direccionMaxCaracteres(texto) {
  texto = normalizarTexto(texto);
  return texto.length <= 60;
}
export function normalizarTexto(texto) {
  // Agrega Capitalización a texto
  texto = texto.trim();
  // slice(a,b), son indices a inicial, b final, excluyente
  return texto.charAt(0).toUpperCase().concat(texto.slice(1));
}

/* ---------------------------------- email --------------------------------- */
export function validarEmail(email) {
  email = normalizarEmail(email);
  // console.log(`Email: *${email}*`);
  return /^[\w.]{4,}@[a-z]{3,}\.[a-z]{2,4}$/.test(email);
}

export function normalizarEmail(email) {
  // console.log(`-->${email.trim()}<--`);
  return email.trim();
}

/* -------------------------------- password -------------------------------- */
export function validarContrasenia(contrasenia) {
  return /^\w{6,}$/i.test(contrasenia);
}

export function compararContrasenias(contrasenia_1, contrasenia_2) {
  return contrasenia_1 === contrasenia_2;
}
