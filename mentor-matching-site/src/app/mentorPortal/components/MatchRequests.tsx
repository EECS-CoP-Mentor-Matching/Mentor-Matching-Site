import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Grid
} from '@mui/material';
import {
  CheckCircle as AcceptIcon,
  Cancel as DeclineIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAppSelector } from '../../../redux/hooks';
import matchDbService, { Match } from '../../../service/matchDbService';
import menteeService from '../../../service/menteeService';
import { MatchProfile } from '../../../types/matchProfile';
import ContentContainer from '../../common/ContentContainer';

interface MatchRequestWithProfile extends Match {
  menteeProfile?: MatchProfile;
}

function MatchRequests() {
  const [matches, setMatches] = useState<MatchRequestWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  useEffect(() => {
    loadPendingMatches();
  }, [userProfile]);

  const loadPendingMatches = async () => {
    if (!userProfile?.UID) return;

    setLoading(true);
    setError('');

    try {
      // Get pending matches for this mentor
      const pendingMatches = await matchDbService.getPendingMatchesForMentor(userProfile.UID);

      // Load mentee profile data for each match
      const matchesWithProfiles = await Promise.all(
        pendingMatches.map(async (match) => {
          try {
            const menteeProfile = await menteeService.searchMenteeProfileById(match.menteeProfileId);
            return {
              ...match,
              menteeProfile: menteeProfile?.data
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
  };

  const handleAccept = async (matchId: string) => {
    setProcessingId(matchId);
    try {
      await matchDbService.updateMatchStatus(matchId, 'accepted');
      await loadPendingMatches(); // Refresh list
    } catch (err) {
      console.error('Error accepting match:', err);
      setError('Failed to accept match. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (matchId: string) => {
    setProcessingId(matchId);
    try {
      await matchDbService.updateMatchStatus(matchId, 'declined');
      await loadPendingMatches(); // Refresh list
    } catch (err) {
      console.error('Error declining match:', err);
      setError('Failed to decline match. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getMatchColor = (percentage: number): string => {
    if (percentage >= 80) return '#22c55e';
    if (percentage >= 60) return '#3b82f6';
    if (percentage >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getMatchLabel = (percentage: number): string => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Potential Match';
  };

  return (
    <ContentContainer title="Match Requests">
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
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

        {/* Match Requests List */}
        {!loading && matches.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {matches.length} Pending {matches.length === 1 ? 'Request' : 'Requests'}
            </Typography>

            <Grid container spacing={3}>
              {matches.map((match) => {
                const matchColor = getMatchColor(match.matchPercentage);
                const isProcessing = processingId === match.matchId;

                return (
                  <Grid item xs={12} key={match.matchId}>
                    <Card sx={{ border: '1px solid #e0e0e0', position: 'relative' }}>
                      <CardContent>
                        {/* Header: Avatar, Name, Match % */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: matchColor, mr: 2, width: 56, height: 56 }}>
                            <PersonIcon />
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0066cc' }}>
                              {match.menteeProfile?.introduction || 'Mentee Profile'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Requested {new Date(match.matchedAt.seconds * 1000).toLocaleDateString()}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h4" sx={{ color: matchColor, fontWeight: 700 }}>
                              {Math.round(match.matchPercentage)}%
                            </Typography>
                            <Chip 
                              label={getMatchLabel(match.matchPercentage)} 
                              size="small"
                              sx={{ 
                                bgcolor: matchColor + '20',
                                color: matchColor,
                                fontWeight: 600
                              }}
                            />
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Mentee Details */}
                        {match.menteeProfile && (
                          <Box sx={{ mb: 2 }}>
                            {/* Elevator Pitch */}
                            {match.menteeProfile.aboutMe && (
                              <Box sx={{ mb: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                  About This Mentee
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#374151' }}>
                                  {match.menteeProfile.aboutMe}
                                </Typography>
                              </Box>
                            )}

                            {/* Career Fields */}
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                                Career Fields:
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                {match.menteeProfile.careerFields?.map((field) => (
                                  <Chip key={field} label={field} size="small" color="primary" />
                                ))}
                              </Box>
                            </Box>

                            {/* Technical Interests */}
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                                Technical Interests:
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                {match.menteeProfile.technicalInterests?.map((interest) => (
                                  <Chip key={interest} label={interest} size="small" sx={{ bgcolor: '#e3f2fd' }} />
                                ))}
                              </Box>
                            </Box>

                            {/* Mentorship Goal */}
                            {match.menteeProfile.mentorshipGoal && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                                  Goal: 
                                </Typography>
                                <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                  {match.menteeProfile.mentorshipGoal}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}

                        {/* Match Breakdown */}
                        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#555', display: 'block', mb: 1 }}>
                            Match Breakdown:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Career/Technical:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {match.matchDetails.technicalInterestsScore}%
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Life Experiences:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {match.matchDetails.lifeExperiencesScore}%
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Languages:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {match.matchDetails.languagesScore}%
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            startIcon={<AcceptIcon />}
                            onClick={() => handleAccept(match.matchId!)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Accept'}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            startIcon={<DeclineIcon />}
                            onClick={() => handleDecline(match.matchId!)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Decline'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
      </Box>
    </ContentContainer>
  );
}

export default MatchRequests;
