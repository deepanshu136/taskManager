import React, { useEffect, useState } from "react";
import Cards from "../components/Home/Cards";
import axios from "axios";

const CompletedTasks = () => {
  const [data, setData] = useState([]); // State to store completed tasks

  // Fetch completed tasks when the component loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const headers = {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        // API call to get completed tasks
        const response = await axios.get(
          "http://localhost:1000/api/v2/get-com-task",
          { headers }
        );
        setData(response.data.tasks || []); // Set state with completed tasks
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      }
    };

    fetchTasks(); // Trigger fetching tasks
  }, []);

  return (
    <div>
      {/* Pass completed tasks to Cards component */}
      <Cards home={false} data={data} />
    </div>
  );
};

export default CompletedTasks;
