const Categories = () => {
  const categories = [
    "Todos",
    "Cultural",
    "Gastronomía",
    "Aire libre",
    "Cuidado y bienestar",
  ];
  return (
    <div>
      <ul className="list-categories">
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
