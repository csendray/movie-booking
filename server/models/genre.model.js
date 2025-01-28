// moviebooking/models/genre.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Genre schema definition
const genreSchema = new Schema({
  genreid: { type: Number, required: true },
  genre: { type: String, required: true },
});

// Create Genre model
const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
