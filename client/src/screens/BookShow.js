import React, { useEffect, useState } from "react";
import Header from "../components/header";
import {
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormHelperText,
  Input,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../style/BookShow.css";

const BookShow = ({ baseUrl }) => {
  const [location, setLocation] = useState("");
  const [theatre, setTheatre] = useState("");
  const [language, setLanguage] = useState("");
  const [showDate, setShowDate] = useState("");
  const [tickets, setTickets] = useState(0);
  const [unitPrice, setUnitPrice] = useState(500);
  const [availableTickets, setAvailableTickets] = useState(20);
  const [reqLocation, setReqLocation] = useState(false);
  const [reqTheatre, setReqTheatre] = useState(false);
  const [reqLanguage, setReqLanguage] = useState(false);
  const [reqShowDate, setReqShowDate] = useState(false);
  const [reqTickets, setReqTickets] = useState(false);
  const [locations, setLocations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [showDates, setShowDates] = useState([]);
  const [originalShows, setOriginalShows] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]); // New state for selected seats
  const [inputSeats, setInputSeats] = useState(""); // New state for input value

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`${baseUrl}movies/${id}/shows`);
        const shows = response.data;
        console.log(shows);

        setOriginalShows(shows);
        const uniqueLocations = [
          ...new Set(shows.map((show) => show.theatre.city)),
        ];
        setLocations(
          uniqueLocations.map((loc) => ({ id: loc, location: loc }))
        );
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };
    fetchShows();
  }, [id]);

  const locationChangeHandler = (event) => {
    const selectedLocation = event.target.value;
    setLocation(selectedLocation);
    const newTheatres = originalShows
      .filter((show) => show.theatre.city === selectedLocation)
      .map((show) => ({ id: show.theatre.name, theatre: show.theatre.name }));
    setTheatres(newTheatres);
  };

  const theatreChangeHandler = (event) => {
    const selectedTheatre = event.target.value;
    setTheatre(selectedTheatre);
    const newLanguages = originalShows
      .filter(
        (show) =>
          show.theatre.city === location &&
          show.theatre.name === selectedTheatre
      )
      .map((show) => ({ id: show.language, language: show.language }));
    setLanguages(newLanguages);
  };

  const languageChangeHandler = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    const newShowDates = originalShows
      .filter(
        (show) =>
          show.theatre.city === location &&
          show.theatre.name === theatre &&
          show.language === selectedLanguage
      )
      .map((show) => ({ id: show.show_timing, showDate: show.show_timing }));
    setShowDates(newShowDates);
  };

  const showDateChangeHandler = (event) => {
    const selectedShowDate = event.target.value;
    setShowDate(selectedShowDate);
    const selectedShow = originalShows.find(
      (show) =>
        show.theatre.city === location &&
        show.theatre.name === theatre &&
        show.language === language &&
        show.show_timing === selectedShowDate
    );
    if (selectedShow) {
      setUnitPrice(selectedShow.unit_price);
      setAvailableTickets(selectedShow.available_seats);
    }
  };

  const ticketsChangeHandler = (event) => {
    const input = event.target.value;
    setInputSeats(input); // Update the input value
    const seats = input
      .split(",")
      .map((seat) => seat.trim())
      .filter(Boolean);
    setTickets(seats.length); // Total seats selected
    setSelectedSeats(seats); // Store selected seats
  };

  const bookShowButtonHandler = () => {
    setReqLocation(location === "");
    setReqTheatre(theatre === "");
    setReqLanguage(language === "");
    setReqShowDate(showDate === "");
    setReqTickets(tickets <= 0 || tickets > availableTickets); // Validate ticket count

    // ✅ Find the selected show
    const selectedShow = originalShows.find(
      (show) =>
        show.theatre.city === location &&
        show.theatre.name === theatre &&
        show.language === language &&
        show.show_timing === showDate
    );
    console.log(selectedShow);

    if (!selectedShow) {
      console.error("🚨 No show found matching criteria!");
      return;
    }

    if (
      location &&
      theatre &&
      language &&
      showDate &&
      tickets > 0 &&
      tickets <= availableTickets
    ) {
      navigate(`/confirm/${id}`, {
        state: {
          bookingSummary: {
            id,
            location,
            theatre,
            language,
            showDate,
            tickets,
            unitPrice,
            selectedSeats, // Pass selected seats to booking summary
            showId: selectedShow.id, // ✅ Pass show_id here!
          },
        },
      });
    }
  };

  return (
    <div>
      <Header baseUrl={baseUrl} />
      <div className="bookShow">
        <Typography className="back">
          <Link to={`/movie/${id}`}>&#60; Back to Movie Details</Link>
        </Typography>
        <Card className="cardStyle">
          <CardContent>
            <Typography variant="h5" component="h2">
              BOOK SHOW
            </Typography>
            <br />
            <FormControl required className="formControl">
              <InputLabel htmlFor="location">Choose Location:</InputLabel>
              <Select value={location} onChange={locationChangeHandler}>
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.location}>
                    {loc.location}
                  </MenuItem>
                ))}
              </Select>
              {reqLocation && <FormHelperText error>Required</FormHelperText>}
            </FormControl>
            <br />
            <br />
            <FormControl required className="formControl">
              <InputLabel htmlFor="theatre">Choose Theatre:</InputLabel>
              <Select value={theatre} onChange={theatreChangeHandler}>
                {theatres.map((th) => (
                  <MenuItem key={th.id} value={th.theatre}>
                    {th.theatre}
                  </MenuItem>
                ))}
              </Select>
              {reqTheatre && <FormHelperText error>Required</FormHelperText>}
            </FormControl>
            <br />
            <br />
            <FormControl required className="formControl">
              <InputLabel htmlFor="language">Choose Language:</InputLabel>
              <Select value={language} onChange={languageChangeHandler}>
                {languages.map((lang) => (
                  <MenuItem key={lang.id} value={lang.language}>
                    {lang.language}
                  </MenuItem>
                ))}
              </Select>
              {reqLanguage && <FormHelperText error>Required</FormHelperText>}
            </FormControl>
            <br />
            <br />
            <FormControl required className="formControl">
              <InputLabel htmlFor="showDate">Choose Show Date:</InputLabel>
              <Select value={showDate} onChange={showDateChangeHandler}>
                {showDates.map((sd) => (
                  <MenuItem key={sd.id} value={sd.showDate}>
                    {sd.showDate}
                  </MenuItem>
                ))}
              </Select>
              {reqShowDate && <FormHelperText error>Required</FormHelperText>}
            </FormControl>
            <br />
            <br />
            <FormControl required className="formControl">
              <InputLabel htmlFor="tickets">
                Seat Selection: ( {availableTickets} available )
              </InputLabel>
              <Input
                id="tickets"
                value={inputSeats} // Use inputSeats for input
                onChange={ticketsChangeHandler}
              />
              {reqTickets && (
                <FormHelperText error>
                  Select at least one ticket and less than or equal to the
                  available seats.
                </FormHelperText>
              )}
            </FormControl>

            <br />
            <br />
            <Typography variant="h6">
              Total Tickets: {tickets} | Total Price: ₹{tickets * unitPrice}
            </Typography>
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={bookShowButtonHandler}
            >
              Book Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookShow;
