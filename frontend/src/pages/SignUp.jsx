import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const SignUp = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [Data, setData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect user to homepage if already logged in
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
    if (Data.username === "" || Data.email === "" || Data.password === "") {
      alert("All fields are required");
      return;
    }

    try {
      // Check what's being sent to the API
      console.log("Sending data:", Data);

      const response = await axios.post(
        "http://localhost:1000/api/v1/sign-in",
        Data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setData({ username: "", email: "", password: "" });
      console.log(response);

      // Handle success response
      setSuccessMessage("User created successfully");
      setErrorMessage("");
      navigate("/Login");
    } catch (error) {
      // Handle error response
      console.log("Error response:", error.response);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Sign-up failed");
      } else {
        setErrorMessage("Unable to connect to the server");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="h-[98vh] flex items-center justify-center">
      <div className="p-4 w-2/6 rounded bg-gray-800">
        <div className="text-2xl font-semibold">Sign Up</div>

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
          onChange={change}
          value={Data.username}
        />
        <input
          type="email"
          placeholder="email"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded"
          name="email"
          required
          onChange={change}
          value={Data.email}
        />
        <input
          type="password"
          placeholder="password"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded"
          name="password"
          onChange={change}
          value={Data.password}
        />
        <div className="w-full flex items-center justify-between">
          <button
            className="bg-blue-400 text-xl font-semibold text-black p-2 rounded-xl"
            onClick={submit}
          >
            Sign Up
          </button>
          <Link to="/Login" className="text-gray-400 hover:text-gray-200">
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
