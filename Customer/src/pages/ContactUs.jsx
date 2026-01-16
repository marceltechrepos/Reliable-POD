import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PersonIcon from "@mui/icons-material/Person";
import SubjectIcon from "@mui/icons-material/Subject";
import MessageIcon from "@mui/icons-material/Message";
import CloseIcon from "@mui/icons-material/Close";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      setSnack({ open: true, severity: "error", message: "Please fill all fields!" });
      return;
    }
    setSnack({ open: true, severity: "success", message: "Message sent successfully!" });
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 8, bgcolor: "#f9fafc" }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={900} sx={{ mb: 1, textAlign: "center" }}>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
          Need assistance? Fill the form below and we'll get back to you promptly.
        </Typography>

        <Paper
          sx={{
            p: 5,
            borderRadius: 4,
            bgcolor: "#fff",
            boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative circles */}
          <Box sx={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", bgcolor: "#E0E7FF", top: -40, right: -40, opacity: 0.35 }} />
          <Box sx={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", bgcolor: "#C7D2FE", bottom: -90, left: -90, opacity: 0.25 }} />

          {/* STACK -> vertical single-column inputs */}
          <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
            <TextField
              label="Your Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment>,
              }}
            />

            <TextField
              label="Your Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment>,
              }}
            />

            <TextField
              label="Subject"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SubjectIcon color="primary" /></InputAdornment>,
              }}
            />

            <TextField
              label="Message"
              fullWidth
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><MessageIcon color="primary" /></InputAdornment>,
              }}
            />

            <Button
              onClick={handleSubmit}
              sx={{
                width: "100%",
                py: 1.8,
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(90deg,#4F46E5,#6366F1)",
                borderRadius: 3,
                "&:hover": { background: "linear-gradient(90deg,#6366F1,#4F46E5)" },
              }}
            >
              Send Message
            </Button>

            {/* contact info moved BELOW the form */}
            <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { icon: <EmailIcon sx={{ fontSize: 26, color: "#4F46E5" }} />, title: "Email", value: "support@yourapp.com" },
                { icon: <PhoneIcon sx={{ fontSize: 26, color: "#4F46E5" }} />, title: "Phone", value: "+92 300 0000000" },
                { icon: <HomeWorkIcon sx={{ fontSize: 26, color: "#4F46E5" }} />, title: "Address", value: "123 Street, Karachi, Pakistan" },
              ].map((info) => (
                <Paper
                  key={info.title}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#f5f7fa",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    transition: "0.25s",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
                  }}
                >
                  {info.icon}
                  <Box>
                    <Typography fontWeight={700}>{info.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{info.value}</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Stack>
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3500}
          onClose={() => setSnack({ ...snack, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          action={
            <IconButton size="small" color="inherit" onClick={() => setSnack({ ...snack, open: false })}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Alert severity={snack.severity} sx={{ width: "100%" }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
