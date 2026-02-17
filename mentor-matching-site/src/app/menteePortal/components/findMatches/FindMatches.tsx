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
  Paper,
  Button,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useAppSelector } from '../../../../redux/hooks';
import matchingService from '../../../../service/matchingService';
import menteeService from '../../../../service/menteeService';
import matchDbService from '../../../../service/matchDbService';
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
  const [minMatchPercentage, setMinMatchPercentage] = useState<number>(10); // Lowered from 30 to show more matches
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh trigger
  const [connectedMatches, setConnectedMatches] = useState<Set<string>>(new Set()); // Track connected mentor IDs
  const [matchStatuses, setMatchStatuses] = useState<Map<string, 'pending' | 'accepted' | 'declined'>>(new Map());
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  // Load mentee's profiles (refreshes when refreshKey changes)
  useEffect(() => {
    const loadProfiles = async () => {
      if (!userProfile?.UID) return;
      
      console.log('🔄 LOADING PROFILES FROM FIRESTORE (refreshKey:', refreshKey, ')');
      setLoading(true);
      try {
        const profiles = await menteeService.searchMenteeProfilesByUser(userProfile.UID);
        console.log('✅ Loaded profiles:', profiles.length, 'profiles');
        console.log('Profile weights:', profiles[0]?.data.weights);
        setMenteeProfiles(profiles);
        
        if (profiles.length > 0) {
          setSelectedProfileId(profiles[0].docId);
        }

        // Load existing matches to restore "Request Sent" state
        const existingMatches = await matchDbService.getMatchesForMentee(userProfile.UID);
        const connectedMentorIds = new Set(
          existingMatches
            .filter(m => m.status === 'pending' || m.status === 'accepted')
            .map(m => m.mentorId)
        );
        setConnectedMatches(connectedMentorIds);

        // Track individual statuses per mentor - only show active statuses
        // Ended/declined matches should allow reconnection so we skip them
        const statusMap = new Map<string, 'pending' | 'accepted' | 'declined'>();
        existingMatches.forEach(m => {
          if (m.status === 'pending' || m.status === 'accepted') {
            statusMap.set(m.mentorId, m.status as 'pending' | 'accepted' | 'declined');
          }
        });
        setMatchStatuses(statusMap);

      } catch (err) {
        console.error('Error loading profiles:', err);
        setError('Failed to load your profiles');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [userProfile, refreshKey]);

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
          // Exclude self-matches (same UID as mentee)
          if (data.UID === userProfile?.UID) return;
          // Only include profiles with new matching fields
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

        console.log('📊 Calculated matches:', calculatedMatches.map(m => `${m.matchPercentage}%`));

        // Add profile IDs (we'll need to fetch these properly)
        const matchesWithIds = calculatedMatches.map(match => ({
          ...match,
          profileId: match.userId // Using userId as profileId for now
        }));

        // Force React to re-render by clearing first
        setMatches([]);
        setTimeout(() => {
          setMatches(matchesWithIds);
          console.log('✅ Matches state updated with', matchesWithIds.length, 'matches');
        }, 0);
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

  const handleConnect = async (match: CalculatedMatch) => {
    if (!userProfile?.UID || !selectedProfileId) return;
    
    try {
      setLoading(true);
      
      // Check if match already exists
      const exists = await matchDbService.matchExists(selectedProfileId, match.profileId);
      if (exists) {
        setSuccessMessage('You already have a pending request with this mentor!');
        setShowSuccess(true);
        setLoading(false);
        return;
      }
      
      // Get the selected mentee profile for weights
      const selectedProfile = menteeProfiles.find(p => p.docId === selectedProfileId);
      if (!selectedProfile) {
        throw new Error('Profile not found');
      }
      
      // Create match request
      await matchDbService.createMatch({
        menteeId: userProfile.UID,
        mentorId: match.userId,
        menteeProfileId: selectedProfileId,
        mentorProfileId: match.profileId,
        matchPercentage: match.matchPercentage,
        matchDetails: {
          technicalInterestsScore: match.categoryScores?.technicalInterests || 0,
          lifeExperiencesScore: match.categoryScores?.lifeExperiences || 0,
          languagesScore: match.categoryScores?.languages || 0,
          menteeWeights: selectedProfile.data.weights || { technicalInterests: 3, lifeExperiences: 3, languages: 3 },
          mentorWeights: match.profile.weights || { technicalInterests: 3, lifeExperiences: 3, languages: 3 }
        },
        status: 'pending',
        initiatedBy: 'mentee',
        matchedAt: new Date() as any
      });
      
      // Track this match as connected
      setConnectedMatches(prev => new Set(prev).add(match.userId));
      
      setSuccessMessage('Match request sent! The mentor will be notified.');
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error creating match:', error);
      setSuccessMessage('Failed to send match request. Please try again.');
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
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
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Match Criteria:</strong> Matches appear when you share at least one career field or technical interest 
            AND at least one language in common. Low percentages mean less overlap, but they can still be valuable connections!
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Note: Only mentors with updated profiles (including matching preferences) will appear in results.
            As more mentors update their profiles, you'll see more matches!
          </Typography>
        </Alert>
        
        {/* Profile Selector & Filters */}
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Search Settings
            </Typography>
            <Tooltip title="Refresh profiles and recalculate matches">
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={() => setRefreshKey(prev => prev + 1)}
                size="small"
              >
                Refresh
              </Button>
            </Tooltip>
          </Box>

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
                key={`${match.userId}-${match.matchPercentage}-${index}`}
                match={match}
                onConnect={() => handleConnect(match)}
                onViewProfile={() => handleViewProfile(match)}
                isConnected={connectedMatches.has(match.userId)}
                matchStatus={matchStatuses.get(match.userId) || null}
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

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </ContentContainer>
  );
}

export default FindMatches;
