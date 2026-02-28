import { useState } from "react";
import ContentContainer from "../../../common/ContentContainer";
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { sendEmail } from "../../../../service/mailService";


function SendEmailForm() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Firebase Extension Test");
  const [text, setText] = useState("If you received this, it worked.");

  const handleSend = async () => {
    if (!isValidEmail(to)) {
      alert("Please enter a valid recipient email address.");
      return;
    }
    try {
      await sendEmail({ to, subject, text });
      alert("Email sent");
    } catch (e) {
      alert("Failed to send email.");
      console.error(e);
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  return (
    <ContentContainer
      title="Send Email"
      subtitle="Test the Firebase Trigger Email extension"
    >
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="To" value={to} onChange={(e) => setTo(e.target.value)} fullWidth required />
          <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth />
          <TextField label="Text" value={text} onChange={(e) => setText(e.target.value)} fullWidth multiline rows={2} />
          <Button variant="contained" onClick={handleSend}>Send Email</Button>
        </Box>
      </Paper>
    </ContentContainer>
  );
}

export default SendEmailForm;
