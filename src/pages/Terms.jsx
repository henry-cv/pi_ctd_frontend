import { terms } from '../constants/data/termsInfo.js';
import "../css/pages/Terms.css";
import NavDash from '../components/NavDash.jsx';
import Footer from '../components/Footer.jsx';
import BasicBreadcrumbs from "../components/BasicBreadcrumbs";
import { useContextGlobal } from "../gContext/globalContext";
const Terms = () => {
  const literals = Object.keys(terms).filter(key => key.startsWith('literal')).map(key => terms[key]);
  const { state } = useContextGlobal();
  const { theme } = state;

  return (
    <div className="main-terms-container">
      <NavDash variant="home" />
      <main className={`main-terms-and-conditions ${theme}`} >
        <BasicBreadcrumbs />
        <h3>{terms.title}</h3>
        <ol className={`terms-list ${theme}`} >
          {literals.map((literal, index) => (
            <li key={index}>
              <h5>{literal.title}</h5>
              <p>{literal.text}</p>
            </li>
          ))}
        </ol>
      </main >
      <Footer />
    </div>
  )
}

export default Terms
