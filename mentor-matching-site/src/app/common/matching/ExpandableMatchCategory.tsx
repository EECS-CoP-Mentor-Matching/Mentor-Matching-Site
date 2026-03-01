import { useState } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon, 
  CheckCircle, 
  Cancel,
  WorkOutline,
  Favorite,
  Language
} from '@mui/icons-material';

interface ExpandableMatchCategoryProps {
  categoryName: string;
  score: number;
  userItems: string[];
  matchItems: string[];
  matchProfile?: any;
  defaultExpanded?: boolean;
  icon?: React.ReactNode; // Add icon prop
}

function ExpandableMatchCategory({
  categoryName,
  score,
  userItems,
  matchItems,
  matchProfile,
  icon,
  defaultExpanded = false
}: ExpandableMatchCategoryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Calculate overlaps and misses
  const matchSet = new Set(matchItems.map(i => i.toLowerCase().trim()));
  
  const overlaps = userItems.filter(item => matchSet.has(item.toLowerCase().trim()));
  const missing = userItems.filter(item => !matchSet.has(item.toLowerCase().trim()));

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#22c55e'; // green
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  // Check if this item is "Racial Minority" to show the specific race
  const getDisplayText = (item: string): string => {
    if (item === 'Racial Minority' && matchProfile?.racialIdentity && matchProfile.racialIdentity !== 'Prefer not to specify') {
      return `${item} → ${matchProfile.racialIdentity}`;
    }
    return item;
  };

  return (
    <Box sx={{ mb: 1 }}>
      {/* Category Header - Clickable */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: 1,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: '#f9fafb'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
            {categoryName}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: getScoreColor(score),
              minWidth: '40px',
              textAlign: 'right'
            }}
          >
            {Math.round(score)}%
          </Typography>
          <IconButton
            size="small"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Expanded Details */}
      <Collapse in={expanded}>
        <Box sx={{ pl: 3, pr: 2, pt: 1, pb: 1 }}>
          {/* Overlaps (Green checkmarks) */}
          {overlaps.length > 0 && (
            <Box sx={{ mb: 1 }}>
              {overlaps.map((item, index) => (
                <Box
                  key={`overlap-${index}`}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                >
                  <CheckCircle sx={{ fontSize: 16, color: '#22c55e' }} />
                  <Typography variant="body2" sx={{ color: '#374151' }}>
                    {getDisplayText(item)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Missing Items (What you want but they don't have) */}
          {missing.length > 0 && (
            <Box>
              {missing.map((item, index) => (
                <Box
                  key={`missing-${index}`}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                >
                  <Cancel sx={{ fontSize: 16, color: '#ef4444' }} />
                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                    {item} <span style={{ fontSize: '11px' }}>(you want, they don't have)</span>
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* If no items to show */}
          {overlaps.length === 0 && missing.length === 0 && (
            <Typography variant="caption" color="text.secondary">
              No specific preferences selected
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

export default ExpandableMatchCategory;
