import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Store form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Snackbar state
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  // When login button clicked
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      // Use auth context to login
      login(res.data.user, res.data.token);

      setMessage("Login Successful!");
      setOpen(true);

      // Go to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      setMessage("Login Failed!");
      setOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center">
            Login
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
            >
              Login
            </Button>
          </form>

          <Typography mt={2} align="center">
            Don’t have account? <Link to="/signup">Signup</Link>
          </Typography>
        </CardContent>
      </Card>

      {/* Snackbar Message */}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="info">{message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
