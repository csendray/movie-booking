import React, { useEffect, useState } from "react";
import Header from "../components/header";
import {
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Link, useParams } from "react-router-dom";
import YouTube from "react-youtube";
import "../style/details.css";
import axios from "axios";

const Details = ({ baseUrl }) => {
  const [movie, setMovie] = useState({
    genres: [],
    trailer_url: "",
    artists: [],
  });
  const [starIcons, setStarIcons] = useState([
    { id: 1, color: "black" },
    { id: 2, color: "black" },
    { id: 3, color: "black" },
    { id: 4, color: "black" },
    { id: 5, color: "black" },
  ]);

  const { id } = useParams();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${baseUrl}movies/${id}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        console.log(response);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovie();
  }, [baseUrl, id]);

  const handleStarClick = (id) => {
    const updatedStars = starIcons.map((star) => ({
      ...star,
      color: star.id <= id ? "yellow" : "black",
    }));
    setStarIcons(updatedStars);
  };

  const handleArtistClick = (url) => {
    window.location.href = url;
  };

  const opts = {
    height: "300",
    width: "700",
    playerVars: { autoplay: 1 },
  };

  return (
    <div className="details">
      <Header id={id} baseUrl={baseUrl} showBookShowButton="true" />
      <div className="back">
        <Typography>
          <Link to="/">&#60; Back to Home</Link>
        </Typography>
      </div>
      <div className="flex-containerDetails">
        <div className="leftDetails">
          {console.log(movie)}
          <img src={movie.poster_url} alt={movie.title} />
        </div>
        <div className="middleDetails">
          <Typography variant="h4" component="h2">
            {movie.title}
          </Typography>
          <Typography>
            <span className="bold">Genres:</span> {movie.genres.join(", ")}
          </Typography>
          <Typography>
            <span className="bold">Duration:</span> {movie.duration}
          </Typography>
          <Typography>
            <span className="bold">Release Date:</span>{" "}
            {new Date(movie.release_date).toDateString()}
          </Typography>
          <Typography>
            <span className="bold">Rating:</span> {movie.critics_rating}
          </Typography>
          <Typography className="marginTop16">
            <span className="bold">Plot:</span>{" "}
            <a href={movie.wiki_url}>(Wiki Link)</a> {movie.storyline}
          </Typography>
          <div className="trailerContainer">
            <Typography>
              <span className="bold">Trailer:</span>
            </Typography>
            <YouTube videoId={movie.trailer_url.split("?v=")[1]} opts={opts} />
          </div>
        </div>
        <div className="rightDetails">
          <Typography>
            <span className="bold">Rate this movie:</span>
          </Typography>
          {starIcons.map((star) => (
            <IconButton
              key={star.id}
              onClick={() => handleStarClick(star.id)}
              style={{ color: star.color }}
            >
              <StarBorderIcon />
            </IconButton>
          ))}
          <Typography className="bold marginBottom16 marginTop16">
            Artists:
          </Typography>
          <ImageList cols={2}>
            {movie.artists &&
              movie.artists.map((artist) => (
                <ImageListItem
                  key={artist.id}
                  onClick={() => handleArtistClick(artist.wiki_url)}
                >
                  <img
                    src={artist.profile_url}
                    alt={`${artist.first_name} ${artist.last_name}`}
                  />
                  <ImageListItemBar
                    title={`${artist.first_name} ${artist.last_name}`}
                  />
                </ImageListItem>
              ))}
          </ImageList>
        </div>
      </div>
    </div>
  );
};

export default Details;
