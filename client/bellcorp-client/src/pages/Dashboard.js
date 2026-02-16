import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserEvents, unregisterFromEvent } from "../api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Fetch user's events
  useEffect(() => {
    const fetchUserEvents = async () => {
      setLoading(true);
      try {
        const res = await getUserEvents();
        setUpcomingEvents(res.data.upcoming);
        setPastEvents(res.data.past);
      } catch (error) {
        console.log("Error fetching events:", error);
        setSnackbarMessage("Failed to load your events");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  const handleUnregister = async (eventId) => {
    try {
      await unregisterFromEvent(eventId);
      setSnackbarMessage("Unregistered Successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Refresh events
      const res = await getUserEvents();
      setUpcomingEvents(res.data.upcoming);
      setPastEvents(res.data.past);
    } catch (error) {
      const message = error.response?.data?.message || "Unregistration failed";
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4">
            Welcome, {user?.name} 👋
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {user?.email}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => navigate("/events")}
          >
            Discover Events
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Upcoming Events Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              📅 Upcoming Events ({upcomingEvents.length})
            </Typography>

            {upcomingEvents.length === 0 ? (
              <Card sx={{ p: 3 }}>
                <Typography variant="body2" color="textSecondary" align="center">
                  No upcoming events. <Button onClick={() => navigate("/events")}>Discover events</Button>
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {upcomingEvents.map((event) => (
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

                        <Typography variant="body2">
                          {event.description}
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
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleUnregister(event._id)}
                        >
                          Unregister
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Past Events Section */}
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              ✓ Past Events ({pastEvents.length})
            </Typography>

            {pastEvents.length === 0 ? (
              <Card sx={{ p: 3 }}>
                <Typography variant="body2" color="textSecondary" align="center">
                  No past events yet
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {pastEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event._id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        opacity: 0.8
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Chip
                          label="Past"
                          size="small"
                          color="default"
                          sx={{ mb: 1 }}
                        />

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
                          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                        </Typography>

                        <Typography variant="body2">
                          {event.description}
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
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
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

export default Dashboard;

