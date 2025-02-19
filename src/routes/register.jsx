import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  FormHelperText,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { RegisterApi } from "../services/authService";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const registerData = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const Register = () => {
  const [formData, setFormData] = useState(registerData);
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { mutate } = useMutation({
    mutationFn: RegisterApi,
    onSuccess: (data) => {
      console.log("Registration data:", data);
      setFormData(registerData);
      navigate("/");
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    const { confirmPassword, ...dataToSend } = formData;
    mutate(dataToSend);
  };

  return (
    <Container
      maxWidth="100%"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "50px",
          width: "100%",
          py: "50px",
          px: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            label="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            required
          />
          {error && (
            <FormHelperText error>{error}</FormHelperText> // Display error message if passwords don't match
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Box>
        <Typography sx={{ mt: "20px" }}>
          Already have an account ? <Link to="/">Login here</Link>{" "}
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
