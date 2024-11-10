import { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";

const InputData = ({ inputDiv, setInputDiv, UpdatedData, setTasks }) => {
  const [Data, setData] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
  });

  // Populate input fields with the data to be updated
  useEffect(() => {
    setData({
      id: UpdatedData.id || "",
      title: UpdatedData.title || "",
      description: UpdatedData.description || "",
      date: UpdatedData.date || "",
    });
  }, [UpdatedData]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Handle input field changes
  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  // Submit or update task data
  const submitData = async () => {
    if (Data.title === "" || Data.description === "" || Data.date === "") {
      alert("Please fill all the fields");
    } else {
      try {
        if (Data.id) {
          // If an ID is present, update the task
          const response = await axios.put(
            `https://taskmanager-backend-ji9u.onrender.com/api/v2/update-task/${Data.id}`,
            Data,
            { headers }
          );
          alert(response.data.message);
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === Data.id ? { ...task, ...Data } : task
            )
          );
        } else {
          // If no ID, create a new task
          const response = await axios.post(
            "https://taskmanager-backend-ji9u.onrender.com/api/v2/create-task",
            Data,
            { headers }
          );
          setTasks((prevTasks) => [...prevTasks, response.data.task]); // Add new task to the list
          alert(response.data.message);
        }
        setData({ id: "", title: "", description: "", date: "" }); // Reset the input fields after submission
        setInputDiv("hidden"); // Hide the input form
      } catch (error) {
        console.error("Error in task submission:", error);
      }
    }
  };

  return (
    <>
      <div
        className={`${inputDiv} top-0 left-0 bg-gray-700 opacity-50 h-screen w-full`}
      ></div>

      <div
        className={`${inputDiv} top-0 left-0 flex items-center justify-center h-screen w-full`}
      >
        <div className="w-2/6 bg-gray-800 p-4 rounded">
          <div className="flex justify-end">
            <button className="text-2xl" onClick={() => setInputDiv("hidden")}>
              <MdOutlineCancel />
            </button>
          </div>

          <input
            type="text"
            placeholder="Title"
            name="title"
            className="p-2 rounded w-full bg-gray-700 my-3"
            value={Data.title}
            onChange={change}
          />

          <textarea
            name="description"
            cols="30"
            rows="10"
            placeholder="Description"
            className="p-2 rounded w-full bg-gray-700 my-3"
            value={Data.description}
            onChange={change}
          ></textarea>

          <input
            type="date"
            name="date"
            className="p-2 rounded w-full bg-gray-700 my-3"
            value={Data.date}
            onChange={change}
          />

          <button
            className="p-2 bg-blue-400 rounded text-black text-2xl font-semibold w-full"
            onClick={submitData}
          >
            {Data.id ? "Update Task" : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default InputData;
