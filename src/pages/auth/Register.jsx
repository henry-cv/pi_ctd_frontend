import { Link } from "react-router-dom";
import "../../css/acceso.css";
import { useContextGlobal } from "../../gContext/globalContext";
import { RiUserSmileLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const { state } = useContextGlobal();

  const initialValues = {
    name: "",
    lastname: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().trim().required("El nombre es obligatorio."),
    lastname: Yup.string().trim().required("El apellido es obligatorio."),
    email: Yup.string()
      .email("El email no es válido.")
      .required("El email es obligatorio."),
    password: Yup.string()
      .trim()
      .min(6, "La contraseña debe tener por lo menos 6 carácteres.")
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*\W)/,
        "La contraseña debe contener al menos una mayúscula, un número y un símbolo."
      )
      .required("La contraseña es obligatoria."),
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  const {
    touched,
    handleSubmit,
    values,
    errors,
    handleChange,
    getFieldProps,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="container_register">
      <div className="form_register">
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
        <div className="text_auth_register">
          <h2 className="title_auth">Crear Cuenta</h2>
          <p className="subtitle_auth">
            Ingresá los datos del formulario para registrarte.
          </p>
        </div>
        <form className="form_auth_register" onSubmit={handleSubmit}>
          <div className="name_lastname">
            <div className="title_input_auth">
              <label htmlFor="name" className="label_auth">
                Nombre: <span className="required_auth">*</span>
              </label>
              <div className="input_container">
                <RiUserSmileLine className="input_icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input_auth_register"
                  placeholder="Ingresa tu nombre"
                  onChange={handleChange}
                  value={values.name}
                  error={touched.name && errors.name}
                />
                {touched.name && errors.name && (
                  <p className="error_mssg_register">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="title_input_auth">
              <label htmlFor="lastname" className="label_auth">
                Apellido: <span className="required_auth">*</span>
              </label>
              <div className="input_container">
                <RiUserSmileLine className="input_icon" />
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  className="input_auth_register"
                  placeholder="Ingresa tu apellido"
                  onChange={handleChange}
                  value={values.lastname}
                  error={touched.lastname && errors.lastname}
                />
                {touched.lastname && errors.lastname && (
                  <p className="error_mssg_register">{errors.lastname}</p>
                )}
              </div>
            </div>
          </div>
          <div className="title_input_auth">
            <label htmlFor="email" className="label_auth">
              Email: <span className="required_auth">*</span>
            </label>
            <div className="input_container">
              <MdAlternateEmail className="input_icon" />
              <input
                type="email"
                id="email"
                name="email"
                className="input_auth_register"
                placeholder="email@correo.com"
                onChange={handleChange}
                value={values.email}
                error={touched.email && errors.email}
              />
              {touched.email && errors.email && (
                <p className="error_mssg_register">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="title_input_auth">
            <label htmlFor="password" className="label_auth">
              Contraseña: <span className="required_auth">*</span>
            </label>
            <div className="input_container">
              <TbLockPassword className="input_icon" />
              <input
                type="password"
                id="password"
                name="password"
                className="input_auth_register"
                placeholder="Ingresa la contraseña"
                onChange={handleChange}
                value={values.password}
                error={touched.password && errors.password}
              />
              {touched.password && errors.password && (
                <p className="error_mssg_register">{errors.password}</p>
              )}
            </div>
          </div>

          <button type="submit" className="submit_auth">
            Registrarse
          </button>
        </form>
        <div className="register_auth_text">
          <p>¿Ya tienes una cuenta? </p>
          <a href="/entrar" className="link_auth">
            Iniciar Sesión
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

export default Register;
