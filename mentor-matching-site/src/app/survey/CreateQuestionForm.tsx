import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import surveyService from "../../service/surveyService";
import { Question, Option, DisplayUi, AlgorithmWeight} from "../../types/survey";
import { Timestamp } from "firebase/firestore";

export default function CreateQuestionForm() {
  //const [questions, setQuestions] = useState<Question[]>([]);
  const [menteePrompt, setMenteePrompt] = useState("");
  const [mentorPrompt, setMentorPrompt] = useState("");
  const [weight, setWeight] = useState<AlgorithmWeight>(3);
  const [displayUi, setDisplayUi] = useState<DisplayUi>(DisplayUi.radio);
  const [options, setOptions] = useState<Option[]>([{ label: ""}]);
  const [required, setRequired] = useState(true);

  // Option handlers
  function addOption() {
    setOptions((s) => [...s, { label: "" }]);
  }
  function updateOption(index: number, value: string) {
    setOptions((s) => {
      const copy = [...s];
      copy[index] = { ...copy[index], label: value };
      return copy;
    });
  }
  function removeOption(index: number) {
    setOptions((s) => s.filter((_, i) => i !== index));
  }

  // Form submit
  async function handleCreateQuestion() {
    // Some frontend validation
    if (!menteePrompt.trim() || !mentorPrompt.trim()) {
      alert("Both prompts are required");
      return;
    }

    if (weight < 0 || weight > 5) {
      alert("Weight must be between 0 and 5")
      return;
    }

    const newQuestion: Question = {
      prompts: {
        mentee: menteePrompt,
        mentor: mentorPrompt
      },
      algorithmWeight: weight,
      required: true,
      displayUi: displayUi,
      options,
      status: true,
      updated: Timestamp.now()
    };

    await surveyService.createQuestion(newQuestion);

    // Reset form
    setMenteePrompt("");
    setMentorPrompt("");
    setWeight(3);
    setDisplayUi(DisplayUi.radio);
    setOptions([{ label: ""}]);
    setRequired(true);
  }

return (
    <Paper sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h6" mb={2}>
            Add New Question
          </Typography>
          <TextField
            fullWidth
            label="Mentee Prompt"
            value={menteePrompt}
            onChange={(e) => setMenteePrompt(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Mentor Prompt"
            value={mentorPrompt}
            onChange={(e) => setMentorPrompt(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Algorithm Weight (0-5)"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value) as AlgorithmWeight)}
            inputProps={{ min: 0, max: 5 }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Display Type</InputLabel>
            <Select
              value={displayUi}
              label="Display Type"
              onChange={(e) => setDisplayUi(e.target.value as DisplayUi)}
            >
              <MenuItem value={DisplayUi.radio}>Select one (Radio)</MenuItem>
              <MenuItem value={DisplayUi.dropdown}>Select one from list (Dropdown)</MenuItem>
              <MenuItem value={DisplayUi.checkbox}>Select all that apply (Checkbox)</MenuItem>
              <MenuItem value={DisplayUi.text}>Free Response (Text)</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
              />
            }
            label="Required"
          />
          
          <Typography variant="subtitle1">Options</Typography>
          {options.map((option, index) => (
            <Box key={index} display="flex" gap={1} mb={1}>
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option.label}
                onChange={(e) =>
                  updateOption(index, e.target.value)
                }
              />
              <IconButton onClick={() => removeOption(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={addOption}
            sx={{ mb: 2 }}
          >
            Add Option
          </Button>
          <Box>
            <Button
              variant="contained"
              onClick={handleCreateQuestion}
            >
              Create Question
            </Button>
          </Box>
        </Box>
      </Paper>
  );
}
