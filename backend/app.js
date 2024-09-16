const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");
app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", UserAPI);
app.use("/api/v2", TaskAPI);
app.use("/", (req, res) => {
  res.send("Hello from backend side ");
});
app.listen(1000, () => {
  console.log("Server is running on port 1000");
});
