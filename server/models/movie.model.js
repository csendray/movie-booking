const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Keep as Number if unique within a movie
  theatre: {
    name: { type: String, required: true },
    city: { type: String, required: true },
  },
  language: { type: String, required: true },
  show_timing: { type: Date, required: true }, // ✅ Changed to Date for proper filtering
  available_seats: { type: Number, required: true }, // ✅ Changed from String to Number
  unit_price: { type: Number, required: true }, // ✅ Changed from String to Number
});

const movieSchema = new mongoose.Schema({
  movieid: { type: Number, required: true, unique: true }, // ✅ Unique identifier
  title: { type: String, required: true },
  published: { type: Boolean, default: false },
  released: { type: Boolean, default: false },
  poster_url: { type: String, required: true },
  release_date: { type: Date, required: true }, // ✅ Changed to Date type
  publish_date: { type: Date, required: true }, // ✅ Changed to Date type
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }], // ✅ Corrected ObjectId reference
  genres: [{ type: String, required: true }], // Array of genre names
  duration: { type: Number, required: true }, // ✅ Movie duration in minutes
  critic_rating: { type: Number, min: 0, max: 10 }, // ✅ Min/max range for rating
  trailer_url: { type: String, required: true },
  wiki_url: { type: String, required: true },
  story_line: { type: String, required: true },
  shows: [showSchema], // ✅ Embedded array of shows
});

// Create the Movie model
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
