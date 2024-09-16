import axios from "axios";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Cards = ({ home, setInputDiv, data, setUpdatedData }) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Function to handle task completion toggle
  const handleCompleteTask = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:1000/api/v2/update-com-task/${id}`,
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.log("Error in handleCompleteTask:", error.response?.data);
    }
  };

  const handleUpdate = (id, title, description, date) => {
    setInputDiv("fixed");
    setUpdatedData({ id, title, description, date });
  };

  // Function to handle task deletion
  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:1000/api/v2/delete-task/${id}`,
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.log("Delete Task Error:", error.response?.data);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {data &&
        data.map((items, i) => (
          <div
            key={i}
            className="flex flex-col justify-between bg-gray-700 rounded-xl p-4"
          >
            <div>
              <h3 className="text-xl font-semibold">{items.title}</h3>
              <p className="text-gray-300 my-2">{items.description}</p>
            </div>
            <div className="mt-4 w-full flex items-center ">
              <button
                className={`${
                  items.complete === false ? "bg-red-400" : "bg-green-400"
                } px-2 py-2 rounded w-3/6`}
                onClick={() => handleCompleteTask(items._id)}
              >
                {items.complete === true ? "Completed" : "Incomplete"}
              </button>

              <div className="text-white p-2 w-3/6 text-2xl flex justify-around">
                {/* Edit button */}
                {home !== false && (
                  <button
                    onClick={() =>
                      handleUpdate(
                        items._id,
                        items.title,
                        items.description,
                        items.date
                      )
                    }
                  >
                    <FaEdit />
                  </button>
                )}
                {/* Delete button */}
                <button onClick={() => deleteTask(items._id)}>
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Cards;