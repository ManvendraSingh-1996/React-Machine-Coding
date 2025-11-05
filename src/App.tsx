import "./App.css";
import InfiniteScroll from "./features/pages/InfiniteScroll";
import { StarRating } from "./features/pages/StarRating";
import ToastContainer from "./features/pages/ToastContainer";
import { UserContext } from "./context/UserContext";
import Task from "./features/pages/Assignment";

function App() {
  const user = "Manvendra Singh";
  return (
    <UserContext.Provider value={user}>
      <ToastContainer />
      <StarRating />
      {/* <InfiniteScroll /> */}
      <Task />
    </UserContext.Provider>
  );
}

export default App;
