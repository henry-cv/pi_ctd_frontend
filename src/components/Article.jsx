import PropTypes from 'prop-types';
import "../css/components/Article.css";

const Article = ({ title, content, children, width }) => {
  const isContentArray = Array.isArray(content);

  return (
    <article style={{ width: `${width}px` }} className='payment-article'>
      <h3 style={{ fontSize: "28px" }}>{title}</h3>

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
