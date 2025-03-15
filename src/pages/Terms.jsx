import { terms } from '../constants/data/termsInfo.js';
import "../css/pages/Terms.css";
const Terms = () => {
  const literals = Object.keys(terms).filter(key => key.startsWith('literal')).map(key => terms[key]);

  console.log(literals);

  return (
    <main className='main-terms-and-conditions'>
      <h3>{terms.title}</h3>
      <ol className='terms-list' >
        {literals.map((literal, index) => (
          <li key={index}>
            <h5>{literal.title}</h5>
            <p>{literal.text}</p>
          </li>
        ))}
      </ol>
    </main>
  )
}

export default Terms