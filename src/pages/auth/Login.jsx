import "../../css/acceso.css";
import { MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useContextGlobal } from "../../gContext/globalContext";

import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const userTest = {
  id: 1,
  email: "test@test.com",
  password: "test",
  name: "Test User",
  role: "admin",
};

const Login = () => {
  const { state } = useContextGlobal();

  const initialValues = {
    email: "",
    password: "",
  };

  const [usuarios, setUsuarios] = useState([userTest]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),
    password: Yup.string().trim().required("La contraseña es obligatoria"),
  });

  const onSubmit = (values) => {
    console.log(values);

    const userFound = usuarios.find(
      (user) => user.email === values.email && user.password === values.password
    );
    if (userFound) {
      console.log("Usuario encontrado");
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido de nuevo",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        localStorage.setItem("userIdTest", userFound.id);
        // window.location.href = "/";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Credenciales incorrectas",
        confirmButtonColor: "#D61B1B",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const { touched, handleSubmit, values, errors, handleChange } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="container_login">
      {/* Logo */}
      <div className="form_login">
        <Link to={"/"}>
          <img
            src={`${
              state.theme === "dark"
                ? "./GoBook_LOGO_LIGHT.svg"
                : "./Property 1=BlackV1.svg"
            }`}
            alt="Logo Gobook"
            width={168}
          />
        </Link>
        <div className="text_auth">
          <h2 className="title_auth">Iniciar Sesión</h2>
          <p className="subtitle_auth">Ingresa los datos del formulario.</p>
        </div>
        <form className="form_auth" onSubmit={handleSubmit}>
          <div className="title_input_auth">
            <label htmlFor="email" className="label_auth">
              Email:
            </label>
            <div className="input_container">
              <MdAlternateEmail className="input_icon" />
              <input
                type="email"
                id="email"
                name="email"
                className="input_auth"
                placeholder="email@correo.com"
                onChange={handleChange}
                value={values.email}
                error={touched.email && errors.email}
              />
              {touched.email && errors.email && (
                <p className="error_mssg">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="title_input_auth">
            <label htmlFor="password" className="label_auth">
              Contraseña:
            </label>
            <div className="input_container">
              <TbLockPassword className="input_icon" />
              <input
                type="password"
                id="password"
                name="password"
                className="input_auth"
                placeholder="Ingresa la contraseña"
                onChange={handleChange}
                value={values.password}
                error={touched.password && errors.password}
              />
              {touched.password && errors.password && (
                <p className="error_mssg">{errors.password}</p>
              )}
            </div>
            <Link to="/entrar" className="link_auth_forgot">
              ¿Olvidaste tu contraseña?{" "}
            </Link>
          </div>

          <button type="submit" className="submit_auth">
            Iniciar Sesión
          </button>
          <button type="button" className="google_auth">
            <FcGoogle fontSize={"26px"} />
            Iniciar sesión con Google
          </button>
        </form>
        <div className="register_auth_text">
          <p>¿No tienes una cuenta? </p>
          <a href="/registro" className="link_auth">
            Regístrate
          </a>
        </div>
      </div>

      <div className="img_container_auth">
        <img
          src="./img_login.webp"
          alt="Imagen del login"
          height={615}
          className="img_auth"
        />
      </div>
    </div>
  );
};

export default Login;
