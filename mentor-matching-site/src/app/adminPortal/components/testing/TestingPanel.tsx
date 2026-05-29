/**
 * TESTING PANEL FOR ADMIN PORTAL
 * 
 * Provides quick access to test pages for database and matching algorithm
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { 
  Storage as StorageIcon,
  Functions as FunctionsIcon,
  Info as InfoIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';

const preAuthorizeUser = httpsCallable(getFunctions(), 'preAuthorizeUser');
const removeAllTesters = httpsCallable(getFunctions(), 'removeAllTesters');

const TestingPanel: React.FC = () => {
  const navigate = useNavigate();

  // Mentor invite state
  const [openMentorInvite, setOpenMentorInvite] = useState(false);
  const [mentorInviteEmail, setMentorInviteEmail] = useState('');
  const [mentorInviting, setMentorInviting] = useState(false);
  const [mentorInviteResult, setMentorInviteResult] = useState<{ success: boolean; message: string } | null>(null);

  // Mentee invite state
  const [openMenteeInvite, setOpenMenteeInvite] = useState(false);
  const [menteeInviteEmail, setMenteeInviteEmail] = useState('');
  const [menteeInviting, setMenteeInviting] = useState(false);
  const [menteeInviteResult, setMenteeInviteResult] = useState<{ success: boolean; message: string } | null>(null);

  // Remove testers state
  const [openRemoveTesters, setOpenRemoveTesters] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeResult, setRemoveResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendMentorInvite = async () => {
    if (!mentorInviteEmail.trim()) return;
    setMentorInviting(true);
    setMentorInviteResult(null);
    try {
      await preAuthorizeUser({ email: mentorInviteEmail.trim(), isTester: true });
      setMentorInviteResult({ success: true, message: `Test mentor invite sent to ${mentorInviteEmail}.` });
      setMentorInviteEmail('');
    } catch (error: any) {
      setMentorInviteResult({ success: false, message: error?.message ?? 'Failed to send invite. Please try again.' });
    } finally {
      setMentorInviting(false);
    }
  };

  const handleSendMenteeInvite = async () => {
    if (!menteeInviteEmail.trim()) return;
    setMenteeInviting(true);
    setMenteeInviteResult(null);
    try {
      await preAuthorizeUser({ email: menteeInviteEmail.trim(), isTester: true, isTestMentee: true });
      setMenteeInviteResult({ success: true, message: `Test mentee invite sent to ${menteeInviteEmail}.` });
      setMenteeInviteEmail('');
    } catch (error: any) {
      setMenteeInviteResult({ success: false, message: error?.message ?? 'Failed to send invite. Please try again.' });
    } finally {
      setMenteeInviting(false);
    }
  };

  const handleRemoveAllTesters = async () => {
    setRemoving(true);
    setRemoveResult(null);
    try {
      const result: any = await removeAllTesters({});
      setRemoveResult({ success: true, message: `Successfully removed ${result.data.removed} tester account(s) and all associated data.` });
    } catch (error: any) {
      setRemoveResult({ success: false, message: error?.message ?? 'Failed to remove testers. Please try again.' });
    } finally {
      setRemoving(false);
      setOpenRemoveTesters(false);
    }
  };

  const testPages = [
    {
      title: 'Database Tests',
      description: 'Test match database CRUD operations: create matches, retrieve by ID, update status, and query by user.',
      icon: <StorageIcon sx={{ fontSize: 40, color: '#0066cc' }} />,
      path: '/test-db',
      color: '#e3f2fd'
    },
    {
      title: 'Matching Algorithm Tests',
      description: 'Test the weighted matching algorithm: calculate match scores, test weight effects, and find potential matches.',
      icon: <FunctionsIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      path: '/test-matching',
      color: '#fff3e0'
    }
  ];

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333', marginBottom: 3 }}>
        Testing Dashboard
      </Typography>

      <Alert severity="info" sx={{ marginBottom: 4 }}>
        <Typography variant="body2">
          <strong>Note:</strong> These test pages allow you to verify the matching system functionality. 
          As matching profile questions become editable by admins, these tests will be essential for validation.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {testPages.map((page, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, backgroundColor: page.color }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                  {page.icon}
                  <Typography variant="h5" sx={{ marginLeft: 2, fontWeight: 600 }}>
                    {page.title}
                  </Typography>
                </Box>
                
                <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 3 }}>
                  {page.description}
                </Typography>

                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate(page.path)}
                  sx={{
                    backgroundColor: '#0066cc',
                    '&:hover': {
                      backgroundColor: '#0052a3'
                    }
                  }}
                >
                  Open Test Page
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ marginY: 4 }} />

      {/* Tester Invites */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
          Tester Invites
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Send test invites to mentors or mentees. They will receive a customized onboarding email with instructions for testing the platform.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => { setOpenMentorInvite(true); setMentorInviteResult(null); setMentorInviteEmail(''); }}
            sx={{ backgroundColor: '#DC4405', '&:hover': { backgroundColor: '#b83804' } }}
          >
            Invite Test Mentor
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => { setOpenMenteeInvite(true); setMenteeInviteResult(null); setMenteeInviteEmail(''); }}
            sx={{ backgroundColor: '#DC4405', '&:hover': { backgroundColor: '#b83804' } }}
          >
            Invite Test Mentee
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => { setOpenRemoveTesters(true); setRemoveResult(null); }}
          >
            Remove All Testers
          </Button>
        </Box>
        {removeResult && (
          <Alert severity={removeResult.success ? 'success' : 'error'} sx={{ mt: 2 }} onClose={() => setRemoveResult(null)}>
            {removeResult.message}
          </Alert>
        )}
      </Box>

      <Box sx={{ backgroundColor: '#f5f5f5', padding: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoIcon sx={{ marginRight: 1, color: '#0066cc' }} />
          Testing Information
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>Database Tests:</strong> Verify that the matches collection can store and retrieve match records properly.
          Tests include creating matches, querying by user, updating match status, and checking timestamps.
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>Matching Algorithm Tests:</strong> Validate the weighted matching calculations. Tests show how different
          weight combinations affect match percentages and demonstrate finding the best mentor-mentee pairings.
        </Typography>

        <Typography variant="body2" sx={{ marginTop: 2, fontStyle: 'italic' }}>
          💡 <strong>Tip:</strong> Run these tests after making changes to matching configuration or profile fields
          to ensure everything still works correctly.
        </Typography>
      </Box>
      {/* Invite Test Mentor Dialog */}
      <Dialog open={openMentorInvite} onClose={() => setOpenMentorInvite(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Test Mentor</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the mentor's email address. They will receive a customized onboarding email
            with instructions to check their Pending Requests tab for a test match with Matchy Matcherson.
          </DialogContentText>
          {mentorInviteResult && (
            <Alert severity={mentorInviteResult.success ? 'success' : 'error'} sx={{ mb: 2 }} onClose={() => setMentorInviteResult(null)}>
              {mentorInviteResult.message}
            </Alert>
          )}
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={mentorInviteEmail}
            onChange={(e) => setMentorInviteEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMentorInvite(); }}
            disabled={mentorInviting}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMentorInvite(false)}>Close</Button>
          <Button
            onClick={handleSendMentorInvite}
            variant="contained"
            disabled={mentorInviting || !mentorInviteEmail.trim()}
            startIcon={mentorInviting ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}
            sx={{ backgroundColor: '#DC4405', '&:hover': { backgroundColor: '#b83804' } }}
          >
            {mentorInviting ? 'Sending…' : 'Send Mentor Invite'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite Test Mentee Dialog */}
      <Dialog open={openMenteeInvite} onClose={() => setOpenMenteeInvite(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Test Mentee</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the mentee's email address. They will receive a customized onboarding email
            with instructions to browse the Active Profiles tab and send a match request.
          </DialogContentText>
          {menteeInviteResult && (
            <Alert severity={menteeInviteResult.success ? 'success' : 'error'} sx={{ mb: 2 }} onClose={() => setMenteeInviteResult(null)}>
              {menteeInviteResult.message}
            </Alert>
          )}
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={menteeInviteEmail}
            onChange={(e) => setMenteeInviteEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMenteeInvite(); }}
            disabled={menteeInviting}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMenteeInvite(false)}>Close</Button>
          <Button
            onClick={handleSendMenteeInvite}
            variant="contained"
            disabled={menteeInviting || !menteeInviteEmail.trim()}
            startIcon={menteeInviting ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}
            sx={{ backgroundColor: '#DC4405', '&:hover': { backgroundColor: '#b83804' } }}
          >
            {menteeInviting ? 'Sending…' : 'Send Mentee Invite'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove All Testers Confirmation Dialog */}
      <Dialog open={openRemoveTesters} onClose={() => setOpenRemoveTesters(false)}>
        <DialogTitle>Remove All Testers</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete all tester accounts and their associated data including
            profiles, matches, and messages. This action cannot be undone.
            <br /><br />
            Note: Matchy Matcherson (DemoMentee1) and Marty Mentorson (DemoMentor1) will not be affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveTesters(false)}>Cancel</Button>
          <Button
            onClick={handleRemoveAllTesters}
            color="error"
            variant="contained"
            disabled={removing}
            startIcon={removing ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {removing ? 'Removing…' : 'Remove All Testers'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default TestingPanel;
