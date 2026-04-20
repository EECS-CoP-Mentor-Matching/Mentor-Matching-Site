import React, { useEffect, useState } from 'react';
import feedbackService, { FeedbackData } from '../../../../../service/feedbackService';
import './ViewFeedback.css';

const POSITIVE_REVIEW = 'Positive Review';

export default function ViewFeedback() {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [confirmMessages, setConfirmMessages] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchFeedbackEntries = async () => {
      setIsLoading(true);
      try {
        const response = await feedbackService.fetchFeedbackEntries();
        setFeedbackEntries(response.data);
      } catch (error) {
        console.error('Error fetching feedback entries:', error);
      }
      setIsLoading(false);
    };
    fetchFeedbackEntries();
  }, []);

  const showConfirmMessage = (id: string, message: string) => {
    setConfirmMessages(prev => ({ ...prev, [id]: message }));
    setTimeout(() => {
      setConfirmMessages(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }, 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      await feedbackService.deleteFeedbackEntry(id);
      setFeedbackEntries(prev => prev.filter(e => e.id !== id));
      setDeleteTargetId(null);
    } catch (error) {
      console.error('Failed to delete feedback entry:', error);
    }
  };

  const handleResolve = async (entry: FeedbackData) => {
    if (!entry.id) return;
    try {
      await feedbackService.updateFeedbackEntry(entry.id, { isResolved: true });
      setFeedbackEntries(prev =>
        prev.map(e => e.id === entry.id ? { ...e, isResolved: true } : e)
      );
    } catch (error) {
      console.error('Failed to resolve feedback entry:', error);
    }
  };

  const handlePostOnHomePage = async (entry: FeedbackData) => {
    if (!entry.id) return;
    const newValue = !entry.postedOnHomePage;
    try {
      await feedbackService.updateFeedbackEntry(entry.id, { postedOnHomePage: newValue });
      setFeedbackEntries(prev =>
        prev.map(e => e.id === entry.id ? { ...e, postedOnHomePage: newValue } : e)
      );
      showConfirmMessage(
        entry.id,
        newValue
          ? '✅ Review will appear on home page'
          : '❌ Review removed from home page'
      );
    } catch (error) {
      console.error('Failed to update postedOnHomePage:', error);
    }
  };

  const totalCount = feedbackEntries.length;
  const unresolvedCount = feedbackEntries.filter(e => !e.isResolved).length;
  const postedCount = feedbackEntries.filter(e => e.postedOnHomePage).length;

  const filteredEntries = feedbackEntries
    .filter(entry => {
      if (!showArchived && entry.isResolved) return false;
      if (typeFilter !== 'All Types' && entry.feedbackType !== typeFilter) return false;
      const term = searchTerm.toLowerCase();
      if (!term) return true;
      return (
        entry.feedbackTitle?.toLowerCase().includes(term) ||
        entry.userEmail?.toLowerCase().includes(term) ||
        entry.feedbackContent?.toLowerCase().includes(term) ||
        entry.snapshotName?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      const aTime = a.timestamp?.toDate?.()?.getTime?.() ?? 0;
      const bTime = b.timestamp?.toDate?.()?.getTime?.() ?? 0;
      return sortDirection === 'desc' ? bTime - aTime : aTime - bTime;
    });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const currentItems = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isEligibleForHomePage = (entry: FeedbackData) =>
    entry.feedbackType === POSITIVE_REVIEW && entry.publicConsent === true;

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case POSITIVE_REVIEW: return 'badge badge-positive';
      case 'Site Improvements': return 'badge badge-improvement';
      case 'Questions about Policy': return 'badge badge-policy';
      default: return 'badge badge-general';
    }
  };

  if (isLoading) return <div className="feedback-loading">Loading feedback...</div>;

  return (
    <div className='view-feedback-container'>
      <h2>User Feedback</h2>

      {/* Summary */}
      <div className="feedback-summary">
        <span>{totalCount} total</span>
        <span className="summary-divider">|</span>
        <span>{unresolvedCount} unresolved</span>
        <span className="summary-divider">|</span>
        <span>{postedCount} posted on home page</span>
      </div>

      {/* Filter bar */}
      <div className="feedback-filter-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          placeholder="Search title, email, content..."
          className="feedback-search-input"
        />
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          className="feedback-filter-select"
        >
          <option value="All Types">All Types</option>
          <option value={POSITIVE_REVIEW}>Positive Review</option>
          <option value="Site Improvements">Site Improvements</option>
          <option value="Questions about Policy">Questions about Policy</option>
          <option value="General">General</option>
        </select>
        <select
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
          className="feedback-filter-select"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <label className="show-archived-toggle">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => { setShowArchived(e.target.checked); setCurrentPage(1); }}
          />
          {' '}Show Archived
        </label>
      </div>

      {/* Feedback cards */}
      <div className='feedback-map'>
        {currentItems.length === 0 && (
          <p className="no-results">No feedback entries found.</p>
        )}
        {currentItems.map((entry) => (
          <div
            className={`view-feedback ${entry.isResolved ? 'view-feedback-archived' : ''} ${entry.feedbackType === POSITIVE_REVIEW ? 'view-feedback-positive' : ''}`}
            key={entry.id}
          >
            {/* Header row */}
            <div className="feedback-card-header">
              <span className={getTypeBadgeClass(entry.feedbackType)}>
                {entry.feedbackType}
              </span>
              {entry.postedOnHomePage && (
                <span className="badge badge-published">📢 Published</span>
              )}
              {entry.isResolved && (
                <span className="badge badge-archived">Archived</span>
              )}
              <span className="feedback-card-date">
                {entry.timestamp?.toDate?.()?.toLocaleString() ?? 'No date'}
              </span>
            </div>

            <div className="feedback-card-title">{entry.feedbackTitle}</div>
            <div className="feedback-card-email">{entry.userEmail}</div>
            <div className="feedback-card-content">{entry.feedbackContent}</div>

            {entry.attachmentUrl && (
              <a href={entry.attachmentUrl} target="_blank" rel="noopener noreferrer" className="feedback-attachment-link">
                View Attachment
              </a>
            )}

            {/* Positive Review section */}
            {entry.feedbackType === POSITIVE_REVIEW && (
              <div className="review-consent-info">
                <div className="consent-row">
                  <span>Public Consent: {entry.publicConsent ? '✅' : '❌'}</span>
                  <span>Profile Picture: {entry.includeProfilePicture ? '✅' : '❌'}</span>
                </div>
                {entry.snapshotName && (
                  <div><strong>Reviewer:</strong> {entry.snapshotName}{entry.snapshotRoleInfo && ` — ${entry.snapshotRoleInfo}`}</div>
                )}

                {isEligibleForHomePage(entry) && (
                  <div className="post-on-home-row">
                    <label className="post-on-home-label">
                      <input
                        type="checkbox"
                        checked={entry.postedOnHomePage === true}
                        onChange={() => handlePostOnHomePage(entry)}
                      />
                      {' '}Post this review on the home page
                    </label>
                    {entry.id && confirmMessages[entry.id] && (
                      <span className={`confirm-message ${entry.postedOnHomePage ? 'confirm-posted' : 'confirm-removed'}`}>
                        {confirmMessages[entry.id]}
                      </span>
                    )}
                  </div>
                )}

                {!entry.publicConsent && (
                  <p className="no-consent-note">
                    User did not consent to public display — cannot post on home page.
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="feedback-card-actions">
              {!entry.isResolved && (
                <button className="btn-resolve" onClick={() => handleResolve(entry)}>
                  Mark as Resolved
                </button>
              )}
              {entry.isResolved && (
                <span className="resolved-note">Archived — visible under "Show Archived"</span>
              )}
              <button className="btn-delete" onClick={() => setDeleteTargetId(entry.id ?? null)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="feedback-pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span className="pagination-indicator">{currentPage} / {totalPages}</span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTargetId && (
        <div className="delete-overlay">
          <div className="delete-dialog">
            <h3>Delete Feedback</h3>
            <p>Are you sure you want to permanently delete this feedback entry? This cannot be undone.</p>
            <div className="delete-dialog-actions">
              <button className="btn-cancel" onClick={() => setDeleteTargetId(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(deleteTargetId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
