import React, { useState } from "react";

// type Filter = "all" | "completed" | "pending";

// type TodoItem = {
//   id: number;
//   text: string;
//   completed: boolean;
// };

const Todo: React.FC = () => {
  let task = {
    id: Number,
    title: String,
    completed: Boolean,
    priority: String,
  };
  const [todos, setTodos] = useState([]);

  return (
    <div className="app">
      <div className="todo-container">
        <h1>React Todo Manager</h1>

        {/* Add Todo */}

        <div className="todo-form">
          <input type="text" placeholder="Enter a task..." />

          <select>
            <option value="">Priority</option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>

          <button>Add Task</button>
        </div>

        {/* Search */}

        <div className="search-box">
          <input type="text" placeholder="Search task..." />
        </div>

        {/* Filters */}

        <div className="filters">
          <button>All</button>

          <button>Completed</button>

          <button>Pending</button>
        </div>

        {/* Todo List */}

        <div className="todo-list">
          <div className="todo-card">
            <div className="todo-left">
              <input type="checkbox" />

              <div>
                <h3>Practice React Hooks</h3>

                <span className="priority high">High</span>
              </div>
            </div>

            <div className="actions">
              <button>Edit</button>

              <button>Delete</button>
            </div>
          </div>
        </div>

        {/* Summary */}

        <div className="summary">
          <span>Total : 5</span>

          <span>Completed : 2</span>

          <span>Pending : 3</span>
        </div>
      </div>
    </div>
  );
};

export default Todo;
