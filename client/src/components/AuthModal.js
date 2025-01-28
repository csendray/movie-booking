import React, { useState } from "react";
import Modal from "react-modal";
import { Tabs, Tab } from "@mui/material"; // Updated import
import LoginForm from "./LoginForm"; // Import the LoginForm
import RegisterForm from "./RegisterForm"; // Import the RegisterForm

const AuthModal = ({ isOpen, onRequestClose, baseUrl }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      contentLabel="Authentication"
      onRequestClose={onRequestClose}
    >
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      {tabValue === 0 ? (
        <LoginForm baseUrl={baseUrl} onClose={onRequestClose} />
      ) : (
        <RegisterForm baseUrl={baseUrl} onClose={onRequestClose} />
      )}
    </Modal>
  );
};

export default AuthModal;
