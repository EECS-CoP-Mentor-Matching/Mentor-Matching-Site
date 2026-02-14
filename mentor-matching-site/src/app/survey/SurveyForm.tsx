import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  FormLabel
} from "@mui/material";

import surveyService from "../../service/surveyService";
import { Question, DisplayUi } from "../../types/survey";

type UserRole = "mentee" | "mentor";

interface SurveyFormProps {
  userRole: UserRole;
}

export default function SurveyForm({ userRole }: SurveyFormProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    async function loadQuestions() {
      const data = await surveyService.getAllQuestions();
      setQuestions(data);
    }
    loadQuestions();
  }, []);

  function handleChange(questionIndex: number, value: any) {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value
    }));
  }

  function handleCheckboxChange(questionIndex: number, option: string) {
    const current = responses[questionIndex] || [];
    const updated = current.includes(option)
      ? current.filter((o: string) => o !== option)
      : [...current, option];

    handleChange(questionIndex, updated);
  }

  function handleSubmit() {
    console.log("Survey Responses:", responses);
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" mb={3}>
        Survey
      </Typography>

      <Box display="flex" flexDirection="column" gap={4}>
        {questions.map((question, index) => {
          const prompt =
            userRole === "mentee"
              ? question.prompts.mentee
              : question.prompts.mentor;

          return (
            <Box key={index}>
              <FormControl fullWidth>
                <FormLabel>
                  {prompt}
                  {question.required && " *"}
                </FormLabel>

                {/* radio */}
                {question.displayUi === DisplayUi.radio && (
                  <RadioGroup
                    value={responses[index] || ""}
                    onChange={(e) =>
                      handleChange(index, e.target.value)
                    }
                  >
                    {question.options.map((option, i) => (
                      <FormControlLabel
                        key={i}
                        value={option.label}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                )}

                {/* checkbox */}
                {question.displayUi === DisplayUi.checkbox &&
                  question.options.map((option, i) => (
                    <FormControlLabel
                      key={i}
                      control={
                        <Checkbox
                          checked={
                            responses[index]?.includes(option.label) || false
                          }
                          onChange={() =>
                            handleCheckboxChange(index, option.label)
                          }
                        />
                      }
                      label={option.label}
                    />
                  ))}

                {/* dropdown */}
                {question.displayUi === DisplayUi.dropdown && (
                  <Select
                    value={responses[index] || ""}
                    onChange={(e) =>
                      handleChange(index, e.target.value)
                    }
                  >
                    {question.options.map((option, i) => (
                      <MenuItem key={i} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}

                {/* text */}
                {question.displayUi === DisplayUi.text && (
                  <TextField
                    multiline
                    minRows={3}
                    value={responses[index] || ""}
                    onChange={(e) =>
                      handleChange(index, e.target.value)
                    }
                  />
                )}
              </FormControl>
            </Box>
          );
        })}

        <Button variant="contained" onClick={handleSubmit}>
          Submit Survey
        </Button>
      </Box>
    </Paper>
  );
}
