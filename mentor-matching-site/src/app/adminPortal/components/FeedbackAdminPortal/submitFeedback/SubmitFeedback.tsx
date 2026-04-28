import React, { useState } from 'react';
import feedbackService from '../../../../../service/feedbackService'
import './SubmitFeedback.css';
import { Button, Switch, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import authService from "../../../../../service/authService";
import userService from "../../../../../service/userService";

const POSITIVE_REVIEW = 'Positive Review';
const GENERAL_MAX_CHARS = 500;
const REVIEW_MAX_CHARS = 300;

export default function SubmitFeedback() {
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [feedbackTitle, setFeedbackTitle] = useState<string>('');
  const [feedbackContent, setFeedbackContent] = useState<string>('');
  const [attachment, setAttachment] = useState<File | undefined>(undefined);
  const [publicConsent, setPublicConsent] = useState<boolean>(false);
  const [includeProfilePicture, setIncludeProfilePicture] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const isPositiveReview = feedbackType === POSITIVE_REVIEW;
  const maxChars = isPositiveReview ? REVIEW_MAX_CHARS : GENERAL_MAX_CHARS;
  const charsRemaining = maxChars - feedbackContent.length;
  const isNearLimit = charsRemaining <= 50;
  const isAtLimit = charsRemaining <= 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!feedbackTitle.trim() || !feedbackContent.trim() || !feedbackType) {
      alert('Feedback title, content and type cannot be empty.');
      return;
    }

    if (isAtLimit) {
      alert(`Please keep your feedback under ${maxChars} characters.`);
      return;
    }

    const user = await authService.getSignedInUser();

    if (user) {
      const UID = user.uid;
      const userEmail = user.email;

      let snapshotName = '';
      let snapshotPictureUrl = '';
      let snapshotRoleInfo = '';
      let profileImageUrl = '';

      if (isPositiveReview) {
        try {
          const profile = await userService.getUserProfile(UID);
          snapshotName = profile?.contact?.displayName || '';

          if (includeProfilePicture) {
            profileImageUrl = profile?.profilePictureUrl || profile?.imageUrl || '';
            snapshotPictureUrl = profileImageUrl;
          }

          const role = profile?.preferences?.role;
          if (role === 'Mentor') {
            const parts = [profile?.personal?.credentials, profile?.personal?.currentProfession].filter(Boolean);
            snapshotRoleInfo = parts.join(', ');
          } else if (role === 'Mentee') {
            const parts = [profile?.personal?.degreeProgram, profile?.personal?.collegeYear].filter(Boolean);
            snapshotRoleInfo = parts.join(', ');
          } else if (role === 'Both') {
            const parts = [profile?.personal?.credentials, profile?.personal?.currentProfession].filter(Boolean);
            snapshotRoleInfo = parts.join(', ');
          }
        } catch (error) {
          console.error('Error fetching profile for snapshot:', error);
        }
      }

      const feedbackData = {
        UID,
        userEmail,
        feedbackType,
        feedbackTitle,
        feedbackContent,
        isResolved: false,
        publicConsent: isPositiveReview ? publicConsent : false,
        includeProfilePicture: isPositiveReview ? includeProfilePicture : false,
        postedOnHomePage: false,
        snapshotName,
        snapshotPictureUrl,
        snapshotRoleInfo,
      };

      try {
        await feedbackService.submitFeedback(feedbackData, attachment, profileImageUrl);
        setFeedbackType('');
        setFeedbackTitle('');
        setFeedbackContent('');
        setAttachment(undefined);
        setPublicConsent(false);
        setIncludeProfilePicture(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('An error occurred while submitting feedback.');
      }
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setAttachment(file);
    } else {
      setAttachment(undefined);
    }
  };

  return (
    <div className="feedback-profile">

      {submitted && (
        <p style={{ color: '#2e7d32', fontWeight: 600, margin: '0' }}>
          Thank you for your feedback!
        </p>
      )}

      <form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <div className='feedback-form-fields'>

          {/* Feedback Title — plain HTML input, 270px */}
          <div className="feedback-input-wrapper">
            <label className="feedback-field-label">
              Feedback Title *
            </label>
            <input
              className="feedback-input"
              type="text"
              value={feedbackTitle}
              onChange={(e) => setFeedbackTitle(e.target.value)}
              required
            />
          </div>

          {/* Feedback Type — MUI Select, 200px */}
          <div className="feedback-type-wrapper">
            <FormControl sx={{ width: '200px' }} required>
              <InputLabel>Feedback Type</InputLabel>
              <Select
                value={feedbackType}
                label="Feedback Type"
                onChange={(e) => {
                  setFeedbackType(e.target.value);
                  setFeedbackContent('');
                  setPublicConsent(false);
                  setIncludeProfilePicture(false);
                }}
              >
                <MenuItem value="Site Improvements">Site Improvements</MenuItem>
                <MenuItem value="Questions about Policy">Questions about Policy</MenuItem>
                <MenuItem value="General">General</MenuItem>
                <MenuItem value={POSITIVE_REVIEW}>Positive Review</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Feedback Content — plain textarea, 500px */}
          <div className="feedback-textarea-wrapper">
            <label className="feedback-field-label">
              {isPositiveReview
                ? 'Your Review — tell us what you loved!'
                : 'Feedback Content *'}
            </label>
            <textarea
              className="feedback-textarea"
              value={feedbackContent}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) {
                  setFeedbackContent(e.target.value);
                }
              }}
              required
              rows={8}
            />
            {feedbackType && (
              <p className="feedback-char-count" style={{
                color: isAtLimit ? '#d32f2f' : isNearLimit ? '#ed6c02' : '#666'
              }}>
                {feedbackContent.length} / {maxChars} characters
              </p>
            )}
          </div>

          {/* Positive Review consent section */}
          {isPositiveReview && (
            <div className="positive-review-consent">
              <p className="consent-intro">
                Your experience could inspire someone else's journey. Here's how you can share it:
              </p>
              <FormControlLabel
                control={
                  <Switch
                    checked={publicConsent}
                    onChange={(e) => {
                      setPublicConsent(e.target.checked);
                      if (!e.target.checked) setIncludeProfilePicture(false);
                    }}
                    color="warning"
                  />
                }
                label="I give permission for this review to be displayed publicly on the site"
              />
              {publicConsent && (
                <>
                  <p className="consent-notice">
                    Your display name and role information will be shown with your review.
                  </p>
                  <div className="profile-pic-invite">
                    <span className="profile-pic-invite-icon">🌟</span>
                    <div>
                      <p className="profile-pic-invite-heading">
                        Profiles with photos get noticed!
                      </p>
                      <p className="profile-pic-invite-sub">
                        Would you like to include your profile picture with your review?
                      </p>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={includeProfilePicture}
                            onChange={(e) => setIncludeProfilePicture(e.target.checked)}
                            color="warning"
                          />
                        }
                        label="Yes, include my profile picture!"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Attachment upload */}
          <input type="file" onChange={handleAttachmentChange} />

        </div>

        <div className='feedback-interest'>
          <Button type="submit" disabled={isAtLimit}>Submit Feedback</Button>
        </div>

      </form>
    </div>
  );
}
