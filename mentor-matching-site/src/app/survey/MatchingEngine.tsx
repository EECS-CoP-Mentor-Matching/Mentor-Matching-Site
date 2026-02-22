import { useEffect, useState } from "react";
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
import { Question, Option, DisplayUi, AlgorithmWeight, SurveyResponse} from "../../types/survey";
import { Timestamp } from "firebase/firestore";
import { DocItem } from "../../types/types";

export default function MatchingEngine() {
    const [mentees, setMentees] = useState<DocItem<SurveyResponse>[]>([]);
    const [mentors, setMentors] = useState<DocItem<SurveyResponse>[]>([]);

    const [selectedMentee, setSelectedMentee] = useState<string>("");
    const [selectedMentor, setSelectedMentor] = useState<string>("");

    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
    async function loadUsers() {
      const menteedata = await surveyService.getAllMenteeSurveyResp();
      const mentordata = await surveyService.getAllMentorSurveyResp();
      setMentees(menteedata);
      setMentors(mentordata);
    }
    loadUsers();
    }, []);

    async function handleCompute() {
    if (!selectedMentee || !selectedMentor) return;

    const result = await surveyService.computeCompatibility(
        selectedMentee,
        selectedMentor
    );

  setScore(result.score);
}


    return (
        <Box>
            <select
            value={selectedMentee}
            onChange={(e) => setSelectedMentee(e.target.value)}
            >
            <option value="">Select Mentee</option>
            {mentees.map((m) => (
                <option key={m.docId} value={m.docId}>
                {m.data.UID}
                </option>
            ))}
            </select>

            <select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            >
            <option value="">Select Mentor</option>
            {mentors.map((m) => (
                <option key={m.docId} value={m.docId}>
                {m.data.UID}
                </option>
            ))}
            </select>

            <button onClick={handleCompute}>
            Compute Compatibility
            </button>

            {score !== null && (
            <div>
                Compatibility Score: {score}%
            </div>
            )}
        </Box>
    )}
