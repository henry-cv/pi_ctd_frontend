import "../css/dashboard.css";
import FormNewCategory from "./FormNewCategory";

const DashCategorias = () => {
  return (
    <>
      <div className="categories_container">
        <header className="header_categories">
          <h2>Nueva Categoría</h2>
        </header>
        <div className="table_categories">
          <div><span className="titleTable">Categoría</span></div>
          <div><span className="titleTable">Acciones</span></div>
        </div>
      </div>
      <FormNewCategory />
    </>
  );
};

export default DashCategorias;
