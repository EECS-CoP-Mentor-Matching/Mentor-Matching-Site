import { useState, useEffect } from 'react';
import {
  Box, CircularProgress, Alert, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Typography, Button
} from '@mui/material';
import {
  Person as PersonIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAppSelector } from '../../../redux/hooks';
import matchDbService, { Match } from '../../../service/matchDbService';
import menteeService from '../../../service/menteeService';
import { mentorService } from '../../../service/mentorService';
import userService from '../../../service/userService';
import { MatchProfile, CalculatedMatch } from '../../../types/matchProfile';
import { UserProfile } from '../../../types/userProfile';
import ContentContainer from '../../common/ContentContainer';
import MatchCard from '../../common/forms/MatchCard';
import '../../common/forms/MatchCard.css';

interface AcceptedMatch extends Match {
  menteeProfile?: MatchProfile;
  menteeUserProfile?: UserProfile;
  mentorProfile?: MatchProfile;
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

            // Get mentor's match profile for comparison in dropdowns
            let mentorProfile: MatchProfile | undefined;
            try {
              const db = getFirestore();
              const mentorProfileDoc = await getDoc(doc(db, 'mentorProfile', match.mentorProfileId));
              if (mentorProfileDoc.exists()) {
                mentorProfile = mentorProfileDoc.data() as MatchProfile;
              }
            } catch (err) {
              console.log('Could not load mentor profile');
            }

            return { ...match, menteeProfile: menteeProfile?.data, menteeUserProfile, mentorProfile };
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
      <Box sx={{ 
        bgcolor: '#fafafa',
        minHeight: '100vh',
        py: 3
      }}>
        <Box sx={{ maxWidth: 1400, margin: '0 auto', padding: 3 }}>

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
                // Convert Match to CalculatedMatch format for MatchCard
                const calculatedMatch: CalculatedMatch = {
                  profileId: match.menteeProfileId,
                  userId: match.menteeId,
                  userType: 'mentee',
                  matchPercentage: match.matchPercentage,
                  profile: match.menteeProfile!,
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
                      currentUserProfile={match.mentorProfile}
                      matchUserProfile={match.menteeUserProfile}
                      onEndMentorship={() => handleDeleteClick(match)}
                      cardType="mentor-reviewing-mentee"
                    />
                  </Grid>
                );
              })}
            </Grid>
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
      </Box>
      </Box>
    </ContentContainer>
  );
}

export default MyMentees;
