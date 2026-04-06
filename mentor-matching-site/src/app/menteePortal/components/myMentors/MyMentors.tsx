import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip,
  CircularProgress, Alert, Avatar, Divider, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAppSelector } from '../../../../redux/hooks';
import matchDbService, { Match } from '../../../../service/matchDbService';
import { mentorService } from '../../../../service/mentorService';
import menteeService from '../../../../service/menteeService';
import userService from '../../../../service/userService';
import { MatchProfile, CalculatedMatch } from '../../../../types/matchProfile';
import { UserProfile } from '../../../../types/userProfile';
import ContentContainer from '../../../common/ContentContainer';
import MatchCard from '../../../common/forms/MatchCard';
import '../../../common/forms/MatchCard.css';

interface AcceptedMatch extends Match {
  mentorProfile?: MatchProfile;
  mentorUserProfile?: UserProfile;
  menteeProfile?: MatchProfile;
}

interface MyMentorsProps {
  onFindMentors: () => void;
}

function MyMentors({ onFindMentors }: MyMentorsProps) {
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
      const allMatches = await matchDbService.getMatchesForMentee(userProfile.UID);
      const accepted = allMatches.filter((m: Match) => m.status === 'accepted');

      // Load mentor profile and user data for each match
      const matchesWithProfiles = await Promise.all(
        accepted.map(async (match: Match) => {
          try {
            // Get mentor profile data
            const mentorProfiles = await mentorService.searchMentorProfilesByUser(match.mentorId);
            const mentorProfile = mentorProfiles[0]?.data;

            // Get mentor's user profile for their name
            let mentorUserProfile: UserProfile | undefined;
            try {
              mentorUserProfile = await userService.getUserProfile(match.mentorId);
            } catch (err) {
              console.log('Could not load mentor user profile');
            }

            // Get mentee's match profile for comparison in dropdowns
            let menteeProfile: MatchProfile | undefined;
            try {
              const menteeProfileDoc = await menteeService.searchMenteeProfileById(match.menteeProfileId);
              menteeProfile = menteeProfileDoc?.data;
            } catch (err) {
              console.log('Could not load mentee profile');
            }

            return { ...match, mentorProfile, mentorUserProfile, menteeProfile };
          } catch (err) {
            console.error('Error loading mentor data:', err);
            return match;
          }
        })
      );

      setAcceptedMatches(matchesWithProfiles);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Failed to load your mentors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMentorDisplayName = (match: AcceptedMatch): string => {
    if (match.mentorUserProfile?.contact?.displayName) {
      return match.mentorUserProfile.contact.displayName;
    }
    if (match.mentorUserProfile?.personal?.firstName) {
      return `${match.mentorUserProfile.personal.firstName} ${match.mentorUserProfile.personal.lastName}`;
    }
    return match.mentorProfile?.introduction || 'Your Mentor';
  };

  const getMentorSubtitle = (match: AcceptedMatch): string => {
    return match.mentorProfile?.introduction || 'Mentor Profile';
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
        'mentee',
        userProfile.UID,
        matchToDelete.mentorId,
        getMentorDisplayName(matchToDelete),
        userProfile.contact?.displayName ||
          `${userProfile.personal?.firstName} ${userProfile.personal?.lastName}` ||
          'Your mentee',
        userProfile.UID,
        matchToDelete.mentorId,
        matchToDelete.menteeProfileId,
        matchToDelete.mentorProfileId
      );

      setDeleteDialogOpen(false);
      setMatchToDelete(null);
      await loadAcceptedMatches(); // Refresh list
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
    <ContentContainer title="My Mentors">
      <Box sx={{ 
        bgcolor: '#fafafa',
        minHeight: '100vh',
        py: 3
      }}>
        <Box sx={{ width: '100%', margin: '0 auto', padding: 3 }}>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Empty State */}
        {!loading && acceptedMatches.length === 0 && (
          <Box sx={{ textAlign: 'center', padding: 6 }}>
            <PersonIcon sx={{ fontSize: 80, color: '#d1d5db', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No Mentors Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Find a mentor who matches your goals and interests!
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={onFindMentors}
              sx={{ bgcolor: '#D4500A', '&:hover': { bgcolor: '#b8450a' } }}
            >
              Find Mentors
            </Button>
          </Box>
        )}

        {/* Active Mentorships Grid */}
        {!loading && acceptedMatches.length > 0 && (
          <>
            <Box sx={{ maxWidth: 1000, margin: '0 auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Typography variant="h6">
                  {acceptedMatches.length} Active {acceptedMatches.length === 1 ? 'Mentorship' : 'Mentorships'}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {acceptedMatches.map((match: AcceptedMatch) => {
                // Convert Match to CalculatedMatch format for MatchCard
                const calculatedMatch: CalculatedMatch = {
                  profileId: match.mentorProfileId,
                  userId: match.mentorId,
                  userType: 'mentor',
                  matchPercentage: match.matchPercentage,
                  profile: match.mentorProfile!,
                  categoryScores: match.matchDetails ? {
                    technicalInterests: match.matchDetails.technicalInterestsScore || 0,
                    lifeExperiences: match.matchDetails.lifeExperiencesScore || 0,
                    languages: match.matchDetails.languagesScore || 0
                  } : { technicalInterests: 0, lifeExperiences: 0, languages: 0 }
                };

                return (
                  <Grid item xs={12} md={6} key={match.matchId}>
                    <MatchCard
                      match={calculatedMatch}
                      currentUserProfile={match.menteeProfile}
                      matchUserProfile={match.mentorUserProfile}
                      onEndMentorship={() => handleDeleteClick(match)}
                      cardType="mentee-finding-mentor"
                    />
                  </Grid>
                );
              })}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={onFindMentors}
                sx={{ borderColor: '#D4500A', color: '#D4500A' }}
              >
                Find More Mentors
              </Button>
            </Box>
            </Box>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !deleting && setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: '#ef4444' }} />
          End Mentorship with {matchToDelete && getMentorDisplayName(matchToDelete)}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end your mentorship with{' '}
            <strong>{matchToDelete && getMentorDisplayName(matchToDelete)}</strong>
            {matchToDelete && ` (${getMentorSubtitle(matchToDelete)})`}?
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#fef2f2', borderRadius: 1, border: '1px solid #fecaca' }}>
            <Typography variant="body2" color="error" sx={{ fontWeight: 600, mb: 1 }}>
              This will:
            </Typography>
            <Typography variant="body2" color="error">
              • Remove them from your My Mentors list
            </Typography>
            <Typography variant="body2" color="error">
              • Send a notification to your mentor
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
            Cancel - Keep Mentorship
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
      </Box>
      </Box>
    </ContentContainer>
  );
}

export default MyMentors;
