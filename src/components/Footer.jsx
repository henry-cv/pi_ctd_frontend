import { Link } from "react-router-dom";
import "../css/components/Footer.css";
import LogoImg from "./LogoImg";

const Footer = () => {
  return (
    <footer className="footer">

        <div className="footer-container">

          <div className="logo-socialIcons">
                <LogoImg/>
                <div className="text-and-icons">
                    <p className="tagline">Tu aventura comienza aquí.</p>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/gobook" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
          </div>

          <ul className="footer-links">
            <Link to="">Cultural</Link>
            <Link to="">Aire libre</Link>
            <Link to=""> Bienestar</Link>
            <Link to="">Gastronomía</Link>

          </ul>
        </div>

        <div className="footer-bottom">
          <p>© GooBook, 2025. Todos los derechos reservados.</p>
          <a href="#">Términos y condiciones</a>
      </div>
    </footer>
  );
};

export default Footer;
