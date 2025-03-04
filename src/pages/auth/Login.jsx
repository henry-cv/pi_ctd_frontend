import "../../css/acceso.css";
import { MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContextGlobal } from "../../gContext/globalContext";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const Login = () => {
  const { state, dispatch } = useContextGlobal();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),
    password: Yup.string().trim().required("La contraseña es obligatoria"),
  });

  const onSubmit = async (values) => {
    try {
      const response = await axios.post("api/auth/login", values);

      if (response.status >= 200 && response.status < 300) {
        const { token } = response.data;

        localStorage.setItem("token", token);

        const decodedPayload = JSON.parse(atob(token.split(".")[1]));
        const { sub } = decodedPayload;

        const fetchUserData = async () => {
          try {
            const userResponse = await axios.get(`api/usuario/${sub}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const userData = userResponse.data;
            dispatch({
              type: "LOGIN_USER",
              payload: { user: userData, token },
            });

            Swal.fire({
              icon: "success",
              title: "Inicio de sesión exitoso",
              text: "Bienvenido de nuevo",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              navigate("/");
            });
          } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Algo salió mal. Vuelve a intentarlo más tarde.",
              confirmButtonColor: "#D61B1B",
            });
          }
        };

        fetchUserData(); // Llamamos la función para obtener los datos del usuario
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Credenciales incorrectas",
        confirmButtonColor: "#D61B1B",
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
            Inicia Sesión
          </button>
          <button type="button" className="google_auth">
            <FcGoogle fontSize={"26px"} />
            Inicia sesión con Google
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
