import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { DragDropContext } from "react-beautiful-dnd";
import List from "./List";
import { useGlobalContext } from "./context";
import Colors from "./Colors";

const App = () => {
  const {
    inputRef,
    tasks,
    setTasks,
    isEditing,
    setIsEditing,
    editId,
    setEditId,
    name,
    setName,
    filter,
    setFilter,
    isColorsOpen,
    setIsColorsOpen,
  } = useGlobalContext();

  const addTask = (e) => {
    e.preventDefault();
    if (name && isEditing) {
      setTasks(
        tasks.map((task) => {
          return task.id === editId ? { ...task, name: name } : task;
        })
      );
      setIsEditing(false);
      setEditId(null);
      setName("");
    } else {
      const newTask = {
        id: uuid().slice(0, 8),
        name: name,
        completed: false,
        color: "#009688",
      };
      setTasks([...tasks, newTask]);
      setName("");
    }
  };

  const filterTasks = (e) => {
    setFilter(e.target.dataset["filter"]);
  };

  const deleteAll = () => {
    setTasks([]);
  };

  useEffect(() => {
    inputRef.current.focus();
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [inputRef, tasks]);

  const handleDragEnd = (param) => {
    const srcI = param.source.index;
    const desI = param.destination?.index;
    if (desI) {
      const reOrdered = [...tasks];
      reOrdered.splice(desI, 0, reOrdered.splice(srcI, 1)[0]);
      setTasks(reOrdered);
    }
  };

  const hideColorsContainer = (e) => {
    if (e.target.classList.contains("btn-colors")) return;
    setIsColorsOpen(false);
  };

  return (
    <>
      <div className="container" onClick={hideColorsContainer}>
        {isColorsOpen && <Colors />}
        <form className="head" onSubmit={addTask}>
          <input
            type="text"
            ref={inputRef}
            placeholder="New Task"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">{isEditing ? "Save" : "Add"}</button>
        </form>
        <div className="filter">
          <button
            data-filter="all"
            className={filter === "all" ? "active" : ""}
            onClick={filterTasks}
          >
            All
          </button>
          <button
            data-filter="completed"
            className={filter === "completed" ? "active" : ""}
            onClick={filterTasks}
          >
            Completed
          </button>
          <button
            data-filter="uncompleted"
            className={filter === "uncompleted" ? "active" : ""}
            onClick={filterTasks}
          >
            Uncompleted
          </button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          {tasks.length > 0 ? (
            <List />
          ) : (
            <p className="no-tasks">Your list is clear!</p>
          )}
        </DragDropContext>
        {tasks.length > 2 && (
          <button
            className="btn-delete-all"
            onClick={deleteAll}
            title="Delete All Tasks (Completed and Uncompleted)!"
          >
            Clear All
          </button>
        )}
      </div>
    </>
  );
};

export default App;
