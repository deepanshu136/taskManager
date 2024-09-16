import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authActions } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [Data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Use useSelector to get isLoggedIn state

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [isLoggedIn, navigate]);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    if (Data.username === "" || Data.password === "") {
      alert("All fields are required");
      return;
    }

    try {
      // Sending login data to the API
      console.log("Sending data:", Data);

      const response = await axios.post(
        "http://localhost:1000/api/v1/log-in",
        Data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setData({ username: "", password: "" });

      // Save user info in localStorage
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);

      // Dispatch login action to Redux
      dispatch(authActions.login());

      // Handle success response
      setSuccessMessage("Login successful");
      setErrorMessage("");

      // Navigate to home or dashboard
      navigate("/"); // Adjust the route as needed
    } catch (error) {
      console.log("Error response:", error.response);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed");
      } else {
        setErrorMessage("Unable to connect to the server");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="h-[98vh] flex items-center justify-center">
      <div className="p-4 w-2/6 rounded bg-gray-800">
        <div className="text-2xl font-semibold">Log In</div>

        {errorMessage && (
          <div className="text-red-500 mb-3">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mb-3">{successMessage}</div>
        )}

        <input
          type="text"
          placeholder="username"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded"
          name="username"
          value={Data.username}
          onChange={change}
        />
        <input
          type="password"
          placeholder="password"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded"
          name="password"
          value={Data.password}
          onChange={change}
        />
        <div className="w-full flex items-center justify-between">
          <button
            className="bg-blue-400 text-xl font-semibold text-black p-2 rounded-xl"
            onClick={submit}
          >
            Login
          </button>
          <Link to="/SignUp" className="text-gray-400 hover:text-gray-200">
            Don't have an account? Signup here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
