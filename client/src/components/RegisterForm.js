import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";
import axios from "axios";

const RegisterForm = ({ baseUrl, onClose }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const validateField = (field, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      switch (field) {
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) error = "Enter a valid email";
          break;
        case "contact":
          if (!/^\d{10}$/.test(value))
            error = "Enter a valid 10-digit contact number";
          break;
        default:
          break;
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const registerClickHandler = async () => {
    if (!Object.values(errors).some((err) => err)) {
      const dataSignup = {
        // email_address: email,
        email: email,
        first_name: firstname,
        last_name: lastname,
        // mobile_number: contact,
        contact: contact,
        password: registerPassword,
      };

      console.log(dataSignup);

      try {
        await axios.post(`${baseUrl}auth/signup`, dataSignup, {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        setRegistrationSuccess(true);
        onClose();
      } catch (error) {
        console.error("Registration failed:", error);
      }
    }
  };

  return (
    <div>
      <FormControl required fullWidth margin="normal">
        <InputLabel htmlFor="firstname">First Name</InputLabel>
        <Input
          id="firstname"
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          onBlur={() => validateField("firstname", firstname)}
        />
        <FormHelperText>{errors.firstname}</FormHelperText>
      </FormControl>
      <FormControl required fullWidth margin="normal">
        <InputLabel htmlFor="lastname">Last Name</InputLabel>
        <Input
          id="lastname"
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          onBlur={() => validateField("lastname", lastname)}
        />
        <FormHelperText>{errors.lastname}</FormHelperText>
      </FormControl>
      <FormControl required fullWidth margin="normal">
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateField("email", email)}
        />
        <FormHelperText>{errors.email}</FormHelperText>
      </FormControl>
      <FormControl required fullWidth margin="normal">
        <InputLabel htmlFor="registerPassword">Password</InputLabel>
        <Input
          id="registerPassword"
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          onBlur={() => validateField("registerPassword", registerPassword)}
        />
        <FormHelperText>{errors.registerPassword}</FormHelperText>
      </FormControl>
      <FormControl required fullWidth margin="normal">
        <InputLabel htmlFor="contact">Contact No.</InputLabel>
        <Input
          id="contact"
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          onBlur={() => validateField("contact", contact)}
        />
        <FormHelperText>{errors.contact}</FormHelperText>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={registerClickHandler}
        fullWidth
      >
        REGISTER
      </Button>
      {/* Display success message after successful registration */}
      {registrationSuccess && (
        <div style={{ color: "green", marginTop: "16px" }}>
          Registration successful! You can now log in.
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
