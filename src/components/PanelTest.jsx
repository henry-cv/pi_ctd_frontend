import Categories from "../Routes/Categories";
import ButtonBluePill from "./ButtonBluePill";
import Navbar from "./NavBar";

const PanelTest = () => {
  return (
    <main className="panel-components">
      <h1>Panel para visualizar los componentes reutilizables</h1>
      <hr /> <br />
      <h4>Botón Acceso (Blue Pill)</h4>
      <ButtonBluePill text="Acceso" />
      <br />
      <hr />
      <br />
      <h4>Categorias</h4>
      <Categories />
      <br />
      <br />
      <h4>NavBar</h4>
      <Navbar />
      <br />
      <br />
      <br />
      <br />
    </main>
  );
};

export default PanelTest;
