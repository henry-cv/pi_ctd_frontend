import { useContextGlobal } from "../../gContext/globalContext";
import BookingsConfirm from "./BookingsConfirm";


const UserBookings = () => {
      const { state } = useContextGlobal();

    const renderActiveFilter = () => {
        switch(state.userFiltersTabs.selectedFilters) {
          case "confirm":
            return <BookingsConfirm/>;
          case "complete":
            return <BookingsConfirm/>;
          case "cancel":
            return <BookingsConfirm/>;
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
