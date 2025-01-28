// moviebooking/controllers/artist.controller.js
const Artist = require("../models/artist.model.js");

// Find all artists
exports.findAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving artists", error: err });
  }
};
