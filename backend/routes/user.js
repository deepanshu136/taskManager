const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exist",
      });
    } else if (username.length < 3) {
      return res.status(400).json({
        message: "Username Should have atleast 4 characters",
      });
    }
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exist",
      });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPass,
    });

    await newUser.save();

    return res.status(200).json({
      message: "User Created successfully",
    });
  } catch (error) {
    console.log("error in sign-in route", error);
    return res.status(500).json({
      message: "Internal Server error",
      error: error,
    });
  }
});

//login
router.post("/log-in", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }
  bcrypt.compare(password, existingUser.password, (err, data) => {
    if (data) {
      const authClaims = [
        {
          name: username,
        },
        { jti: jwt.sign({}, "tcmTM") },
      ];
      const token = jwt.sign({ authClaims }, "tcmTM", { expiresIn: "2d" });
      res.status(200).json({ id: existingUser._id, token: token });
    } else {
      return res.status(400).json({
        message: "invalid Credentials",
      });
    }
  });
});
module.exports = router;
