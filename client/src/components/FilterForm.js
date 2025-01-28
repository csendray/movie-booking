import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import "../style/FilterForm.css";

const FilterForm = ({
  movieName,
  setMovieName,
  genres,
  setGenres,
  artists,
  setArtists,
  releaseDateStart,
  setReleaseDateStart,
  releaseDateEnd,
  setReleaseDateEnd,
  applyFilter,
  genresList,
  artistsList,
}) => {
  return (
    <div>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        FIND MOVIES BY:
      </Typography>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Movie Name"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="genres-label">Genres</InputLabel>
        <Select
          labelId="genres-label"
          multiple
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          renderValue={(selected) => selected.join(", ")}
        >{
            console.log(genresList)
        }
          {genresList &&
            genresList.map((genre) => (
              <MenuItem key={genre.genreid} value={genre.genre}>
                <Checkbox checked={genres.indexOf(genre.genre) > -1} />
                <ListItemText primary={genre.genre} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="artists-label">Artists</InputLabel>
        <Select
          labelId="artists-label"
          multiple
          value={artists}
          onChange={(e) => setArtists(e.target.value)}
          renderValue={(selected) => selected.join(", ")}
        >{
            console.log(artistsList)
        }
          {  artistsList&& artistsList.map((artist) => (
            <MenuItem
              key={artist.artistid}
              value={`${artist.first_name} ${artist.last_name}`}
            >
              <Checkbox
                checked={
                  artists.indexOf(`${artist.first_name} ${artist.last_name}`) >
                  -1
                }
              />
              <ListItemText
                primary={`${artist.first_name} ${artist.last_name}`}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Release Date Start"
          type="date"
          value={releaseDateStart}
          onChange={(e) => setReleaseDateStart(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Release Date End"
          type="date"
          value={releaseDateEnd}
          onChange={(e) => setReleaseDateEnd(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <Button onClick={applyFilter} variant="contained" color="primary">
          APPLY
        </Button>
      </FormControl>
    </div>
  );
};

export default FilterForm;
