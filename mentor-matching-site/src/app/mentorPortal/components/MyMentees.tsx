import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip,
  CircularProgress, Alert, Avatar, Divider, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Person as PersonIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAppSelector } from '../../../redux/hooks';
import matchDbService, { Match } from '../../../service/matchDbService';
import menteeService from '../../../service/menteeService';
import userService from '../../../service/userService';
import { MatchProfile } from '../../../types/matchProfile';
import { UserProfile } from '../../../types/userProfile';
import ContentContainer from '../../common/ContentContainer';

interface AcceptedMatch extends Match {
  menteeProfile?: MatchProfile;
  menteeUserProfile?: UserProfile;
}

function MyMentees() {
  const [acceptedMatches, setAcceptedMatches] = useState<AcceptedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<AcceptedMatch | null>(null);
  const [deleting, setDeleting] = useState(false);

  const userProfile = useAppSelector((state: any) => state.userProfile.userProfile);

  useEffect(() => {
    loadAcceptedMatches();
  }, [userProfile]);

  const loadAcceptedMatches = async () => {
    if (!userProfile?.UID) return;
    setLoading(true);
    setError('');

    try {
      const allMatches = await matchDbService.getAcceptedMatchesForMentor(userProfile.UID);

      // Load mentee profile and user data for each match
      const matchesWithProfiles = await Promise.all(
        allMatches.map(async (match: Match) => {
          try {
            const menteeProfile = await menteeService.searchMenteeProfileById(match.menteeProfileId);

            let menteeUserProfile: UserProfile | undefined;
            try {
              menteeUserProfile = await userService.getUserProfile(match.menteeId);
            } catch (err) {
              console.log('Could not load mentee user profile');
            }

            return { ...match, menteeProfile: menteeProfile?.data, menteeUserProfile };
          } catch (err) {
            console.error('Error loading mentee data:', err);
            return match;
          }
        })
      );

      setAcceptedMatches(matchesWithProfiles);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Failed to load your mentees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMenteeDisplayName = (match: AcceptedMatch): string => {
    if (match.menteeUserProfile?.contact?.displayName) {
      return match.menteeUserProfile.contact.displayName;
    }
    if (match.menteeUserProfile?.personal?.firstName) {
      return `${match.menteeUserProfile.personal.firstName} ${match.menteeUserProfile.personal.lastName}`;
    }
    return match.menteeProfile?.introduction || 'Your Mentee';
  };

  const getMenteeSubtitle = (match: AcceptedMatch): string => {
    return match.menteeProfile?.introduction || 'Mentee Profile';
  };

  const handleDeleteClick = (match: AcceptedMatch) => {
    setMatchToDelete(match);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!matchToDelete?.matchId || !userProfile) return;
    setDeleting(true);

    try {
      await matchDbService.endMentorship(
        matchToDelete.matchId,
        'mentor',
        userProfile.UID,                    // endingUserUID = mentor
        matchToDelete.menteeId,             // notifyUserUID = mentee
        userProfile.contact?.displayName || // endingUserName = mentor's name
          `${userProfile.personal?.firstName} ${userProfile.personal?.lastName}` ||
          'Your mentor',
        getMenteeDisplayName(matchToDelete), // notifyUserName = mentee's name
        matchToDelete.menteeId,
        userProfile.UID,
        matchToDelete.menteeProfileId,
        matchToDelete.mentorProfileId
      );

      setDeleteDialogOpen(false);
      setMatchToDelete(null);
      await loadAcceptedMatches();
    } catch (err) {
      console.error('Error ending mentorship:', err);
      setError('Failed to end mentorship. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getMatchColor = (percentage: number): string => {
    if (percentage >= 80) return '#22c55e';
    if (percentage >= 60) return '#3b82f6';
    if (percentage >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <ContentContainer title="My Mentees">
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Empty State */}
        {!loading && acceptedMatches.length === 0 && (
          <Box sx={{ textAlign: 'center', padding: 6 }}>
            <PersonIcon sx={{ fontSize: 80, color: '#d1d5db', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No Mentees Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              When mentees connect with you and you accept, they'll appear here!
            </Typography>
          </Box>
        )}

        {/* Accepted Matches */}
        {!loading && acceptedMatches.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {acceptedMatches.length} Active {acceptedMatches.length === 1 ? 'Mentee' : 'Mentees'}
            </Typography>

            <Grid container spacing={3}>
              {acceptedMatches.map((match: AcceptedMatch) => {
                const matchColor = getMatchColor(match.matchPercentage);
                const menteeName = getMenteeDisplayName(match);
                const menteeSubtitle = getMenteeSubtitle(match);

                return (
                  <Grid item xs={12} key={match.matchId}>
                    <Card sx={{ border: '2px solid #22c55e20', bgcolor: '#f0fdf4' }}>
                      <CardContent>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: matchColor, mr: 2, width: 56, height: 56 }}>
                            <PersonIcon />
                          </Avatar>

                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                              {menteeName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {menteeSubtitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Accepted {match.acceptedAt ? new Date((match.acceptedAt as any).seconds * 1000).toLocaleDateString() : ''}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h4" sx={{ color: matchColor, fontWeight: 700 }}>
                              {Math.round(match.matchPercentage)}%
                            </Typography>
                            <Chip
                              label="✓ Active"
                              size="small"
                              sx={{ bgcolor: '#22c55e20', color: '#22c55e', fontWeight: 600 }}
                            />
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Mentee Details */}
                        {match.menteeProfile && (
                          <Box sx={{ mb: 2 }}>
                            {match.menteeProfile.aboutMe && (
                              <Box sx={{ mb: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ color: '#374151', fontStyle: 'italic' }}>
                                  "{match.menteeProfile.aboutMe}"
                                </Typography>
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                              {match.menteeProfile.careerFields?.map((f: string) => (
                                <Chip key={f} label={f} size="small" color="primary" />
                              ))}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {match.menteeProfile.technicalInterests?.slice(0, 4).map((i: string) => (
                                <Chip key={i} label={i} size="small" sx={{ bgcolor: '#e3f2fd' }} />
                              ))}
                            </Box>
                            {match.menteeProfile.mentorshipGoal && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Goal:</strong> {match.menteeProfile.mentorshipGoal}
                              </Typography>
                            )}
                          </Box>
                        )}

                        {/* End Mentorship Button */}
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() => handleDeleteClick(match)}
                          sx={{ mt: 1 }}
                        >
                          End Mentorship with {menteeName}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: '#ef4444' }} />
          End Mentorship with {matchToDelete && getMenteeDisplayName(matchToDelete)}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end your mentorship with{' '}
            <strong>{matchToDelete && getMenteeDisplayName(matchToDelete)}</strong>
            {matchToDelete && ` (${getMenteeSubtitle(matchToDelete)})`}?
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#fef2f2', borderRadius: 1, border: '1px solid #fecaca' }}>
            <Typography variant="body2" color="error" sx={{ fontWeight: 600, mb: 1 }}>
              This will:
            </Typography>
            <Typography variant="body2" color="error">
              • Remove them from your My Mentees list
            </Typography>
            <Typography variant="body2" color="error">
              • Send a notification to your mentee
            </Typography>
            <Typography variant="body2" color="error">
              • Cannot be undone
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            variant="outlined"
            fullWidth
          >
            Cancel - Keep Mentee
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={deleting}
            variant="contained"
            color="error"
            fullWidth
          >
            {deleting ? 'Ending...' : 'Yes, End Mentorship'}
          </Button>
        </DialogActions>
      </Dialog>
    </ContentContainer>
  );
}

export default MyMentees;
