/**
 * ENHANCED MATCH CARD COMPONENT
 * 
 * Displays a potential match with prominent percentage score and detailed breakdown
 */

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Chip, 
  LinearProgress,
  Collapse,
  Button,
  Divider,
  Avatar
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { CalculatedMatch } from '../../../types/matchProfile';

interface MatchCardProps {
  match: CalculatedMatch;
  onConnect?: () => void;
  onViewProfile?: () => void;
  isConnected?: boolean;
  matchStatus?: 'pending' | 'accepted' | 'declined' | null;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onConnect, onViewProfile, isConnected = false, matchStatus = null }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getMatchColor = (percentage: number): string => {
    if (percentage >= 80) return '#22c55e'; // Green
    if (percentage >= 60) return '#3b82f6'; // Blue
    if (percentage >= 40) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getMatchLabel = (percentage: number): string => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Potential Match';
  };

  const profile = match.profile;
  const matchColor = getMatchColor(match.matchPercentage);
  const matchPercent = Math.round(match.matchPercentage);

  return (
    <Card 
      sx={{ 
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        },
        border: `2px solid ${matchColor}20`
      }}
    >
      <CardContent>
        {/* Header with Prominent Match Percentage */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: matchColor, width: 56, height: 56 }}>
              <PersonIcon />
            </Avatar>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {profile.introduction?.split('\n')[0] || 'Potential Match'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.careerFields?.[0] || 'Various Fields'}
              </Typography>
            </Box>
          </Box>

          {/* Large Percentage Display */}
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: `${matchColor}15`,
              borderRadius: 2,
              padding: 2,
              minWidth: 100
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  color: matchColor,
                  lineHeight: 1
                }}
              >
                {matchPercent}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: matchColor 
                }}
              >
                %
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600,
                color: matchColor,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              {getMatchLabel(match.matchPercentage)}
            </Typography>
            {matchPercent >= 80 && (
              <TrophyIcon sx={{ color: matchColor, fontSize: 20, mt: 0.5 }} />
            )}
          </Box>
        </Box>

        {/* Career Fields */}
        {profile.careerFields && profile.careerFields.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {profile.careerFields.map((field, index) => (
                <Chip 
                  key={index} 
                  label={field} 
                  size="small"
                  sx={{ bgcolor: '#e3f2fd', color: '#0066cc' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Technical Interests Preview */}
        {profile.technicalInterests && profile.technicalInterests.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <strong>Interests:</strong>
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {profile.technicalInterests.slice(0, 5).map((interest, index) => (
                <Chip 
                  key={index} 
                  label={interest} 
                  size="small"
                  variant="outlined"
                />
              ))}
              {profile.technicalInterests.length > 5 && (
                <Chip 
                  label={`+${profile.technicalInterests.length - 5} more`} 
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}

        {/* Mentorship Goal */}
        {profile.mentorshipGoal && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Goal:</strong> {profile.mentorshipGoal}
            </Typography>
          </Box>
        )}

        {/* Introduction */}
        {profile.introduction && profile.introduction.trim() && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              "{profile.introduction}"
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Match Breakdown Toggle */}
        <Button
          fullWidth
          onClick={() => setShowBreakdown(!showBreakdown)}
          endIcon={<ExpandMoreIcon sx={{ transform: showBreakdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />}
          sx={{ mb: showBreakdown ? 2 : 0 }}
        >
          {showBreakdown ? 'Hide' : 'Show'} Match Breakdown
        </Button>

        {/* Match Breakdown */}
        <Collapse in={showBreakdown}>
          <Box sx={{ bgcolor: '#fafafa', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Category Scores
            </Typography>

            {/* Career & Technical Interests */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Career & Technical Interests</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: matchColor }}>
                  {Math.round(match.categoryScores.technicalInterests)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={match.categoryScores.technicalInterests}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: matchColor,
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            {/* Life Experiences */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Life Experiences</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: matchColor }}>
                  {Math.round(match.categoryScores.lifeExperiences)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={match.categoryScores.lifeExperiences}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: matchColor,
                    borderRadius: 4
                  }
                }}
              />
              {profile.lifeExperiences && profile.lifeExperiences.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {profile.lifeExperiences.join(', ')}
                </Typography>
              )}
            </Box>

            {/* Languages */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Languages</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: matchColor }}>
                  {Math.round(match.categoryScores.languages)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={match.categoryScores.languages}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: matchColor,
                    borderRadius: 4
                  }
                }}
              />
              {profile.languages && profile.languages.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {profile.languages.join(', ')}
                </Typography>
              )}
            </Box>
          </Box>
        </Collapse>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {onViewProfile && (
            <Button 
              variant="outlined" 
              fullWidth
              onClick={onViewProfile}
            >
              View Profile
            </Button>
          )}
          {onConnect && (
            <Button 
              variant="contained" 
              fullWidth
              onClick={onConnect}
              disabled={isConnected}
              sx={{
                bgcolor: matchStatus === 'accepted' ? '#22c55e !important'
                       : matchStatus === 'declined' ? '#ef4444 !important'
                       : isConnected ? '#9ca3af' 
                       : matchColor,
                color: 'white !important',
                '&:hover': {
                  bgcolor: matchStatus === 'accepted' ? '#22c55e !important'
                         : matchStatus === 'declined' ? '#ef4444 !important'
                         : isConnected ? '#9ca3af' 
                         : matchColor,
                  filter: isConnected ? 'none' : 'brightness(0.9)'
                },
                '&.Mui-disabled': {
                  bgcolor: matchStatus === 'accepted' ? '#22c55e !important'
                         : matchStatus === 'declined' ? '#ef4444 !important'
                         : '#9ca3af',
                  color: 'white !important'
                }
              }}
            >
              {matchStatus === 'accepted' ? '✓ Match Accepted!' 
             : matchStatus === 'declined' ? '✗ Declined'
             : isConnected ? '⏳ Request Pending...' 
             : 'Connect'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
