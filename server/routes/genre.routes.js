// moviebooking/routes/genre.routes.js
const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre.controller.js");

// Route to get all genres
router.get("/genres", genreController.findAllGenres);

module.exports = router;
