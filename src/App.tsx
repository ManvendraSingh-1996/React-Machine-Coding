import "./App.css";
import { lazy, Suspense } from "react";
// import InfiniteScroll from "./features/pages/InfiniteScroll";
// import { StarRating } from "./features/pages/StarRating";
// import ToastContainer from "./features/pages/ToastContainer";
// import { Task } from "./features/pages/Task.jsx";
import { UserContext } from "./context/UserContext";
import Parent from "./features/pages/Parent";
import { Todo } from "./features/pages/Todo";

// const RemoteDashboard = lazy(() => import("remoteApp/Dashboard"));
function App() {
  const user = "Manvendra Singh";
  return (
    <UserContext.Provider value={user}>
      {/* <ToastContainer /> */}
      {/* <StarRating /> */}
      {/* <InfiniteScroll /> */}
      {/* <Task /> */}
      <Parent />
      <Todo />
      {/* <Suspense fallback={<div>Loading Remote Dashboard...</div>}>
        <RemoteDashboard />
      </Suspense> */}
    </UserContext.Provider>
  );
}

export default App;
