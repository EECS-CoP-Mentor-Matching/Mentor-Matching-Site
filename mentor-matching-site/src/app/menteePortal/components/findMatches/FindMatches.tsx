/**
 * FIND MATCHES COMPONENT - Using Enhanced MatchCard
 * 
 * Shows potential mentor matches for a mentee based on their profile
 */

import { useState, useEffect, useCallback } from 'react';
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
  Tooltip,
  Snackbar,
  Grid
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useAppSelector } from '../../../../redux/hooks';
import matchingService from '../../../../service/matchingService';
import menteeService from '../../../../service/menteeService';
import matchDbService from '../../../../service/matchDbService';
import userService from '../../../../service/userService';
import MatchCard from '../../../common/forms/MatchCard'; // Enhanced version
import { MatchProfile, CalculatedMatch } from '../../../../types/matchProfile';
import { UserProfile } from '../../../../types/userProfile';
import { DocItem } from '../../../../types/types';
import ContentContainer from '../../../common/ContentContainer';

interface MatchWithUserProfile extends CalculatedMatch {
  userProfile?: UserProfile;
}

function FindMatches() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [matches, setMatches] = useState<MatchWithUserProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [menteeProfiles, setMenteeProfiles] = useState<DocItem<MatchProfile>[]>([]);
  const [minMatchPercentage, setMinMatchPercentage] = useState<number>(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [connectedMatches, setConnectedMatches] = useState<Set<string>>(new Set());
  const [matchStatuses, setMatchStatuses] = useState<Map<string, 'pending' | 'accepted' | 'declined'>>(new Map());
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  // Load mentee's profiles
  const loadProfiles = useCallback(async () => {
    if (!userProfile?.UID) return;
    
    setLoading(true);
    try {
      const profiles = await menteeService.searchMenteeProfilesByUser(userProfile.UID);
        setMenteeProfiles(profiles);
        
        if (profiles.length > 0) {
          setSelectedProfileId(profiles[0].docId);
        }

        // Load existing matches
        const existingMatches = await matchDbService.getMatchesForMentee(userProfile.UID);
        const connectedMentorIds = new Set(
          existingMatches
            .filter(m => m.status === 'pending' || m.status === 'accepted')
            .map(m => m.mentorProfileId)
        );
        setConnectedMatches(connectedMentorIds);

        const statusMap = new Map<string, 'pending' | 'accepted' | 'declined'>();
        existingMatches.forEach(m => {
          if (m.status === 'pending' || m.status === 'accepted') {
            statusMap.set(m.mentorProfileId, m.status as 'pending' | 'accepted' | 'declined');
          }
        });
        setMatchStatuses(statusMap);

      } catch (err) {
        console.error('Error loading profiles:', err);
        setError('Failed to load your profiles');
      } finally {
        setLoading(false);
      }
    }, [userProfile?.UID]); // Remove refreshKey from here

    useEffect(() => {
      loadProfiles();
    }, [loadProfiles, refreshKey]); // Add refreshKey here instead

  // Load matches when profile is selected
  useEffect(() => {
    const loadMatches = async () => {
      if (!selectedProfileId || !userProfile?.UID) return;
      
      setLoading(true);
      setError('');
      
      try {
        const selectedProfile = menteeProfiles.find(p => p.docId === selectedProfileId);
        if (!selectedProfile) {
          setError('Profile not found');
          setLoading(false);
          return;
        }

        const menteeProfile = selectedProfile.data as MatchProfile;

        if (!menteeProfile.careerFields || !menteeProfile.technicalInterests || !menteeProfile.weights) {
          setError('This profile needs to be updated with matching preferences.');
          setLoading(false);
          return;
        }

        // Fetch active mentor profiles
        const mentorProfilesQuery = query(
          collection(db, 'mentorProfile'),
          where('isActive', '==', true)
        );
        
        const mentorSnapshot = await getDocs(mentorProfilesQuery);
        
        interface MentorProfileWithId {
          docId: string;
          profile: MatchProfile;
        }
        
        const mentorProfilesWithIds: MentorProfileWithId[] = [];
        
        mentorSnapshot.forEach(doc => {
          const data = doc.data() as MatchProfile;
          if (data.UID === userProfile?.UID) return; // Exclude self
          if (data.careerFields && data.technicalInterests && data.weights) {
            mentorProfilesWithIds.push({
              docId: doc.id,
              profile: data
            });
          }
        });

        if (mentorProfilesWithIds.length === 0) {
          setError('No mentor profiles available yet. Check back soon!');
          setLoading(false);
          return;
        }

        const mentorProfiles = mentorProfilesWithIds.map(m => m.profile);

        // Calculate matches
        const calculatedMatches = await matchingService.findMentorMatches(
          menteeProfile,
          mentorProfiles,
          minMatchPercentage
        );

        // Fetch user profiles
        const matchesWithUserProfiles = await Promise.all(
          calculatedMatches.map(async (match, index) => {
            const mentorProfileId = mentorProfilesWithIds[index].docId;
            
            let mentorUserProfile: UserProfile | undefined;
            try {
              mentorUserProfile = await userService.getUserProfile(match.userId);
            } catch (err) {
              console.log('Could not load mentor user profile for', match.userId);
            }

            return {
              ...match,
              profileId: mentorProfileId,
              userProfile: mentorUserProfile
            };
          })
        );

        setMatches(matchesWithUserProfiles);
        
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
  }, [selectedProfileId, minMatchPercentage, menteeProfiles, userProfile?.UID]);

  const handleConnect = async (match: MatchWithUserProfile) => {
    if (!userProfile?.UID || !selectedProfileId) return;
    
    try {
      setLoading(true);
      
      const exists = await matchDbService.matchExists(selectedProfileId, match.profileId);
      if (exists) {
        setSuccessMessage('You already have a pending request with this mentor!');
        setShowSuccess(true);
        setLoading(false);
        return;
      }
      
      const selectedProfile = menteeProfiles.find(p => p.docId === selectedProfileId);
      if (!selectedProfile) {
        throw new Error('Profile not found');
      }
      
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
      
      setConnectedMatches(prev => new Set(prev).add(match.profileId));
      setMatchStatuses(prev => new Map(prev).set(match.profileId, 'pending'));
      
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

  const getConnectionStatus = (match: MatchWithUserProfile): 'pending' | 'accepted' | null => {
    const status = matchStatuses.get(match.profileId);
    if (status === 'pending') return 'pending';
    if (status === 'accepted') return 'accepted';
    return null;
  };

  return (
    <ContentContainer title="Find Mentors">
      <Box sx={{ 
        bgcolor: '#fafafa', // Very light gray like wireframe
        minHeight: '100vh',
        py: 3
      }}>
        <Box sx={{ maxWidth: 1400, margin: '0 auto', padding: 3 }}>
        
        <Alert severity="info" sx={{ marginBottom: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Finding Matches:</strong> We match you with mentors based on career fields, technical interests, 
            life experiences, and languages, weighted by your preferences.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Only mentors with updated profiles will appear.
          </Typography>
        </Alert>
        
        {/* Profile Selector & Filters */}
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Search Settings</Typography>
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

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="warning" sx={{ marginBottom: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && menteeProfiles.length === 0 && (
          <Alert severity="info">
            You need to create a mentee profile first to find matches.
          </Alert>
        )}

        {/* 2-COLUMN GRID WITH ENHANCED MATCHCARD */}
        {!loading && !error && matches.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Found {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {matches.map((match, index) => {
                const selectedProfile = menteeProfiles.find(p => p.docId === selectedProfileId);
                
                return (
                  <Grid item xs={12} md={6} key={`${match.userId}-${index}`}>
                    <MatchCard
                      match={match}
                      currentUserProfile={selectedProfile?.data}
                      matchUserProfile={match.userProfile}
                      onConnect={() => handleConnect(match)}
                      isConnected={connectedMatches.has(match.profileId)}
                      matchStatus={getConnectionStatus(match)}
                      cardType="mentee-finding-mentor"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}

        {!loading && !error && selectedProfileId && matches.length === 0 && (
          <Alert severity="info">
            No matches found with at least {minMatchPercentage}% compatibility.
            Try lowering the minimum match percentage.
          </Alert>
        )}
      </Box>
      </Box>

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
