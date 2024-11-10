import React, { useEffect, useState } from "react";
import { CgNotes } from "react-icons/cg";
import { FaCheckDouble } from "react-icons/fa";
import { TbNotesOff } from "react-icons/tb";
import { MdPending } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import axios from "axios";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = [
    {
      title: "All tasks",
      icon: <CgNotes />,
      link: "/",
    },
    {
      title: "Completed",
      icon: <FaCheckDouble />,
      link: "/completedtask",
    },
    {
      title: "Pending",
      icon: <MdPending />,
      link: "/pendingtask",
    },
    {
      title: "Incomplete tasks",
      icon: <TbNotesOff />,
      link: "/incompletetask",
    },
  ];

  const [Data, setData] = useState();

  const logout = () => {
    dispatch(authActions.logout());
    localStorage.clear("id");
    localStorage.clear("token");
    navigate("/SignUp");
  };

  useEffect(() => {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://taskmanager-backend-ji9u.onrender.com/api/v2/get-all-task",
          { headers }
        );
        setData(response.data.data);
      } catch (error) {
        console.log("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      {Data && (
        <div>
          <h2 className="text-xl font-semibold">{Data.username}</h2>
          <h4 className="my-1 text-gray-400">{Data.email}</h4>
          <hr />
        </div>
      )}

      <div>
        {data.map((items, index) => (
          <Link
            to={items.link}
            key={index}
            className="my-2 flex items-center hover:bg-gray-700 p-2 rounded-xl transition-all duration-300"
          >
            {items.icon} &nbsp;
            {items.title}
          </Link>
        ))}
      </div>

      <div>
        <button className="bg-gray-400 w-full p-2 rounded" onClick={logout}>
          Log Out
        </button>
      </div>
    </>
  );
};

export default Sidebar;
