import Header from "./components/Header";
import Footer from "./components/Footer";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import { createContext, useEffect, useState } from "react";

export const DeleteHandlerContext = createContext();

const App = () => {
  const [tasks, setTasks] = useState([]);

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
    } catch (error) {
      console.log(error.message);
    }
  };

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
  return (
    <div className="wrapper bg-gradient-to-t from-gray-900 to-teal-900 min-h-screen text-xl text-gray-100 flex flex-col py-10">
      <DeleteHandlerContext.Provider value={handleDelete}>
        <Header />
        <AddTask tasks={tasks} setTasks={setTasks} />
        <TaskList tasks={tasks} />
        <Footer />
      </DeleteHandlerContext.Provider>
    </div>
  );
};

export default App;
