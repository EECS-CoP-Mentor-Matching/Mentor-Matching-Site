/**
 * FIND MATCHES COMPONENT
 * 
 * Shows potential mentor matches for a mentee based on their profile
 */

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper
} from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useAppSelector } from '../../../../redux/hooks';
import matchingService from '../../../../service/matchingService';
import menteeService from '../../../../service/menteeService';
import MatchCard from '../../../common/forms/MatchCard';
import { MatchProfile, CalculatedMatch } from '../../../../types/matchProfile';
import { DocItem } from '../../../../types/types';
import ContentContainer from '../../../common/ContentContainer';

function FindMatches() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [matches, setMatches] = useState<CalculatedMatch[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [menteeProfiles, setMenteeProfiles] = useState<DocItem<MatchProfile>[]>([]);
  const [minMatchPercentage, setMinMatchPercentage] = useState<number>(30);

  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  // Load mentee's profiles
  useEffect(() => {
    const loadProfiles = async () => {
      if (!userProfile?.UID) return;
      
      try {
        const profiles = await menteeService.searchMenteeProfilesByUser(userProfile.UID);
        setMenteeProfiles(profiles);
        
        if (profiles.length > 0) {
          setSelectedProfileId(profiles[0].docId);
        }
      } catch (err) {
        console.error('Error loading profiles:', err);
        setError('Failed to load your profiles');
      }
    };

    loadProfiles();
  }, [userProfile]);

  // Load matches when profile is selected
  useEffect(() => {
    const loadMatches = async () => {
      if (!selectedProfileId) return;
      
      setLoading(true);
      setError('');
      
      try {
        // Get the selected mentee profile
        const selectedProfile = menteeProfiles.find(p => p.docId === selectedProfileId);
        if (!selectedProfile) {
          setError('Profile not found');
          setLoading(false);
          return;
        }

        const menteeProfile = selectedProfile.data as MatchProfile;

        // Check if profile has the new matching fields
        // TODO: FUTURE DYNAMIC SURVEY INTEGRATION
        // When implementing the dynamic survey system (surveySchema collection),
        // this validation will need to be updated to:
        // 1. Fetch current survey schema from Firestore
        // 2. Check if profile has responses for all algorithmWeight > 0 questions
        // 3. Map survey responses to matching algorithm inputs dynamically
        if (!menteeProfile.careerFields || !menteeProfile.technicalInterests || !menteeProfile.weights) {
          setError('This profile needs to be updated with matching preferences. Please edit your profile to add career fields, technical interests, and weight preferences.');
          setLoading(false);
          return;
        }

        // Fetch all active mentor profiles from Firestore
        const mentorProfilesQuery = query(
          collection(db, 'mentorProfile'),
          where('isActive', '==', true)
        );
        
        const mentorSnapshot = await getDocs(mentorProfilesQuery);
        const mentorProfiles: MatchProfile[] = [];
        
        mentorSnapshot.forEach(doc => {
          const data = doc.data() as MatchProfile;
          // Only include profiles with new matching fields
          // TODO: FUTURE DYNAMIC SURVEY INTEGRATION
          // When dynamic surveys are implemented, replace this check with:
          // - Validate profile has responses for all required survey questions
          // - Check that survey version matches current schema
          // - Dynamically map survey responses to algorithm inputs
          if (data.careerFields && data.technicalInterests && data.weights) {
            mentorProfiles.push(data);
          }
        });

        if (mentorProfiles.length === 0) {
          setError('No mentor profiles available yet. Check back soon!');
          setLoading(false);
          return;
        }

        // Calculate matches
        const calculatedMatches = await matchingService.findMentorMatches(
          menteeProfile,
          mentorProfiles,
          minMatchPercentage
        );

        // Add profile IDs (we'll need to fetch these properly)
        const matchesWithIds = calculatedMatches.map(match => ({
          ...match,
          profileId: match.userId // Using userId as profileId for now
        }));

        setMatches(matchesWithIds);
      } catch (err: any) {
        console.error('Error finding matches:', err);
        setError('Failed to find matches: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedProfileId) {
      loadMatches();
    }
  }, [selectedProfileId, minMatchPercentage, menteeProfiles]);

  const handleConnect = (match: CalculatedMatch) => {
    // TODO: Implement connect/message functionality
    console.log('Connect with:', match);
    alert(`Connect functionality coming soon! Match: ${match.matchPercentage}%`);
  };

  const handleViewProfile = (match: CalculatedMatch) => {
    // TODO: Implement view full profile
    console.log('View profile:', match);
    alert('View profile functionality coming soon!');
  };

  return (
    <ContentContainer title="Find Mentors">
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
        
        {/* Info Banner */}
        <Alert severity="info" sx={{ marginBottom: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Finding Matches:</strong> We match you with mentors based on career fields, technical interests, 
            life experiences, and languages, weighted by your preferences.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Note: Only mentors with updated profiles (including matching preferences) will appear in results.
            As more mentors update their profiles, you'll see more matches!
          </Typography>
        </Alert>
        
        {/* Profile Selector & Filters */}
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Search Settings
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Profile Selector */}
            {menteeProfiles.length > 1 && (
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Select Your Profile</InputLabel>
                <Select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  label="Select Your Profile"
                >
                  {menteeProfiles.map((profile) => (
                    <MenuItem key={profile.docId} value={profile.docId}>
                      {profile.data.technicalInterest || 'Profile'} - {profile.data.professionalInterest || 'N/A'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Min Match Percentage Slider */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="body2" gutterBottom>
                Minimum Match: {minMatchPercentage}%
              </Typography>
              <Slider
                value={minMatchPercentage}
                onChange={(e, value) => setMinMatchPercentage(value as number)}
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' }
                ]}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="warning" sx={{ marginBottom: 3 }}>
            {error}
          </Alert>
        )}

        {/* No Profiles State */}
        {!loading && menteeProfiles.length === 0 && (
          <Alert severity="info">
            You need to create a mentee profile first to find matches.
            Go to the "Create Profile" tab to get started!
          </Alert>
        )}

        {/* Matches Display */}
        {!loading && !error && matches.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Found {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sorted by match percentage
              </Typography>
            </Box>

            {matches.map((match, index) => (
              <MatchCard
                key={match.userId + index}
                match={match}
                onConnect={() => handleConnect(match)}
                onViewProfile={() => handleViewProfile(match)}
              />
            ))}
          </>
        )}

        {/* No Matches State */}
        {!loading && !error && selectedProfileId && matches.length === 0 && (
          <Alert severity="info">
            No matches found with at least {minMatchPercentage}% compatibility.
            Try lowering the minimum match percentage or updating your profile preferences.
          </Alert>
        )}
      </Box>
    </ContentContainer>
  );
}

export default FindMatches;
