import { useState, useEffect } from "react";
import { 
  Button, 
  Card, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
  Typography,
  Divider
} from "@mui/material";
import WeightSelector from "../../../common/forms/WeightSelector";
import "./CreateMenteeProfile.css";
import menteeDb from "../../../../dal/menteeDb";
import ErrorMessage, { ErrorState, parseError, resetError } from "../../../common/forms/ErrorMessage";
import { MatchProfile, initUserWeights, UserWeights } from "../../../../types/matchProfile";
import authService from "../../../../service/authService";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import ContentContainer from "../../../common/ContentContainer";
import { 
  CAREER_FIELDS, 
  getTechnicalInterestOptions, 
  LIFE_EXPERIENCES, 
  LANGUAGES, 
  MENTORSHIP_GOALS 
} from "../../../../config/matchingConfig";

interface CreateMenteeProfileProps {
  backToPage: () => any
}

function CreateMenteeProfile({ backToPage }: CreateMenteeProfileProps) {
  const [errorState, setErrorState] = useState<ErrorState>({ isError: false, errorMessage: '' });
  const [loading, setLoading] = useState(false);

  // New matching fields state
  const [careerFields, setCareerFields] = useState<string[]>([]);
  const [technicalInterests, setTechnicalInterests] = useState<string[]>([]);
  const [lifeExperiences, setLifeExperiences] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>(['English']); // Default to English
  const [otherLanguage, setOtherLanguage] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>(''); // Profile name (50 chars)
  const [aboutMe, setAboutMe] = useState<string>(''); // About me section (500 chars)
  const [mentorshipGoal, setMentorshipGoal] = useState<string>('');
  const [mentorshipGoalOther, setMentorshipGoalOther] = useState<string>('');
  const [weights, setWeights] = useState<UserWeights>(initUserWeights());

  // Get available technical interests based on selected career fields
  const availableTechnicalInterests = getTechnicalInterestOptions(careerFields);

  // Auto-disable life experiences weight if user chooses not to share
  const isLifeExperiencesSkipped = lifeExperiences.some(exp => 
    exp.toLowerCase().includes('prefer not to share')
  );

  useEffect(() => {
    if (isLifeExperiencesSkipped && weights.lifeExperiences !== 0) {
      setWeights({
        ...weights,
        lifeExperiences: 0
      });
    }
  }, [isLifeExperiencesSkipped]);

  const createProfile = async () => {
    setErrorState(resetError());
    setLoading(true);
    try {
      // Validate new fields only
      validateNewFields();

      const user = await authService.getSignedInUser();
      if (!user?.uid) {
        throw new Error("User not authenticated");
      }
      
      const uid = user.uid;
      
      // Build the new profile, only including fields that have values
      const newProfile: MatchProfile = {
        UID: uid,
        // Legacy fields - provide defaults since we're not collecting them anymore
        technicalInterest: technicalInterests[0] || 'Not Specified',
        technicalExperience: 0,
        professionalInterest: mentorshipGoal || 'Not Specified',
        professionalExperience: 0,
        // New matching fields
        careerFields,
        technicalInterests,
        lifeExperiences,
        languages,
        weights,
        introduction, // Profile name (50 chars)
        aboutMe, // About me section (500 chars)
        mentorshipGoal,
        isActive: true,
        currentMatchCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Only add optional fields if they have values
      if (languages.includes('Other') && otherLanguage.trim()) {
        newProfile.otherLanguage = otherLanguage;
      }
      
      if (mentorshipGoal === 'Other' && mentorshipGoalOther.trim()) {
        newProfile.mentorshipGoalOther = mentorshipGoalOther;
      }
      
      await menteeDb.createMenteeProfileAsync(newProfile);
      console.log(errorState)
      if (!errorState.isError) backToPage();
    }
    catch (error) {
      setErrorState(parseError(error));
    }
    setLoading(false);
  }

  const validateNewFields = () => {
    if (careerFields.length === 0) {
      throw new Error("Select at least one career field");
    }
    if (technicalInterests.length === 0) {
      throw new Error("Select at least one technical interest");
    }
    if (lifeExperiences.length === 0) {
      throw new Error("Select at least one option from 'Tell us about yourself'");
    }
    if (!mentorshipGoal) {
      throw new Error("Select a mentorship goal");
    }
    if (mentorshipGoal === 'Other' && !mentorshipGoalOther.trim()) {
      throw new Error("Please specify your mentorship goal");
    }
    if (languages.includes('Other') && !otherLanguage.trim()) {
      throw new Error("Please specify the other language");
    }
    if (!introduction.trim()) {
      throw new Error("Please give your profile a name");
    }
    if (!aboutMe.trim()) {
      throw new Error("Please write something about yourself in the About Me section");
    }
  }

  return (
    <ContentContainer title="Create Mentee Profile">
      <Card sx={{
        display: "flex",
        flexDirection: 'column',
        gap: '20px',
        padding: '30px',
        marginTop: '25px',
        maxWidth: '800px',
        margin: '25px auto'
      }}>
        
        {/* Section: Career & Technical */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#0066cc', fontWeight: 600 }}>
            Career & Technical Interests
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Career Fields */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Career Fields *</InputLabel>
            <Select
              multiple
              value={careerFields}
              onChange={(e) => {
                const value = e.target.value as string[];
                setCareerFields(value);
                // Reset technical interests when career fields change
                setTechnicalInterests([]);
              }}
              input={<OutlinedInput label="Career Fields *" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {CAREER_FIELDS.map((field) => (
                <MenuItem key={field} value={field}>
                  <Checkbox checked={careerFields.indexOf(field) > -1} />
                  <ListItemText primary={field} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Technical Interests (Dynamic) */}
          <FormControl fullWidth sx={{ mb: 2 }} disabled={careerFields.length === 0}>
            <InputLabel>Technical Interests *</InputLabel>
            <Select
              multiple
              value={technicalInterests}
              onChange={(e) => setTechnicalInterests(e.target.value as string[])}
              input={<OutlinedInput label="Technical Interests *" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableTechnicalInterests.map((interest) => (
                <MenuItem key={interest} value={interest}>
                  <Checkbox checked={technicalInterests.indexOf(interest) > -1} />
                  <ListItemText primary={interest} />
                </MenuItem>
              ))}
            </Select>
            {careerFields.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Select career fields first to see technical interests
              </Typography>
            )}
          </FormControl>
        </Box>

        {/* Section: About You */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#0066cc', fontWeight: 600 }}>
            About You
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Life Experiences */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Life Experiences *</InputLabel>
            <Select
              multiple
              value={lifeExperiences}
              onChange={(e) => setLifeExperiences(e.target.value as string[])}
              input={<OutlinedInput label="Life Experiences *" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {LIFE_EXPERIENCES.map((experience) => (
                <MenuItem key={experience} value={experience}>
                  <Checkbox checked={lifeExperiences.indexOf(experience) > -1} />
                  <ListItemText primary={experience} />
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
              Select experiences you'd like to share with potential mentors (affects matching)
            </Typography>
          </FormControl>

          {/* Languages */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Languages</InputLabel>
            <Select
              multiple
              value={languages}
              onChange={(e) => setLanguages(e.target.value as string[])}
              input={<OutlinedInput label="Languages" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {LANGUAGES.map((language) => (
                <MenuItem key={language} value={language}>
                  <Checkbox checked={languages.indexOf(language) > -1} />
                  <ListItemText primary={language} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Other Language Input */}
          {languages.includes('Other') && (
            <TextField
              fullWidth
              label="Specify Other Language"
              value={otherLanguage}
              onChange={(e) => setOtherLanguage(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {/* Profile Name */}
          <TextField
            fullWidth
            required
            label="Profile Name *"
            placeholder="e.g., 'AI Career Focus' or 'Web Development Journey'"
            value={introduction}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 50) {
                setIntroduction(value);
              }
            }}
            helperText={`${introduction.length}/50 characters - Give this profile a memorable name`}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 50 }}
          />

          {/* About Me / Elevator Pitch */}
          <TextField
            fullWidth
            required
            label="Your Elevator Pitch *"
            placeholder="What makes you an awesome mentee? Share your passion, goals, and what you bring to a mentorship..."
            multiline
            rows={4}
            value={aboutMe}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 500) {
                setAboutMe(value);
              }
            }}
            helperText={`${aboutMe.length}/500 characters - This is your elevator pitch! What makes you an awesome mentee?`}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 500 }}
          />
        </Box>

        {/* Section: Mentorship Goal */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#0066cc', fontWeight: 600 }}>
            Mentorship Goal
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>What would you like to work on with your mentor? *</InputLabel>
            <Select
              value={mentorshipGoal}
              onChange={(e) => setMentorshipGoal(e.target.value)}
              label="What would you like to work on with your mentor? *"
            >
              {MENTORSHIP_GOALS.map((goal) => (
                <MenuItem key={goal} value={goal}>{goal}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {mentorshipGoal === 'Other' && (
            <TextField
              fullWidth
              label="Specify Your Goal"
              value={mentorshipGoalOther}
              onChange={(e) => setMentorshipGoalOther(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
        </Box>

        {/* Section: Matching Preferences (Weights) */}
        <Box>
          <WeightSelector 
            weights={weights} 
            onChange={setWeights}
            disableLifeExperiences={isLifeExperiencesSkipped}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={backToPage}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={createProfile}
            sx={{ 
              backgroundColor: '#0066cc',
              '&:hover': { backgroundColor: '#0052a3' }
            }}
          >
            Create Profile
          </Button>
        </Box>

        <ErrorMessage errorState={errorState} />
        <LoadingMessage message="Creating new Profile..." loading={loading} />
      </Card>
    </ContentContainer>
  )
}

export default CreateMenteeProfile;
