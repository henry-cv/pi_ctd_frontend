import ButtonBluePill from "./ButtonBluePill";
import Navbar from "./NavBar";

const PanelTest = () => {
  return (
    <main className="panel-components">
      <h1>Panel para visualizar los componentes reutilizables</h1>
      <hr />
      <h4>Botón Acceso (Blue Pill)</h4>
      <ButtonBluePill text="Acceso" />
      <hr />
      <h4>NavBar</h4>
      <Navbar />
    </main>
  );
};

export default PanelTest;
