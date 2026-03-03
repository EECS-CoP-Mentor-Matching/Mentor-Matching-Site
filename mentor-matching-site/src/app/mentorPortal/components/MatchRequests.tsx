/**
 * MATCH REQUESTS COMPONENT - Using Enhanced MatchCard
 * 
 * Shows pending mentee connection requests for mentors to review
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { useAppSelector } from '../../../redux/hooks';
import matchDbService, { Match } from '../../../service/matchDbService';
import menteeService from '../../../service/menteeService';
import userService from '../../../service/userService';
import { mentorService } from '../../../service/mentorService';
import MatchCard from '../../common/forms/MatchCard'; // Enhanced version
import { MatchProfile } from '../../../types/matchProfile';
import { UserProfile } from '../../../types/userProfile';
import ContentContainer from '../../common/ContentContainer';

interface MatchRequestWithProfile extends Match {
  menteeProfile?: MatchProfile;
  menteeUserProfile?: UserProfile;
}

function MatchRequests() {
  const [matches, setMatches] = useState<MatchRequestWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mentorProfile, setMentorProfile] = useState<MatchProfile | null>(null);

  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  const loadPendingMatches = useCallback(async () => {
    if (!userProfile?.UID) return;

    setLoading(true);
    setError('');

    try {
      // Get mentor's profile for comparison
      const mentorProfiles = await mentorService.searchMentorProfilesByUser(userProfile.UID);
      if (mentorProfiles.length > 0) {
        setMentorProfile(mentorProfiles[0].data);
      }

      // Get pending matches for this mentor
      const pendingMatches = await matchDbService.getPendingMatchesForMentor(userProfile.UID);

      // Load mentee profile AND user profile data for each match
      const matchesWithProfiles = await Promise.all(
        pendingMatches.map(async (match) => {
          try {
            // Get mentee's matching profile
            const menteeProfile = await menteeService.searchMenteeProfileById(match.menteeProfileId);
            
            // Get mentee's user profile for additional info
            let menteeUserProfile: UserProfile | undefined;
            try {
              menteeUserProfile = await userService.getUserProfile(match.menteeId);
            } catch (err) {
              console.log('Could not load mentee user profile');
            }

            return {
              ...match,
              menteeProfile: menteeProfile?.data,
              menteeUserProfile
            };
          } catch (err) {
            console.error('Error loading mentee profile:', err);
            return match;
          }
        })
      );

      setMatches(matchesWithProfiles);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Failed to load match requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userProfile?.UID]);

  useEffect(() => {
    loadPendingMatches();
  }, [loadPendingMatches]);

  const handleAccept = async (match: MatchRequestWithProfile, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!match.matchId) return;

    try {
      await matchDbService.updateMatchStatus(match.matchId, 'accepted');
      await loadPendingMatches(); // Refresh list
    } catch (err) {
      console.error('Error accepting match:', err);
      setError('Failed to accept match. Please try again.');
    }
  };

  const handleDecline = async (match: MatchRequestWithProfile, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!match.matchId) return;

    try {
      await matchDbService.updateMatchStatus(match.matchId, 'declined');
      await loadPendingMatches(); // Refresh list
    } catch (err) {
      console.error('Error declining match:', err);
      setError('Failed to decline match. Please try again.');
    }
  };

  return (
    <ContentContainer title="Match Requests">
      <Box sx={{ 
        bgcolor: '#fafafa', // Very light gray like wireframe
        minHeight: '100vh',
        py: 3
      }}>
        <Box sx={{ maxWidth: 1400, margin: '0 auto', padding: 3 }}>
        
        {/* Info Banner */}
        <Alert severity="info" sx={{ marginBottom: 3 }}>
          <Typography variant="body2">
            These mentees have requested to connect with you based on your shared interests and expertise.
            Review their profiles and accept or decline each request.
          </Typography>
        </Alert>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && matches.length === 0 && (
          <Box sx={{ textAlign: 'center', padding: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Pending Requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              When mentees request to connect with you, they'll appear here.
            </Typography>
          </Box>
        )}

        {/* Pending Matches - 2 COLUMN GRID WITH ENHANCED MATCHCARD */}
        {!loading && matches.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {matches.length} Pending {matches.length === 1 ? 'Request' : 'Requests'}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {matches.map((match: MatchRequestWithProfile) => (
                <Grid item xs={12} md={6} key={match.matchId}>
                  <MatchCard
                    match={{
                      ...match,
                      profile: match.menteeProfile!,
                      userId: match.menteeId,
                      userType: 'mentee',
                      profileId: match.menteeProfileId,
                      matchPercentage: match.matchPercentage,
                      categoryScores: {
                        technicalInterests: match.matchDetails?.technicalInterestsScore || 0,
                        lifeExperiences: match.matchDetails?.lifeExperiencesScore || 0,
                        languages: match.matchDetails?.languagesScore || 0
                      }
                    }}
                    currentUserProfile={mentorProfile}
                    matchUserProfile={match.menteeUserProfile}
                    onAccept={(event) => handleAccept(match, event)}
                    onDecline={(event) => handleDecline(match, event)}
                    cardType="mentor-reviewing-mentee"
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
      </Box>
    </ContentContainer>
  );
}

export default MatchRequests;
