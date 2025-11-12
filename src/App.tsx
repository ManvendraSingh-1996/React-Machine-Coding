import "./App.css";
import InfiniteScroll from "./features/pages/InfiniteScroll";
import { StarRating } from "./features/pages/StarRating";
import ToastContainer from "./features/pages/ToastContainer";
import { UserContext } from "./context/UserContext";
import Parent from "./features/Hooks/Parent";
import StepForm from "./features/pages/StepForm";
import VirtualizedList from "./features/pages/VirtualizedList";

function App() {
  const user = "Manvendra Singh";
  return (
    <UserContext.Provider value={user}>
      {/* <ToastContainer /> */}
      {/* <StarRating /> */}
      {/* <InfiniteScroll /> */}
      {/* <Task /> */}
      {/* <StepForm /> */}
      {/* <Parent /> */}
      <VirtualizedList />
    </UserContext.Provider>
  );
}

export default App;
