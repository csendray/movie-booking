const Movie = require("../models/movie.model.js");

// Helper function to parse date from MM/DD/YYYY format
const parseDateString = (dateString) => {
  const [month, day, year] = dateString.split("/");
  return `${month}/${day}/${year}`; // Returns the formatted string in MM/DD/YYYY
};

// Find all movies by status (PUBLISHED or RELEASED) with filter options
exports.findAllMovies = async (req, res) => {
  const { status, title, genres, artists, start_date, end_date } = req.query;
  // console.log(start_date, end_date);

  try {
    // Build the query for movies with dynamic conditions
    let filter = {};

    // Check for status filter
    if (status) {
      if (status === "PUBLISHED") {
        filter.published = true;
        filter.released = false;
      } else if (status === "RELEASED") {
        // filter.published = true;
        // filter.published = false;
        filter.released = true;
      }
    }

    // Check for title filter (case-insensitive search)
    if (title) {
      filter.title = { $regex: title, $options: "i" }; // case-insensitive
    }

    // Check for genres filter (split by commas for multiple genres)
    if (genres) {
      filter.genres = { $in: genres.split(",") }; // Match any of the provided genres
    }

    // Artists filter (Match full name: first_name + last_name)
    if (artists) {
      const artistPairs = artists
        .split(",")
        .map((name) => name.trim().split(" "));

      // Create $or query to match artists with both first_name and last_name
      filter.$or = artistPairs.map(([firstName, lastName]) => ({
        "artists.first_name": firstName,
        "artists.last_name": lastName,
      }));
    }

    // Check for date range filter (start_date and end_date)
    // Date range filter: Convert `release_date` (string) to a Date object
    if (start_date || end_date) {
      let dateFilter = {};

      if (start_date) {
        dateFilter.$gte = new Date(start_date);
      }

      if (end_date) {
        dateFilter.$lte = new Date(end_date);
      }

      // MongoDB `$expr` to convert `release_date` (MM/DD/YYYY) to Date
      filter.$expr = {
        $and: [
          {
            $gte: [
              {
                $dateFromString: {
                  dateString: "$release_date",
                  format: "%m/%d/%Y",
                },
              },
              dateFilter.$gte || new Date("1900-01-01"),
            ],
          },
          {
            $lte: [
              {
                $dateFromString: {
                  dateString: "$release_date",
                  format: "%m/%d/%Y",
                },
              },
              dateFilter.$lte || new Date("2100-01-01"),
            ],
          },
        ],
      };
    }

    // Fetch the movies from the database using the constructed filter
    const movies = await Movie.find(filter);

    // Get the total count of records
    const totalCount = await Movie.countDocuments(filter);

    // Return the movies data along with the total count
    res.json({ totalCount, movies });
    // // Return the movies data as JSON
    // res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving movies", error: err });
  }
};

// Find a movie by its ID
exports.findOne = async (req, res) => {
  const { movieId } = req.params;

  try {
    // Ensure `movieId` is a valid number
    const numericMovieId = Number(movieId);
    if (isNaN(numericMovieId)) {
      return res
        .status(400)
        .json({ message: "Invalid movie ID format. It must be a number." });
    }

    // Find movie by `movieid`
    const movie = await Movie.findOne({ movieid: numericMovieId });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    console.error("Error retrieving movie details:", err);
    res
      .status(500)
      .json({ message: "Error retrieving movie details", error: err.message });
  }
};

// Find shows for a specific movie by ID
exports.findShows = async (req, res) => {
  const { movieId } = req.params;

  try {
    // Ensure `movieId` is a valid number
    const numericMovieId = Number(movieId);
    if (isNaN(numericMovieId)) {
      return res
        .status(400)
        .json({ message: "Invalid movie ID format. It must be a number." });
    }

    // Find movie by `movieid`
    const movie = await Movie.findOne({ movieid: numericMovieId });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Return the `shows` array
    res.json(movie.shows || []);
  } catch (err) {
    console.error("Error retrieving shows:", err);
    res
      .status(500)
      .json({ message: "Error retrieving shows", error: err.message });
  }
};
