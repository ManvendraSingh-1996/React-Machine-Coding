import "./App.css";
import InfiniteScroll from "./features/pages/InfiniteScroll";
import { StarRating } from "./features/pages/StarRating";
import ToastContainer from "./features/pages/ToastContainer";
import { UserContext } from "./context/UserContext";
import Parent from "./features/Hooks/Parent";

function App() {
  const user = "Manvendra Singh";
  return (
    <UserContext.Provider value={user}>
      {/* <ToastContainer /> */}
      {/* <StarRating /> */}
      {/* <InfiniteScroll /> */}
      {/* <Task /> */}
      <Parent />
    </UserContext.Provider>
  );
}

export default App;
