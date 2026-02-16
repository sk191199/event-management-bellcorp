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
import { registerUser } from "../api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await registerUser({ name, email, password });

      setMessage("Registered Successfully!");
      setOpen(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      setMessage("Signup Failed!");
      setOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center">
            Signup
          </Typography>

          <form onSubmit={handleSignup}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              onChange={(e) => setName(e.target.value)}
            />

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
              Signup
            </Button>
          </form>

          <Typography mt={2} align="center">
            Already have account? <Link to="/">Login</Link>
          </Typography>
        </CardContent>
      </Card>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="info">{message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;
