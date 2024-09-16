import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "./store/auth";

import Home from "./pages/Home";
import Alltasks from "./pages/Alltasks";
import CompletedTasks from "./pages/Completedtasks";
import PendingTasks from "./pages/Pendingtasks";
import IncompleteTasks from "./pages/Incompletetasks";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    // Check if user is logged in based on local storage
    if (token && id) {
      dispatch(authActions.login());
    }

    // Redirect to SignUp page if user is not logged in
    if (
      !isLoggedIn &&
      location.pathname !== "/Login" &&
      location.pathname !== "/SignUp"
    ) {
      navigate("/SignUp");
    }
  }, [isLoggedIn, location, navigate, dispatch]);

  return (
    <div className="bg-gray-600 text-white h-screen p-2 relative">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Alltasks />} />
          <Route path="completedtask" element={<CompletedTasks />} />{" "}
          {/* Completed tasks route */}
          <Route path="pendingtask" element={<PendingTasks />} />
          <Route path="incompletetask" element={<IncompleteTasks />} />
        </Route>
        <Route path="SignUp" element={<SignUp />} />
        <Route path="Login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
