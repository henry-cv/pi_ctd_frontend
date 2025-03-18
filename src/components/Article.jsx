import PropTypes from 'prop-types';
import "../css/components/Article.css";
import { useEffect, useRef } from 'react';

const Article = ({ title, content, children, width }) => {
  const isContentArray = Array.isArray(content);
  const articleIdRef = useRef(null);

  useEffect(() => {
    if (articleIdRef.current) {
      articleIdRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <article style={{ width: `${width}px` }} className='payment-article'>
      <h3 ref={articleIdRef} id="article-id" style={{ fontSize: "28px" }}>{title}</h3>

      {isContentArray ? (
        <ul className="article-list" >
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{content}</p>
      )}
      {children}
    </article>
  );
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  children: PropTypes.node,
  width: PropTypes.number.isRequired,
};

export default Article;
