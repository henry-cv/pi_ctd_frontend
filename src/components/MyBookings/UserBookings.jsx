import { useContextGlobal } from "../../gContext/globalContext";
import BookingsConfirm from "./BookingsConfirm";


const UserBookings = () => {
      const { state } = useContextGlobal();

    const renderActiveFilter = () => {
        switch(state.userFiltersTabs.selectedFilters) {
          case "confirm":
            return <BookingsConfirm/>;
          case "complete":
            return <p>las finalizadas</p>;
          case "cancel":
            return <p>las canceladas</p>;
          default:
            return <p>las canceladas</p>;
        }
      };
    
 
    return (
        <div className="">
            {renderActiveFilter()}

        </div>
    );
}

export default UserBookings;
