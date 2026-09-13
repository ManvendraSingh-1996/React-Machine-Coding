import { useState } from "react";

export const Todo = () => {
  const task = {
    id: 0,
    title: "",
    completed: false,
    priority: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const priority = {
    High: "High",
    Medium: "Medium",
    Low: "Low",
  };
  //   let editingTask = null;
  let selectedPriority = priority.Medium;
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      setInputValue(e.target.value);
    } else {
      setInputValue("");
    }
  };
  const handlePriorityChange = (e) => {
    selectedPriority = e.target.value;
  };
  const handleSaveTask = () => {
    // create new task based on task object and input value and add it to the todos array

    const newTask = {
      id: todos.length + 1,
      title: inputValue,
      completed: false,
      priority: selectedPriority,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // task.id = todos.length + 1;
    // task.title = inputValue;
    // task.priority = selectedPriority;
    // task.updatedAt = new Date();
    // const newTask = { ...task };

    if (!inputValue) {
      setErrorMsg("Task cannot be empty");
      setInterval(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }
    console.log(newTask, todos);
    setTodos([...todos, newTask]);
    setInputValue("");
    console.log(todos);
  };

  const handleUpdateTask = () => {
    const updatedTodos = todos.map((task) => {
      if (task.id === editingTask) {
        return {
          ...task,
          title: inputValue,
          priority: selectedPriority,
          updatedAt: new Date(),
        };
      }
      return task;
    });

    setTodos(updatedTodos);
    setInputValue("");
    // setSelectedPriority("");
    setEditingTask(null);
  };
  const completedTask = () => {
    const task = filteredTask.filter((item) => item.completed == false);
  };
  const pendingTask = () => {
    const task = filteredTask.filter((item) => item.completed == true);
  };
  const filteredTask = todos.filter((item) => {
    if (searchValue.length < 1) {
      return todos;
    }
    //   console.log(filteredTask);
    return item.title.toLowerCase().includes(searchValue.toLowerCase());
  });
  //   filteredTask();
  return (
    <div className="app">
      <div className="todo-container">
        <h1>React Todo Manager</h1>
        {/* Add Todo */}
        <div className="todo-form">
          <input
            type="text"
            placeholder="Enter a task..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <select onChange={handlePriorityChange}>
            <option value="">Priority</option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
          {!editingTask ? (
            <button onClick={handleSaveTask}>Add Task</button>
          ) : (
            <button onClick={handleUpdateTask}>Save Task</button>
          )}
        </div>
        {errorMsg && <span className="error">{errorMsg}</span>}
        {/* Search */}

        <div className="search-box">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue((prev) => (prev = e.target.value))}
            placeholder="Search task..."
          />
        </div>

        {/* Filters */}

        <div className="filters">
          <button>All</button>

          <button onClick={() => completedTask()}>Completed</button>

          <button onClick={() => pendingTask()}>Pending</button>
        </div>

        {/* Todo List */}

        <div className="todo-list">
          {filteredTask &&
            filteredTask?.map((task) => (
              <div className="todo-card" key={task.id}>
                <div className="todo-left">
                  <input
                    type="checkbox"
                    value={task.completed}
                    onChange={() => task.completed == !task.completed}
                  />

                  <div>
                    <h3>{task.title}</h3>

                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="actions">
                  {editingTask && task.id === editingTask ? (
                    <button
                      onClick={() => {
                        setEditingTask("");
                        setInputValue("");
                      }}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingTask((prev) => (prev = task.id));
                        setInputValue(task.title);
                        selectedPriority = task.priority;
                      }}
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const finalTask = todos.filter(
                        (item) => item.id !== task.id,
                      );
                      console.log("Deleted Tasks, ", finalTask);
                      setTodos(finalTask);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
