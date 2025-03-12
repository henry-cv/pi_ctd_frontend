import { Outlet } from "react-router-dom";
import NavDash from "../components/NavDash";
import Footer from "../components/Footer";

function UserLayout() {
  return (
    <div>
        <NavDash variant="home"/>
        <Outlet/>
        <Footer/>
    </div>
  )
}
export default UserLayout