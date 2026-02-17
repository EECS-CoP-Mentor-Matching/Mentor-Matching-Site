import { useState } from "react";
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
  Divider,
  Chip
} from "@mui/material";
import WeightSelector from "../../common/forms/WeightSelector";
import ContentContainer from "../../common/ContentContainer";
import { mentorService } from "../../../service/mentorService";
import ErrorMessage, { ErrorState, parseError, resetError } from "../../common/forms/ErrorMessage";
import { MatchProfile, initUserWeights, UserWeights } from "../../../types/matchProfile";
import authService from "../../../service/authService";
import LoadingMessage from "../../common/forms/modals/LoadingMessage";
import { 
  CAREER_FIELDS, 
  getTechnicalInterestOptions, 
  LIFE_EXPERIENCES, 
  LANGUAGES
} from "../../../config/matchingConfig";

interface CreateMentorProfileProps {
  backToPage?: () => void;
}

function CreateMentorProfile({ backToPage }: CreateMentorProfileProps) {
  const [errorState, setErrorState] = useState<ErrorState>({ isError: false, errorMessage: '' });
  const [loading, setLoading] = useState(false);

  // New matching fields state
  const [careerFields, setCareerFields] = useState<string[]>([]);
  const [technicalInterests, setTechnicalInterests] = useState<string[]>([]);
  const [lifeExperiences, setLifeExperiences] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>(['English']); // Default to English
  const [otherLanguage, setOtherLanguage] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>('');
  const [areasOfExpertise, setAreasOfExpertise] = useState<string>('');
  const [maxMatches, setMaxMatches] = useState<number>(5);
  const [weights, setWeights] = useState<UserWeights>(initUserWeights());

  // Get available technical interests based on selected career fields
  const availableTechnicalInterests = getTechnicalInterestOptions(careerFields);

  const createProfile = async () => {
    setErrorState(resetError());
    setLoading(true);
    try {
      // Validate new fields
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
        professionalInterest: careerFields[0] || 'Not Specified',
        professionalExperience: 0,
        // New matching fields
        careerFields,
        technicalInterests,
        lifeExperiences,
        languages,
        weights,
        introduction,
        // Convert comma-separated string to array and trim whitespace
        areasOfExpertise: areasOfExpertise 
          ? areasOfExpertise.split(',').map(area => area.trim()).filter(area => area.length > 0)
          : [],
        isActive: true,
        maxMatches,
        currentMatchCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Only add optional fields if they have values
      if (languages.includes('Other') && otherLanguage.trim()) {
        newProfile.otherLanguage = otherLanguage;
      }
      
      await mentorService.createMentorProfile(newProfile);
      
      if (!errorState.isError && backToPage) {
        backToPage();
      }
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
    if (languages.includes('Other') && !otherLanguage.trim()) {
      throw new Error("Please specify the other language");
    }
    if (!introduction.trim()) {
      throw new Error("Please write a brief introduction about yourself");
    }
  }

  return (
    <ContentContainer title="Create Mentor Profile">
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
            Career & Technical Expertise
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

          {/* Areas of Expertise */}
          <TextField
            fullWidth
            label="Areas of Expertise (Optional)"
            placeholder="e.g., Machine Learning, Career Development, Interview Prep"
            value={areasOfExpertise}
            onChange={(e) => setAreasOfExpertise(e.target.value)}
            helperText="Separate multiple areas with commas"
            sx={{ mb: 2 }}
          />
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
              Select experiences you'd like to share with potential mentees (affects matching)
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

          {/* Introduction */}
          <TextField
            fullWidth
            required
            label="Introduction *"
            placeholder="Tell potential mentees about yourself, your experience, and what you can help with..."
            multiline
            rows={4}
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Section: Mentorship Capacity */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#0066cc', fontWeight: 600 }}>
            Mentorship Capacity
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Maximum Mentees</InputLabel>
            <Select
              value={maxMatches}
              onChange={(e) => setMaxMatches(e.target.value as number)}
              label="Maximum Mentees"
            >
              <MenuItem value={1}>1 mentee</MenuItem>
              <MenuItem value={2}>2 mentees</MenuItem>
              <MenuItem value={3}>3 mentees</MenuItem>
              <MenuItem value={4}>4 mentees</MenuItem>
              <MenuItem value={5}>5 mentees</MenuItem>
              <MenuItem value={10}>10 mentees</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="caption" color="text.secondary">
            You can adjust this later if your availability changes
          </Typography>
        </Box>

        {/* Section: Matching Preferences (Weights) */}
        <Box>
          <WeightSelector weights={weights} onChange={setWeights} />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          {backToPage && (
            <Button 
              variant="outlined" 
              onClick={backToPage}
            >
              Cancel
            </Button>
          )}
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

export default CreateMentorProfile;
