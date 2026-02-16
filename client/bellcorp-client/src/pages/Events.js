import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getEvents, registerForEvent } from "../api";
import { useAuth } from "../context/AuthContext";

function Events() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Fetch events with current filters
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await getEvents({
          search: search || undefined,
          category: category || undefined,
          location: location || undefined
        });
        setEvents(res.data);
      } catch (error) {
        setSnackbarMessage("Failed to load events");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, category, location]);

  // Handle registration
  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await registerForEvent(eventId);
      setSnackbarMessage("Registered Successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Refresh events
      const res = await getEvents({
        search: search || undefined,
        category: category || undefined,
        location: location || undefined
      });
      setEvents(res.data);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Get unique categories and locations
  const categories = ["Technology", "Design", "Database"];
  const locations = ["New York", "San Francisco", "Los Angeles", "Chicago", "Boston", "Austin", "Seattle", "Denver", "Portland", "Miami", "Atlanta", "Philadelphia", "San Diego", "Phoenix", "Dallas"];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Discover Events</Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          My Events
        </Button>
      </Box>

      {/* Search & Filter Section */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search Events"
              placeholder="Event name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                label="Location"
                onChange={(e) => setLocation(e.target.value)}
              >
                <MenuItem value="">All Locations</MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearch("");
                setCategory("");
                setLocation("");
              }}
              sx={{ height: "56px" }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Events Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" color="textSecondary">
            No events found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {event.name}
                  </Typography>

                  <Box sx={{ mb: 1.5 }}>
                    <Chip
                      label={event.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={event.location}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    <strong>Organizer:</strong> {event.organizer}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {event.description}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: event.availableSeats > 0 ? "green" : "red",
                      fontWeight: "bold"
                    }}
                  >
                    {event.availableSeats > 0
                      ? `${event.availableSeats} / ${event.capacity} seats available`
                      : "Sold Out"}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/event/${event._id}`)}
                  >
                    View Details
                  </Button>

                  {event.availableSeats > 0 ? (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleRegister(event._id)}
                    >
                      Register Now
                    </Button>
                  ) : (
                    <Button size="small" variant="contained" disabled>
                      Sold Out
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Events;
