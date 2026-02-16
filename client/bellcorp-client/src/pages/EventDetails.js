import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Paper
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { getEventDetails, registerForEvent, checkRegistration, unregisterFromEvent } from "../api";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const eventRes = await getEventDetails(eventId);
        setEvent(eventRes.data);

        if (isAuthenticated) {
          try {
            const regRes = await checkRegistration(eventId);
            setIsRegistered(regRes.data.isRegistered);
          } catch (error) {
            console.log("Not logged in or error checking registration");
          }
        }
      } catch (error) {
        setSnackbarMessage("Failed to load event details");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, isAuthenticated]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await registerForEvent(eventId);
      setIsRegistered(true);
      setSnackbarMessage("Registered Successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      const res = await getEventDetails(eventId);
      setEvent(res.data);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleUnregister = async () => {
    try {
      await unregisterFromEvent(eventId);
      setIsRegistered(false);
      setSnackbarMessage("Unregistered Successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      const res = await getEventDetails(eventId);
      setEvent(res.data);
    } catch (error) {
      const message = error.response?.data?.message || "Unregistration failed";
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          py: 5,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Event not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/events")}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/events")}
        sx={{
          mb: 3,
          textTransform: "none",
          fontSize: "1rem",
          "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
        }}
      >
        Back to Events
      </Button>

      {/* Main Content Flexbox */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          width: "100%",
        }}
      >
        {/* Left Side - Event Information */}
        <Box
          sx={{
            flex: { md: "1 1 65%" },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Card sx={{ height: "100%", boxShadow: 3 }}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Header Section */}
              <Box>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold" }}>
                  {event.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={event.category}
                    color="primary"
                    variant="filled"
                    sx={{ fontSize: "0.9rem", fontWeight: "600" }}
                  />
                  <Chip
                    label={event.location}
                    variant="outlined"
                    sx={{ fontSize: "0.9rem" }}
                  />
                  {isRegistered && (
                    <Chip
                      label="✓ Registered"
                      color="success"
                      variant="filled"
                      sx={{ fontSize: "0.9rem", fontWeight: "600" }}
                    />
                  )}
                </Box>
              </Box>

              {/* Event Information Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  📋 Event Information
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {/* Organizer & Date in Row */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                    }}
                  >
                    {/* Organizer */}
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 28, color: "primary.main" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "textSecondary" }}>
                          Organizer
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "600" }}>
                          {event.organizer}
                        </Typography>
                      </Box>
                    </Paper>

                    {/* Date */}
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <EventIcon sx={{ fontSize: 28, color: "primary.main" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "textSecondary" }}>
                          Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "600" }}>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>

                  {/* Location - Full Width */}
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 28, color: "primary.main" }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "textSecondary" }}>
                        Location
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "600" }}>
                        {event.location}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>

              {/* Description Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  📝 Description
                </Typography>
                <Paper
                  sx={{
                    p: 2.5,
                    backgroundColor: "#fafafa",
                    borderLeft: "5px solid",
                    borderLeftColor: "primary.main",
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {event.description}
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Side - Registration Card */}
        <Box
          sx={{
            flex: { md: "1 1 35%" },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Card
            sx={{
              height: "100%",
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                height: "100%",
              }}
            >
              {/* Capacity Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  🎟️ Availability
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {/* Seats Info */}
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor:
                        event.availableSeats > 0 ? "#e8f5e9" : "#ffebee",
                      borderRadius: 1,
                      border: "2px solid",
                      borderColor:
                        event.availableSeats > 0 ? "#4caf50" : "#f44336",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EventSeatIcon
                        sx={{
                          fontSize: 24,
                          color:
                            event.availableSeats > 0 ? "#4caf50" : "#f44336",
                        }}
                      />
                      <Box>
                        <Typography variant="caption" sx={{ color: "textSecondary" }}>
                          Total Capacity
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "textPrimary" }}
                        >
                          {event.capacity} Seats
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Registered */}
                  <Paper sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: "textSecondary" }}>
                      Registered
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      {event.registrationCount} / {event.capacity}
                    </Typography>
                  </Paper>

                  {/* Available */}
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor:
                        event.availableSeats > 0 ? "#e8f5e9" : "#ffebee",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "textSecondary" }}>
                      Available Seats
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color:
                          event.availableSeats > 0 ? "#2e7d32" : "#c62828",
                      }}
                    >
                      {event.availableSeats > 0 ? "✓" : "✗"}{" "}
                      {event.availableSeats} Seats
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              {/* Registration Status */}
              {isRegistered && (
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "#e8f5e9",
                    borderRadius: 1,
                    borderLeft: "4px solid #4caf50",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#2e7d32",
                      fontWeight: "bold",
                      fontSize: "0.95rem",
                    }}
                  >
                    ✓ You are registered for this event
                  </Typography>
                </Paper>
              )}

              {/* Action Button */}
              <Box sx={{ mt: "auto", pt: 2 }}>
                {isRegistered ? (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={handleUnregister}
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "600",
                      textTransform: "none",
                    }}
                  >
                    Cancel Registration
                  </Button>
                ) : event.availableSeats > 0 ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleRegister}
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "600",
                      textTransform: "none",
                    }}
                  >
                    Register Now
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    disabled
                    size="large"
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "600",
                      textTransform: "none",
                    }}
                  >
                    Sold Out
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EventDetails;
