import "./App.css";
import { lazy, Suspense } from "react";
// import InfiniteScroll from "./features/pages/InfiniteScroll";
// import { StarRating } from "./features/pages/StarRating";
// import ToastContainer from "./features/pages/ToastContainer";
// import { Task } from "./features/pages/Task.jsx";
import { UserContext } from "./context/UserContext";
import { Todo } from "./features/pages/Todo";

const RemoteTodoStats = lazy(() => import("todoRemote/RemoteTodoStats"));

function App() {
  const user = "Manvendra Singh";
  return (
    <UserContext.Provider value={user}>
      <main className="host-shell">
        <section className="host-panel">
          <div className="host-header">
            <div>
              <span className="host-kicker">Host app</span>
              <h1>Machine Coding Practice</h1>
            </div>
            <span className="host-port">localhost:5000</span>
          </div>
          <Suspense fallback={<div className="remote-loading">Loading remote module...</div>}>
            <RemoteTodoStats />
          </Suspense>
        </section>

        {/* <ToastContainer /> */}
        {/* <StarRating /> */}
        {/* <InfiniteScroll /> */}
        {/* <Task /> */}
        <Todo />
      </main>
    </UserContext.Provider>
  );
}

export default App;
