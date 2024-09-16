const mongoose = require("mongoose");

const conn = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if not able to connect
    });

    // If the connection is successful, log the message
    console.log("Connection Successful");
  } catch (error) {
    // Handle any errors during connection
    console.error("Error connecting to MongoDB:", error.message);
    if (error.name === "MongoServerSelectionError") {
      console.error("Make sure your MongoDB server is running and accessible.");
    }
  }
};

// Call the connection function
conn();

module.exports = conn;
