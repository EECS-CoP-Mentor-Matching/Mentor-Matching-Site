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

const TestingPanel: React.FC = () => {
  const navigate = useNavigate();
  const [openInvite, setOpenInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendTestInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteResult(null);
    try {
      await preAuthorizeUser({ email: inviteEmail.trim(), isTester: true });
      setInviteResult({ success: true, message: `Test invite sent to ${inviteEmail}. Once they complete profile setup, a dummy mentee and match will be created automatically.` });
      setInviteEmail('');
    } catch (error: any) {
      setInviteResult({ success: false, message: error?.message ?? 'Failed to send invite. Please try again.' });
    } finally {
      setInviting(false);
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

      {/* Test Mentor Invite */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
          Test Mentor Invite
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Send an invite to a mentor tester. Once they complete their profile setup, a dummy mentee and match will be automatically created so they can test the full mentorship experience.
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => { setOpenInvite(true); setInviteResult(null); setInviteEmail(''); }}
          sx={{ backgroundColor: '#DC4405', '&:hover': { backgroundColor: '#b83804' } }}
        >
          Invite Test Mentor
        </Button>
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
      {/* Test Mentor Invite Dialog */}
      <Dialog open={openInvite} onClose={() => setOpenInvite(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Test Mentor</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the mentor's email address. They will receive the standard invite email.
            Once they complete their profile setup, a dummy mentee and active match will be
            created automatically so they can test the mentorship experience.
          </DialogContentText>
          {inviteResult && (
            <Alert severity={inviteResult.success ? 'success' : 'error'} sx={{ mb: 2 }} onClose={() => setInviteResult(null)}>
              {inviteResult.message}
            </Alert>
          )}
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendTestInvite(); }}
            disabled={inviting}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInvite(false)}>Close</Button>
          <Button
            onClick={handleSendTestInvite}
            variant="contained"
            disabled={inviting || !inviteEmail.trim()}
            startIcon={inviting ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}
            sx={{ backgroundColor: '#DC4405', '&:hover': { backgroundColor: '#b83804' } }}
          >
            {inviting ? 'Sending…' : 'Send Test Invite'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default TestingPanel;
