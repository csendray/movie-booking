// moviebooking/controllers/genre.controller.js
const Genre = require("../models/genre.model.js");

// Find all genres
exports.findAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving genres", error: err });
  }
};
