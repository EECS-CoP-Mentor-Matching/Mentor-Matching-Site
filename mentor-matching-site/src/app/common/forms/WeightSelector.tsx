/**
 * WEIGHT SELECTOR COMPONENT
 * 
 * Allows users to set weights (1-5) for different matching criteria
 */

import React, { useState } from 'react';
import { UserWeights } from '../../../types/matchProfile';
import { WEIGHT_PRIORITY_OPTIONS, WeightPriorityOption, getDefaultWeights } from '../../../config/matchingConfig';
import './WeightSelector.css';

interface WeightSelectorProps {
  weights: UserWeights;
  onChange: (weights: UserWeights) => void;
  disableLifeExperiences?: boolean;
}

export const WeightSelector: React.FC<WeightSelectorProps> = ({ 
  weights, 
  onChange, 
  disableLifeExperiences = false 
}) => {
  const [selectedPriority, setSelectedPriority] = useState<string>('');

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
    const defaultWeights = getDefaultWeights(priority);
    onChange(defaultWeights);
  };

  const handleWeightChange = (field: keyof UserWeights, value: number) => {
    onChange({
      ...weights,
      [field]: value
    });
    // Clear priority selection when manually adjusting
    setSelectedPriority('');
  };

  const getWeightLabel = (value: number): string => {
    switch (value) {
      case 0: return 'Not Used for Matching';
      case 1: return 'Not Important';
      case 2: return 'Slightly Important';
      case 3: return 'Moderately Important';
      case 4: return 'Very Important';
      case 5: return 'Extremely Important';
      default: return '';
    }
  };

  return (
    <div className="weight-selector">
      <h3>Matching Preferences</h3>
      <p className="description">
        Tell us what's most important to you when matching with others
      </p>

      {/* Quick Priority Selection */}
      <div className="priority-section">
        <label className="section-label">Quick Select (Optional):</label>
        <div className="priority-options">
          {WEIGHT_PRIORITY_OPTIONS.map((option: WeightPriorityOption) => (
            <button
              key={option.value}
              className={`priority-button ${selectedPriority === option.value ? 'selected' : ''}`}
              onClick={() => handlePriorityChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divider">
        <span>OR customize your preferences</span>
      </div>

      {/* Individual Weight Sliders */}
      <div className="weight-sliders">
        {/* Career & Technical Interests */}
        <div className="weight-item">
          <label htmlFor="technical-weight" className="weight-label">
            <span className="label-text">Career & Technical Interests</span>
            <span className="weight-value">{getWeightLabel(weights.technicalInterests)}</span>
          </label>
          <input
            id="technical-weight"
            type="range"
            min="1"
            max="5"
            value={weights.technicalInterests}
            onChange={(e) => handleWeightChange('technicalInterests', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-labels">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        {/* Life Experiences */}
        <div className={`weight-item ${disableLifeExperiences ? 'disabled' : ''}`}>
          <label htmlFor="life-weight" className="weight-label">
            <span className="label-text">Life Experiences</span>
            <span className="weight-value">
              {disableLifeExperiences ? 'Not Used for Matching' : getWeightLabel(weights.lifeExperiences)}
            </span>
          </label>
          <input
            id="life-weight"
            type="range"
            min="1"
            max="5"
            value={disableLifeExperiences ? 0 : weights.lifeExperiences}
            onChange={(e) => handleWeightChange('lifeExperiences', parseInt(e.target.value))}
            className="weight-slider"
            disabled={disableLifeExperiences}
          />
          <div className="slider-labels">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
          {disableLifeExperiences && (
            <p className="disabled-message">You've chosen not to share life experiences</p>
          )}
        </div>

        {/* Languages */}
        <div className="weight-item">
          <label htmlFor="language-weight" className="weight-label">
            <span className="label-text">Languages</span>
            <span className="weight-value">{getWeightLabel(weights.languages)}</span>
          </label>
          <input
            id="language-weight"
            type="range"
            min="1"
            max="5"
            value={weights.languages}
            onChange={(e) => handleWeightChange('languages', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-labels">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      </div>

      {/* Weight Summary */}
      <div className="weight-summary">
        <p className="summary-text">
          Your matching will prioritize:{' '}
          {weights.technicalInterests >= 4 && <strong>Career & Technical Interests </strong>}
          {weights.lifeExperiences >= 4 && <strong>Life Experiences </strong>}
          {weights.languages >= 4 && <strong>Languages</strong>}
        </p>
      </div>
    </div>
  );
};

export default WeightSelector;
