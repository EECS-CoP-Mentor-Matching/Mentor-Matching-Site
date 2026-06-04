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
  Divider,
  Chip
} from "@mui/material";
import WeightSelector from "../../common/forms/WeightSelector";
import ContentContainer from "../../common/ContentContainer";
import { mentorService } from "../../../service/mentorService";
import ErrorMessage, { ErrorState, parseError, resetError } from "../../common/forms/ErrorMessage";
import { MatchProfile, initUserWeights, UserWeights, Match } from "../../../types/matchProfile";
import authService from "../../../service/authService";
import LoadingMessage from "../../common/forms/modals/LoadingMessage";
import { 
  CAREER_FIELDS, 
  getTechnicalInterestOptions, 
  LIFE_EXPERIENCES, 
  LANGUAGES,
  RACIAL_IDENTITIES
} from "../../../config/matchingConfig";
import matchDbService from "../../../service/matchDbService";
//import Match from "../../../service/matchDbService";

interface CreateMentorProfileProps {
  backToPage?: () => void;
  demoMode: any;
}

function CreateMentorProfile({ backToPage, demoMode }: CreateMentorProfileProps) {
  const [errorState, setErrorState] = useState<ErrorState>({ isError: false, errorMessage: '' });
  const [loading, setLoading] = useState(false);

  // New matching fields state
  const [careerFields, setCareerFields] = useState<string[]>([]);
  const [technicalInterests, setTechnicalInterests] = useState<string[]>([]);
  const [lifeExperiences, setLifeExperiences] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>(['English']); // Default to English
  const [otherLanguage, setOtherLanguage] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>(''); // Profile name (50 chars)
  const [whyIMentor, setWhyIMentor] = useState<string>(''); // Why I mentor (150 chars)
  const [areasOfExpertise, setAreasOfExpertise] = useState<string>(''); // Specializations (50 chars)
  const [racialIdentity, setRacialIdentity] = useState<string>('');
  const [maxMatches, setMaxMatches] = useState<number>(5);
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
        introduction, // Profile name (50 chars)
        whyIMentor, // Why I mentor (150 chars)
        areasOfExpertise, // Specializations (50 chars text)
        // Only include racialIdentity if "Racial Minority" selected
        racialIdentity: lifeExperiences.includes('Racial Minority') ? racialIdentity : '',
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
      
      const mentorID = await mentorService.createMentorProfile(newProfile);

      // DEMO: Force at least one match request for this mentor
      if (demoMode) {
        const demoMatch: Match = {
          menteeId: "DemoMentee1",
          mentorId:  uid,
          menteeProfileId: "DemoMenteeProfile1",
          mentorProfileId: mentorID.id || "",

          matchedAt: 0,
          matchPercentage: 100,

          matchDetails: {
            technicalInterestsScore: 100,
            lifeExperiencesScore: 100,
            languagesScore: 100,
            menteeWeights: {
              technicalInterests: 5,
              lifeExperiences: 5,
              languages: 5
            },
            mentorWeights: {
              technicalInterests: 5,
              lifeExperiences: 5,
              languages: 5
            }
          },

          status: "pending",
          initiatedBy: "mentee"
        };

       // Create the demo match:
       await matchDbService.createMatch(demoMatch);

      }
      
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
      throw new Error("Please give your profile a name");
    }
    if (!whyIMentor.trim()) {
      throw new Error("Please share why you mentor");
    }
    if (whyIMentor.length > 150) {
      throw new Error("'Why I Mentor' must be 150 characters or less");
    }
    if (!areasOfExpertise.trim()) {
      throw new Error("Please list your areas of expertise");
    }
    if (areasOfExpertise.length > 50) {
      throw new Error("Areas of expertise must be 50 characters or less");
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
        </Box>

        {/* Section: About You */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
          
          {/* Racial Identity - Only if "Racial Minority" selected */}
          {lifeExperiences.includes('Racial Minority') && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Racial Identity *</InputLabel>
              <Select
                value={racialIdentity}
                onChange={(e) => setRacialIdentity(e.target.value)}
                label="Racial Identity *"
              >
                {RACIAL_IDENTITIES.map((identity) => (
                  <MenuItem key={identity} value={identity}>{identity}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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
              sx={{ mb: 2, width: '100%', maxWidth: '600px', alignSelf: 'center' }}
            />
          )}

          {/* Profile Name */}
          <TextField
            fullWidth
            required
            label="Profile Name *"
            placeholder="Give this profile a memorable name"
            value={introduction}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 50) {
                setIntroduction(value);
              }
            }}
            helperText={`${introduction.length}/50 characters - This name is private (only you see it)`}
            sx={{ mb: 2, width: '100%', maxWidth: '600px', alignSelf: 'center' }}
            inputProps={{ maxLength: 50 }}
          />

          {/* Why I Mentor */}
          <TextField
            fullWidth
            required
            label="Why I Mentor *"
            placeholder="What motivates you to mentor others?"
            multiline
            rows={4}
            value={whyIMentor}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 150) {
                setWhyIMentor(value);
              }
            }}
            helperText={`${whyIMentor.length}/150 characters - Shows when mentees hover over your profile picture`}
            sx={{ mb: 2, width: '100%', maxWidth: '600px', alignSelf: 'center' }}
            inputProps={{ maxLength: 150 }}
          />

          {/* Areas of Expertise */}
          <TextField
            fullWidth
            required
            label="Areas of Expertise / Specializations *"
            placeholder="e.g., Machine Learning, Career Transitions"
            value={areasOfExpertise}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 50) {
                setAreasOfExpertise(value);
              }
            }}
            helperText={`${areasOfExpertise.length}/50 characters`}
            sx={{ mb: 2, width: '100%', maxWidth: '600px', alignSelf: 'center' }}
            inputProps={{ maxLength: 50 }}
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
          <WeightSelector 
            weights={weights} 
            onChange={setWeights}
            disableLifeExperiences={isLifeExperiencesSkipped}
          />
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
