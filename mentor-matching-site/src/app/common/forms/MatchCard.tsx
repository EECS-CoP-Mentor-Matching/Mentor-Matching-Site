/**
 * MATCH CARD COMPONENT
 * 
 * Displays a potential match with percentage score and breakdown
 */

import React, { useState } from 'react';
import { CalculatedMatch } from '../../../types/matchProfile';
import './MatchCard.css';

interface MatchCardProps {
  match: CalculatedMatch;
  onConnect?: () => void;
  onViewProfile?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onConnect, onViewProfile }) => {
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
    return 'Low Match';
  };

  const profile = match.profile;
  const matchColor = getMatchColor(match.matchPercentage);

  return (
    <div className="match-card">
      {/* Match Percentage Badge */}
      <div className="match-header">
        <div 
          className="match-percentage" 
          style={{ backgroundColor: matchColor }}
        >
          <span className="percentage-value">{Math.round(match.matchPercentage)}%</span>
          <span className="percentage-label">{getMatchLabel(match.matchPercentage)}</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="match-profile">
        <h4 className="profile-name">
          {profile.introduction?.split('\n')[0] || 'Anonymous User'}
        </h4>
        
        {/* Career Fields */}
        {profile.careerFields && profile.careerFields.length > 0 && (
          <div className="profile-field">
            <span className="field-label">Career Fields:</span>
            <div className="field-tags">
              {profile.careerFields.map((field, index) => (
                <span key={index} className="tag">{field}</span>
              ))}
            </div>
          </div>
        )}

        {/* Mentorship Goal (if public) */}
        {profile.mentorshipGoal && (
          <div className="profile-field">
            <span className="field-label">Goal:</span>
            <span className="field-value">{profile.mentorshipGoal}</span>
          </div>
        )}

        {/* Introduction */}
        {profile.introduction && (
          <div className="profile-intro">
            <p>{profile.introduction}</p>
          </div>
        )}
      </div>

      {/* Match Breakdown Toggle */}
      <button 
        className="breakdown-toggle"
        onClick={() => setShowBreakdown(!showBreakdown)}
        type="button"
      >
        {showBreakdown ? '▼' : '►'} See Match Breakdown
      </button>

      {/* Match Breakdown */}
      {showBreakdown && (
        <div className="match-breakdown">
          <h5>Match Details</h5>
          
          <div className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-label">Technical Interests</span>
              <span className="breakdown-score">{Math.round(match.categoryScores.technicalInterests)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${match.categoryScores.technicalInterests}%`,
                  backgroundColor: matchColor 
                }}
              />
            </div>
            {profile.technicalInterests && profile.technicalInterests.length > 0 && (
              <div className="breakdown-details">
                {profile.technicalInterests.slice(0, 3).join(', ')}
                {profile.technicalInterests.length > 3 && ` +${profile.technicalInterests.length - 3} more`}
              </div>
            )}
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-label">Life Experiences</span>
              <span className="breakdown-score">{Math.round(match.categoryScores.lifeExperiences)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${match.categoryScores.lifeExperiences}%`,
                  backgroundColor: matchColor 
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-label">Languages</span>
              <span className="breakdown-score">{Math.round(match.categoryScores.languages)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${match.categoryScores.languages}%`,
                  backgroundColor: matchColor 
                }}
              />
            </div>
            {profile.languages && profile.languages.length > 0 && (
              <div className="breakdown-details">
                {profile.languages.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="match-actions">
        {onViewProfile && (
          <button 
            className="btn-secondary"
            onClick={onViewProfile}
            type="button"
          >
            View Full Profile
          </button>
        )}
        {onConnect && (
          <button 
            className="btn-primary"
            onClick={onConnect}
            type="button"
          >
            Send Message
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
