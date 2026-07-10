import "./App.css";
// import InfiniteScroll from "./features/pages/InfiniteScroll";
// import { StarRating } from "./features/pages/StarRating";
// import ToastContainer from "./features/pages/ToastContainer";
// import { Task } from "./features/pages/Task.jsx";
import { UserContext } from "./context/UserContext";
import Todo from "./features/pages/Todo";
// import { Accordion } from "./components/Accordion";

function App() {
  const user = "Manvendra Singh";
  return (
    <UserContext.Provider value={user}>
      {/* <ToastContainer /> */}
      {/* <StarRating /> */}
      {/* <InfiniteScroll /> */}
      {/* <Task /> */}
      {/* <Accordion /> */}
      <Todo />
    </UserContext.Provider>
  );
}

export default App;
