import Header from "./components/Header";
import Footer from "./components/Footer";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import { createContext, useEffect, useState } from "react";

export const DeleteHandlerContext = createContext();
export const EditHandlerContext = createContext();

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editedText, setEditedText] = useState("");
  const [toggleEditMode, setToggleEditMode] = useState(true);

  useEffect(() => {
    //getting data from the server
    fetchingData();
  }, []);

  //fetchingData
  const fetchingData = async () => {
    try {
      const res = await fetch("https://knowing-necessary-feta.glitch.me/tasks");
      if (!res.ok) throw new Error("Something went wrong!");

      const data = await res.json();

      setTasks(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  //delete
  const handleDelete = (id) => {
    //delete data
    deleteData(id);
    //set updated tasks
  };

  const deleteData = async (id) => {
    await fetch(`https://knowing-necessary-feta.glitch.me/tasks/${id}`, {
      method: "delete",
      headers: {
        "Content-type": "aplication/json",
      },
    });
    setTasks(tasks.filter((task) => id !== task.id));
  };

  //Edit
  const handleEdit = (id) => {
    const [editableTarget] = tasks.filter((task) => id === task.id);
    editableTarget.isEditable = true;
    setEditedText(editableTarget.text);

    setTasks([...tasks]);
    setToggleEditMode(false);

    // re-arrange
    tasks
      .filter((task) => task.id !== id)
      .map((targetedEl) => (targetedEl.isEditable = false));
  };

  // editing task form handler
  const handleEditSubmitter = (e, id) => {
    e.preventDefault();

    setToggleEditMode(!toggleEditMode);

    // persist data
    const editPersistance = {
      text: editedText,
      id: id,
    };

    // put request
    puttingRequest(id, editPersistance);

    // real time update
    const [editableTarget] = tasks.filter((task) => id === task.id);
    editableTarget.isEditable = false;
    editableTarget.text = editPersistance.text;

    setTasks([...tasks]);
  };

  const puttingRequest = async (id, newData) => {
    fetch(`https://kind-daisy-map.glitch.me/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newData),
    });
  };

  return (
    <div className="wrapper bg-gradient-to-t from-gray-900 to-teal-900 min-h-screen text-xl text-gray-100 flex flex-col py-10">
      <DeleteHandlerContext.Provider value={handleDelete}>
        <EditHandlerContext.Provider value={handleEdit}>
          <Header />
          <AddTask tasks={tasks} setTasks={setTasks} />
          <TaskList
            tasks={tasks}
            error={error}
            loading={loading}
            handleEditSubmitter={handleEditSubmitter}
            editedText={editedText}
            setEditedText={setEditedText}
          />
          <Footer />
        </EditHandlerContext.Provider>
      </DeleteHandlerContext.Provider>
    </div>
  );
};

export default App;
