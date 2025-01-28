// moviebooking/models/artist.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Artist schema definition
const artistSchema = new Schema({
  artistid: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  wiki_url: { type: String, required: true },
  profile_url: { type: String, required: true },
  movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }], // Linking movies to artists
});

// Create Artist model
const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;
