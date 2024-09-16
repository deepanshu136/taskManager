import React, { useState, useEffect } from "react";
import Cards from "../components/Home/Cards";
import { IoAddCircle } from "react-icons/io5";
import InputData from "../components/Home/InputData";
import axios from "axios";

const Alltasks = () => {
  const [inputDiv, setInputDiv] = useState("hidden");
  const [tasks, setTasks] = useState([]);
  const [UpdatedData, setUpdatedData] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v2/get-all-task",
          { headers }
        );
        console.log("Fetched Tasks:", response.data.tasks);
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.log("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      <div>
        <div className="w-full flex justify-end px-3 py-2">
          <button onClick={() => setInputDiv("fixed")}>
            <IoAddCircle className="text-4xl text-gray-300 hover:text-gray-100 transition-all duration-100" />
          </button>
        </div>
        {tasks.length > 0 ? (
          <Cards
            home={true}
            setInputDiv={setInputDiv}
            data={tasks}
            setUpdatedData={setUpdatedData}
          />
        ) : (
          <p>No tasks available. Click the + icon to add a task.</p>
        )}
      </div>
      <InputData
        inputDiv={inputDiv}
        setInputDiv={setInputDiv}
        UpdatedData={UpdatedData}
        setTasks={setTasks}
      />
    </>
  );
};

export default Alltasks;
