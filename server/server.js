// moviebooking/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const movieRoutes = require("./routes/movie.routes.js");
const genreRoutes = require("./routes/genre.routes.js");
const artistRoutes = require("./routes/artist.routes.js");
const userRoutes = require("./routes/user.routes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8085;

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing middleware

// Enable CORS for all routes (You can also restrict it to specific origins if needed)
app.use(cors()); // Allow all domains by default

// MongoDB Atlas URI from .env file
const uri = process.env.MONGO_URI;

// Connect to MongoDB Atlas using the URI from the .env file
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
// Use Routes
app.use("/api", movieRoutes);
app.use("/api", genreRoutes);
app.use("/api", artistRoutes);
app.use("/api", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
