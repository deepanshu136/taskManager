import React, { useEffect, useState } from "react";
import Cards from "../components/Home/Cards";
import axios from "axios";

const CompletedTasks = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const headers = {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        // API call to get completed tasks
        const response = await axios.get(
          "http://localhost:1000/api/v2/get-com-task",
          { headers }
        );

        setData(response.data.tasks || []);
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <Cards home={false} data={data} />
    </div>
  );
};

export default CompletedTasks;
