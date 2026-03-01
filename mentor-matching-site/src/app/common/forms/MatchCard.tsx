/**
 * MATCH CARD COMPONENT - REDESIGNED
 * * Layout:
 * 1. Connect/Accept buttons (top-left, orange pill)
 * 2. Avatar (extra large, 150px, centered)
 * 3. Name & Student info (centered)
 * 4. "How You Match" Section (High-contrast grey block per wireframe)
 */

import React from 'react';
import './MatchCard.css'; // Ensure this CSS is applied
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Chip, 
  Button,
  Divider,
  Avatar
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  AccessTime,
  Public,
  School,
  WorkOutline,
  Favorite,
  Language
} from '@mui/icons-material';
import { CalculatedMatch } from '../../../types/matchProfile';
import { UserProfile } from '../../../types/userProfile';
import ExpandableMatchCategory from '../../common/matching/ExpandableMatchCategory';

interface MatchCardProps {
  match: CalculatedMatch;
  currentUserProfile?: any; 
  matchUserProfile?: UserProfile; 
  onConnect?: () => void;
  onAccept?: (event: React.MouseEvent<HTMLElement>) => void;
  onDecline?: (event: React.MouseEvent<HTMLElement>) => void;
  isConnected?: boolean;
  matchStatus?: 'pending' | 'accepted' | 'declined' | null;
  cardType?: 'mentee-finding-mentor' | 'mentor-reviewing-mentee';
}

export const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  currentUserProfile,
  matchUserProfile,
  onConnect, 
  onAccept,
  onDecline,
  isConnected = false, 
  matchStatus = null,
  cardType = 'mentee-finding-mentor'
}) => {

  const [showOverlay, setShowOverlay] = React.useState(false);

  const getDisplayName = (): string => {
    if (matchUserProfile?.contact?.displayName) return matchUserProfile.contact.displayName;
    if (matchUserProfile?.personal?.firstName) {
      const firstName = matchUserProfile.personal.firstName;
      const lastName = matchUserProfile.personal.lastName || '';
      return `${firstName} ${lastName}`.trim();
    }
    return 'User'; // Fallback if no name data
  };

  const getUsername = (): string => {
    const displayName = matchUserProfile?.contact?.displayName || '';
    return displayName ? `@${displayName.replace(/\s+/g, '').toLowerCase()}` : '';
  };

  const getInitials = (): string => {
    const name = getDisplayName();
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const profile = match.profile;
  const matchPercent = Math.round(match.matchPercentage);

  return (
    <Card className="match-card" elevation={0}>
      <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* 1. Action Buttons - Top Left per wireframe requirements */}
        <Box className="action-button-container">
          {cardType === 'mentor-reviewing-mentee' && onAccept && onDecline ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button className="btn-decline" size="small" onClick={onDecline}>Decline</Button>
              <Button className="btn-accept" size="small" onClick={onAccept}>Accept</Button>
            </Box>
          ) : onConnect && (
            <Button
              className="btn-connect-pill"
              size="small"
              onClick={onConnect}
              disabled={isConnected}
            >
              {matchStatus === 'accepted' ? '✓ Connected' 
               : matchStatus === 'declined' ? '✗ Declined'
               : isConnected ? 'Sent' 
               : 'Connect'}
            </Button>
          )}
        </Box>

        {/* 2. Top Profile Section (Centered & Large Image) */}
        <Box className="profile-top-section">
          <Box 
            sx={{ 
              position: 'relative', 
              width: 150, 
              height: 150, 
              margin: '0 auto 12px auto',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setShowOverlay(true)}
            onMouseLeave={() => setShowOverlay(false)}
          >
            <Avatar
              src={matchUserProfile?.imageUrl}
              className="match-avatar-huge"
              sx={{
                transition: 'opacity 0.3s',
                opacity: showOverlay ? 0.3 : 1
              }}
            >
              {getInitials()}
            </Avatar>
            
            {/* Hover Overlay - Show Elevator Pitch */}
            {showOverlay && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                  pointerEvents: 'none'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#111827',
                    fontWeight: 600,
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    lineHeight: 1.2
                  }}
                >
                  {profile.aboutMe || profile.mentorshipGoal || 'Ready to connect!'}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography className="profile-name-centered">
            {getDisplayName()}
          </Typography>

          {/* Timezone & Availability */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Public sx={{ fontSize: 16, color: '#6b7280' }} />
              <Typography variant="caption" color="text.secondary">
                {matchUserProfile?.contact?.timeZone || 'PST'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 16, color: '#6b7280' }} />
              <Typography variant="caption" color="text.secondary">
                {matchUserProfile?.availability?.hoursPerWeek || '0-2 hours per week'} hrs/wk
              </Typography>
            </Box>
          </Box>

          {/* Student Info */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 1 }}>
            {profile.isStudent && (
              <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                {profile.collegeYear || 'Student'} • {profile.careerFields?.[0]}
              </Typography>
            )}
          </Box>
        </Box>

        {/* 3. Match Data Block (Wireframe Grayscale Section) */}
        <Box className="match-data-block">
          <Box className="match-score-row">
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                How You Match
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Overall Match
              </Typography>
              <Typography className="score-large-orange">
                {matchPercent}%
              </Typography>
            </Box>
          </Box>

          {/* Detailed Categories */}
          <Box sx={{ mt: 1 }}>
            {/* Technical Interests - combine career fields + technical interests */}
            <ExpandableMatchCategory
              categoryName="Technical Interests"
              icon={<WorkOutline sx={{ fontSize: 16, color: '#6b7280' }} />}
              score={match.categoryScores?.technicalInterests || 0}
              userItems={[
                ...(currentUserProfile?.careerFields || []),
                ...(currentUserProfile?.technicalInterests || [])
              ]}
              matchItems={[
                ...(profile.careerFields || []),
                ...(profile.technicalInterests || [])
              ]}
            />
            
            {/* Life Experiences - pass matchProfile for racial identity lookup */}
            <ExpandableMatchCategory
              categoryName="Life Experiences"
              icon={<Favorite sx={{ fontSize: 16, color: '#6b7280' }} />}
              score={match.categoryScores?.lifeExperiences || 0}
              userItems={currentUserProfile?.lifeExperiences || []}
              matchItems={profile.lifeExperiences || []}
              matchProfile={profile}
            />
            
            {/* Languages */}
            <ExpandableMatchCategory
              categoryName="Languages"
              icon={<Language sx={{ fontSize: 16, color: '#6b7280' }} />}
              score={match.categoryScores?.languages || 0}
              userItems={currentUserProfile?.languages || []}
              matchItems={profile.languages || []}
            />
          </Box>
        </Box>

        {/* 4. Elevator Pitch / Goal (Bottom Footer) */}
        <Box className="profile-intro">
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#4b5563' }}>
            "{profile.mentorshipGoal || profile.aboutMe || "Ready to connect!"}"
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );
};

export default MatchCard;