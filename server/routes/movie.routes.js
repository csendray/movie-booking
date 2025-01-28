// moviebooking/routes/movie.routes.js
const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller.js");

// Route to get all movies or by status
router.get("/movies", movieController.findAllMovies);

// Route to get a movie by its ID
router.get("/movies/:movieId", movieController.findOne);

// Route to get shows of a movie by its ID
router.get("/movies/:movieId/shows", movieController.findShows);

// Route to get movies with multiple filters (released, title, genres, artists, start_date, end_date)
router.get("/movies/filter", movieController.findAllMovies); // Reuse findAllMovies function with filters

module.exports = router;
