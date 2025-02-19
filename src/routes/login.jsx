import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { LoginApi } from "../services/authService";
import { setToken } from "../store/authSlice"; // Update import path if needed
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const { mutate } = useMutation({
    mutationFn: LoginApi,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      setEmail("");
      setPassword("");

      // Assuming 'userName' is part of the login response
      const { userName, accessToken, refreshToken } = data;

      dispatch(
        setToken({
          userName, // Use the userName as a unique identifier
          accessToken, // Store the access token
          refreshToken, // Store the refresh token
        })
      );
    },
    onError: (err) => {
      console.error("Login failed:", err.response?.data || err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
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
          Login
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
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Typography>
            Don't have an account ? <Link to="/register">Register Now</Link>{" "}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
