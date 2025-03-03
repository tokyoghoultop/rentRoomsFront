import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { loginApi } from "../api/authApi";
import { globalNavigate } from "../hooks/useGlobalNavigate";
import useAuthStore from "../stores/authStore"; // Import Zustand Store

function Login() {
  const setToken = useAuthStore((state) => state.setToken); // เรียกฟังก์ชันตั้งค่า token
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await loginApi(formData.email, formData.password);
      setSuccessMessage("Login successful!");

      // เก็บ token ลงใน Zustand Store
      setToken(result.token);

      // หน่วงเวลา 2 วินาทีก่อนเปลี่ยนหน้า
      setTimeout(() => {
        globalNavigate("/");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || "Login failed!");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ maxWidth: 400, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Login
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
