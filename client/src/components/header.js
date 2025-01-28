import React, { useEffect, useState } from "react";
import { Button } from "@mui/material"; // Updated import
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import AuthModal from "./AuthModal"; // Import the AuthModal
import "../style/header.css";

const Header = ({ baseUrl, showBookShowButton, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("access-token") !== null
  );
  const accessToken = sessionStorage.getItem("access-token");
  useEffect(() => {
    if (accessToken) setLoggedIn(true);
  }, [accessToken]);
  const openModalHandler = () => {
    setModalIsOpen(true);
  };

  const closeModalHandler = () => {
    setModalIsOpen(false);
  };
  const navigate = useNavigate();
  const logoutHandler = async () => {
    // Handle logout logic
    // Example: clear token from sessionStorage
    sessionStorage.removeItem("access-token");
    sessionStorage.removeItem("uuid");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <div>
      <header className="app-header">
        <img src={logo} className="app-logo" alt="Movies App Logo" />
        <div className="btnDiv">
          {!loggedIn ? (
            <Button
              variant="outlined" // Updated variant for better visibility
              color="primary" // Use primary for a consistent theme
              onClick={openModalHandler}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              onClick={logoutHandler}
            >
              Logout
            </Button>
          )}
          {showBookShowButton === "true" && !loggedIn && (
            <Button
              variant="contained"
              color="primary"
              onClick={openModalHandler}
            >
              Book Show
            </Button>
          )}
          {showBookShowButton === "true" && loggedIn && (
            <Link to={`/bookshow/${id}`}>
              <Button variant="contained" color="primary">
                Book Show
              </Button>
            </Link>
          )}
        </div>
      </header>
      <AuthModal
        isOpen={modalIsOpen}
        onRequestClose={closeModalHandler}
        baseUrl={baseUrl}
      />
    </div>
  );
};

export default Header;
