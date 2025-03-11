import PropTypes from 'prop-types';
import "./Article.css";
const Article = ({ title, content, children, width }) => {
  return (
    <article style={{ width: `${width}px` }} className='payment-article'>
      <h3 style={{ fontSize: "28px" }}>{title}</h3>
      <p>{content}</p>
      {children}
    </article>
  );
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  children: PropTypes.node,
  width: PropTypes.number.isRequired,
};

export default Article;