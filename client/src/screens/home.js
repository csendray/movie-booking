import React, { useEffect, useState } from "react";
import "../style/home.css";
import Header from "../components/header";
import { Grid, Card, CardContent } from "@mui/material";
import axios from "axios";
import FilterForm from "../components/FilterForm";
import { useNavigate } from "react-router-dom";

const Home = ({ baseUrl }) => {
  const [movieName, setMovieName] = useState("");
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [releasedMovies, setReleasedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [artistsList, setArtistsList] = useState([]);
  const [releaseDateStart, setReleaseDateStart] = useState("");
  const [releaseDateEnd, setReleaseDateEnd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          upcomingResponse,
          releasedResponse,
          genresResponse,
          artistsResponse,
        ] = await Promise.all([
          axios.get(`${baseUrl}movies?status=PUBLISHED`),
          axios.get(`${baseUrl}movies?status=RELEASED`),
          axios.get(`${baseUrl}genres`),
          axios.get(`${baseUrl}artists`),
        ]);

        console.log("Genres API Response:", genresResponse.data);
        console.log("Artists API Response:", artistsResponse.data);

        setUpcomingMovies(upcomingResponse.data.movies);

        setReleasedMovies(releasedResponse.data.movies);

        setGenresList(genresResponse.data);

        setArtistsList(artistsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [baseUrl]);

  const movieClickHandler = (id) => {
    console.log(`/movie/${id}`);

    navigate(`/movie/${id}`);
  };

  const filterApplyHandler = async () => {
    let queryString = "?status=RELEASED";
    if (movieName) queryString += `&title=${movieName}`;
    if (genres.length) queryString += `&genres=${genres.join(",")}`;
    if (artists.length) queryString += `&artists=${artists.join(",")}`;
    if (releaseDateStart) queryString += `&start_date=${releaseDateStart}`;
    if (releaseDateEnd) queryString += `&end_date=${releaseDateEnd}`;

    console.log(queryString);

    try {
      const response = await axios.get(
        `${baseUrl}movies${encodeURI(queryString)}`
      );
      setReleasedMovies(response.data.movies);
    } catch (error) {
      console.error("Error filtering movies:", error);
    }
  };

  return (
    <div>
      <Header baseUrl={baseUrl} />

      <div className="container">
        <div className="left-section">
          <h2 className="upcoming-movies-heading">Upcoming Movies</h2>
          <Grid container spacing={2} className="grid-list-upcoming-movies">
            {upcomingMovies.map((movie) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`upcoming-${movie._id}`}
              >
                <img
                  src={movie.poster_url}
                  className="movie-poster"
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
              </Grid>
            ))}
          </Grid>
        </div>

        <div className="right-section">
          <Card>
            <CardContent>
              <FilterForm
                movieName={movieName}
                setMovieName={setMovieName}
                genres={genres}
                setGenres={setGenres}
                artists={artists}
                setArtists={setArtists}
                releaseDateStart={releaseDateStart}
                setReleaseDateStart={setReleaseDateStart}
                releaseDateEnd={releaseDateEnd}
                setReleaseDateEnd={setReleaseDateEnd}
                applyFilter={filterApplyHandler}
                genresList={genresList}
                artistsList={artistsList}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="released-movies-section">
        <h2 className="released-movies-heading">Booking Available</h2>
        <Grid container spacing={2} className="grid-list-released-movies">
          {releasedMovies.map((movie) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={`released-${movie._id}`}
            >
              <Card
                onClick={() => movieClickHandler(movie.movieid)}
                className="released-movie-card"
              >
                <img
                  src={movie.poster_url}
                  className="movie-poster"
                  alt={movie.title}
                />
                <CardContent>
                  <h3>{movie.title}</h3>
                  <p>
                    Release Date: {new Date(movie.release_date).toDateString()}
                  </p>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Home;
