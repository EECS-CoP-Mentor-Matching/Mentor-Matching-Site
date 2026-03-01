import { useState, useEffect } from "react";
import { Box, Button, Card, TextField, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText, Typography, Divider, Alert } from "@mui/material";
import { MatchProfile, UserWeights, initUserWeights } from "../../../types/matchProfile";
import { DocItem } from "../../../types/types";
import { CAREER_FIELDS, LIFE_EXPERIENCES, LANGUAGES, MENTORSHIP_GOALS, getTechnicalInterestOptions } from "../../../config/matchingConfig";
import { WeightSelector } from "../forms/WeightSelector";
import ModalWrapper from "../forms/modals/ModalWrapper";

interface ProfileService {
  updateMenteeProfile?: (profile: MatchProfile, profileId: string) => Promise<void>;
  editMentorProfile?: (docId: string, profile: MatchProfile) => Promise<any>;
}

interface EditProfileProps {
  matchProfile: DocItem<MatchProfile>;
  updateProfileState: (profile: DocItem<MatchProfile>) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  userType: 'mentee' | 'mentor';
  service: ProfileService;
}

function EditProfile({ matchProfile, updateProfileState, editing, setEditing, userType, service }: EditProfileProps) {
  // Initialize all fields from existing profile
  const [careerFields, setCareerFields] = useState<string[]>(matchProfile.data.careerFields || []);
  const [technicalInterests, setTechnicalInterests] = useState<string[]>(matchProfile.data.technicalInterests || []);
  const [lifeExperiences, setLifeExperiences] = useState<string[]>(matchProfile.data.lifeExperiences || []);
  const [languages, setLanguages] = useState<string[]>(matchProfile.data.languages || ['English']);
  const [otherLanguage, setOtherLanguage] = useState<string>(matchProfile.data.otherLanguage || '');
  const [introduction, setIntroduction] = useState<string>(matchProfile.data.introduction || '');
  const [aboutMe, setAboutMe] = useState<string>(matchProfile.data.aboutMe || '');
  const [mentorshipGoal, setMentorshipGoal] = useState<string>(matchProfile.data.mentorshipGoal || '');
  const [mentorshipGoalOther, setMentorshipGoalOther] = useState<string>(matchProfile.data.mentorshipGoalOther || '');
  const [areasOfExpertise, setAreasOfExpertise] = useState<string>(
    matchProfile.data.areasOfExpertise?.join(', ') || ''
  );
  const [weights, setWeights] = useState<UserWeights>(matchProfile.data.weights || initUserWeights());
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get available technical interests based on selected career fields
  const availableTechnicalInterests = getTechnicalInterestOptions(careerFields);

  // Auto-disable life experiences weight if user chooses not to share
  const isLifeExperiencesSkipped = lifeExperiences.some(exp => 
    exp.toLowerCase().includes('prefer not to share')
  );

  useEffect(() => {
    if (isLifeExperiencesSkipped && weights.lifeExperiences !== 0) {
      setWeights(prev => ({
        ...prev,
        lifeExperiences: 0
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLifeExperiencesSkipped]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedProfile: MatchProfile = {
        ...matchProfile.data,
        careerFields,
        technicalInterests,
        lifeExperiences,
        languages,
        weights,
        introduction,
        updatedAt: new Date()
      };

      // Add role-specific fields
      if (userType === 'mentee') {
        updatedProfile.aboutMe = aboutMe;
        updatedProfile.mentorshipGoal = mentorshipGoal;
        if (mentorshipGoal === 'Other' && mentorshipGoalOther.trim()) {
          updatedProfile.mentorshipGoalOther = mentorshipGoalOther;
        }
      } else {
        // Mentor fields - validate required
        if (!areasOfExpertise.trim()) {
          throw new Error('Areas of Expertise is required for mentors');
        }
        updatedProfile.areasOfExpertise = areasOfExpertise 
          ? areasOfExpertise.split(',').map(area => area.trim()).filter(area => area.length > 0)
          : [];
      }

      // Add optional fields
      if (languages.includes('Other') && otherLanguage.trim()) {
        updatedProfile.otherLanguage = otherLanguage;
      }

      // Call appropriate service method based on userType
      if (userType === 'mentee' && service.updateMenteeProfile) {
        await service.updateMenteeProfile(updatedProfile, matchProfile.docId);
      } else if (userType === 'mentor' && service.editMentorProfile) {
        await service.editMentorProfile(matchProfile.docId, updatedProfile);
      }

      updateProfileState({ docId: matchProfile.docId, data: updatedProfile });
      
      // Show success message
      setShowSuccess(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        setEditing(false);
        setShowSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper open={editing} setIsOpen={setEditing}>
      <Card sx={{ 
        maxWidth: '800px', 
        maxHeight: '90vh', 
        overflow: 'auto',
        p: 3 
      }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#0066cc', fontWeight: 600 }}>
          Edit Profile
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Success Message */}
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Profile saved! {userType === 'mentee' ? "Go to 'Find Matches' tab - your matches will automatically recalculate with your new preferences." : "Your profile has been updated successfully."}
          </Alert>
        )}

        {/* Profile Name */}
        <TextField
          fullWidth
          required
          label="Profile Name *"
          value={introduction}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 50) {
              setIntroduction(value);
            }
          }}
          helperText={`${introduction.length}/50 characters`}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 50 }}
        />

        {/* Elevator Pitch - Mentees only */}
        {userType === 'mentee' && (
          <TextField
            fullWidth
            required
            label="Your Elevator Pitch *"
            placeholder="What makes you an awesome mentee?"
            multiline
            rows={4}
            value={aboutMe}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 500) {
                setAboutMe(value);
              }
            }}
            helperText={`${aboutMe.length}/500 characters`}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 500 }}
          />
        )}

        {/* Areas of Expertise - Mentors only */}
        {userType === 'mentor' && (
          <TextField
            fullWidth
            required
            label="Areas of Expertise *"
            placeholder="e.g., Machine Learning, Career Development, Interview Prep"
            value={areasOfExpertise}
            onChange={(e) => setAreasOfExpertise(e.target.value)}
            helperText="Separate multiple areas with commas"
            sx={{ mb: 2 }}
          />
        )}

        {/* Career Fields */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel required>Career Fields *</InputLabel>
          <Select
            multiple
            required
            value={careerFields}
            onChange={(e) => setCareerFields(e.target.value as string[])}
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

        {/* Technical Interests */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel required>Technical Interests *</InputLabel>
          <Select
            multiple
            required
            value={technicalInterests}
            onChange={(e) => setTechnicalInterests(e.target.value as string[])}
            input={<OutlinedInput label="Technical Interests *" />}
            renderValue={(selected) => selected.join(', ')}
            disabled={careerFields.length === 0}
          >
            {availableTechnicalInterests.map((interest) => (
              <MenuItem key={interest} value={interest}>
                <Checkbox checked={technicalInterests.indexOf(interest) > -1} />
                <ListItemText primary={interest} />
              </MenuItem>
            ))}
          </Select>
          {careerFields.length === 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Select career fields first to see technical interests
            </Typography>
          )}
        </FormControl>

        {/* Life Experiences */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Life Experiences (Optional)</InputLabel>
          <Select
            multiple
            value={lifeExperiences}
            onChange={(e) => setLifeExperiences(e.target.value as string[])}
            input={<OutlinedInput label="Life Experiences (Optional)" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {LIFE_EXPERIENCES.map((exp) => (
              <MenuItem key={exp} value={exp}>
                <Checkbox checked={lifeExperiences.indexOf(exp) > -1} />
                <ListItemText primary={exp} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Languages */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel required>Languages *</InputLabel>
          <Select
            multiple
            required
            value={languages}
            onChange={(e) => setLanguages(e.target.value as string[])}
            input={<OutlinedInput label="Languages *" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang} value={lang}>
                <Checkbox checked={languages.indexOf(lang) > -1} />
                <ListItemText primary={lang} />
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

        {/* Mentorship Goal (Mentee only) */}
        {userType === 'mentee' && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel required>Mentorship Goal *</InputLabel>
              <Select
                required
                value={mentorshipGoal}
                onChange={(e) => setMentorshipGoal(e.target.value)}
                label="Mentorship Goal *"
              >
                {MENTORSHIP_GOALS.map((goal) => (
                  <MenuItem key={goal} value={goal}>
                    {goal}
                  </MenuItem>
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
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Weight Selectors */}
        <Typography variant="h6" gutterBottom sx={{ color: '#555', fontWeight: 600, mb: 2 }}>
          Matching Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set how important each category is for finding your {userType === 'mentee' ? 'mentor' : 'mentee'}
        </Typography>

        <WeightSelector
          weights={weights}
          onChange={setWeights}
          disableLifeExperiences={isLifeExperiencesSkipped}
        />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setEditing(false)}
            disabled={loading}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={
              loading || 
              !introduction.trim() || 
              careerFields.length === 0 || 
              technicalInterests.length === 0 || 
              languages.length === 0 || 
              (userType === 'mentee' && (!aboutMe.trim() || !mentorshipGoal))
            }
            fullWidth
            sx={{ 
              backgroundColor: '#0066cc',
              '&:hover': { backgroundColor: '#0052a3' }
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Card>
    </ModalWrapper>
  );
}

export default EditProfile;
