const jwt = require("jsonwebtoken");

// Middleware for authenticating token
const authenticationToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  jwt.verify(token, "tcmTM", (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Forbidden: Invalid or Expired Token",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticationToken;
