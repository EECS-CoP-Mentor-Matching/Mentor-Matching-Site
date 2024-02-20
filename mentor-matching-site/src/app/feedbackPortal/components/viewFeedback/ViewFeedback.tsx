import React, { useEffect, useState } from 'react';
import feedbackService from './../../../../service/feedbackService'

import './../submitFeedback/SubmitFeedback.css';
import './ViewFeedback.css';

interface FeedbackEntry {
  id?: string;
  userEmail: string;
  feedbackType: string;
  feedbackTitle: string;
  feedbackContent: string;
  attachmentUrl?: string;
  isResolved: boolean;
  timestamp?: any;
}

export default function ViewFeedback() {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [sortField, setSortField] = useState('feedbackTitle');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(5);
  const [searchTerm, setSearchTerm] = useState(''); // New state variable for the search term
  const [isLoading, setIsLoading] = useState(false); // New state variable for loading status


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

  if (isLoading) {
    return <div>Loading...</div>; // New loading state
  }
  const handleDelete = async (id: string) => {
    try {
      await feedbackService.deleteFeedbackEntry(id);
      setFeedbackEntries(feedbackEntries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error('Failed to delete feedback entry:', error);
    }
  };

  const sortedFeedbackEntries = [...feedbackEntries].filter(entry => 
    (entry.feedbackTitle ? entry.feedbackTitle.includes(searchTerm) : false) ||
    (entry.userEmail ? entry.userEmail.includes(searchTerm) : false) ||
    (entry.feedbackType ? entry.feedbackType.includes(searchTerm) : false) ||
    (entry.feedbackContent ? entry.feedbackContent.includes(searchTerm) : false)
  ).sort((a, b) => {
    const aValue = a[sortField as keyof FeedbackEntry];
    const bValue = b[sortField as keyof FeedbackEntry];
  
    if (aValue !== undefined && bValue !== undefined) {
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedFeedbackEntries.length / itemsPerPage);
  const currentItems = sortedFeedbackEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className='feedback-profile'>
      <h2>View Feedback</h2>
      
<div className="search-sort-container">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search..."
    className="search-sort-item"
  />
  <select
    value={sortField}
    onChange={(e) => setSortField(e.target.value)}
    className="search-sort-item"
  >
    <option value="feedbackTitle">Feedback Title</option>
    <option value="userEmail">User Email</option>
    <option value="feedbackType">Feedback Type</option>
    <option value="isResolved">Resolved</option>
  </select>

  <select
    value={sortDirection}
    onChange={(e) => setSortDirection(e.target.value)}
    className="search-sort-item"
  >
    <option value="asc">Ascending</option>
    <option value="desc">Descending</option>
  </select>
</div>
      <div className='feedback-map'>
        {currentItems.map((entry, index) => (
          <div className="view-feedback" key={index}>
            <strong>Feedback Title:</strong> {entry.feedbackTitle}<br /> 
            <strong>User Email:</strong> {entry.userEmail}<br />
            <strong>Feedback Type:</strong> {entry.feedbackType}<br />
            <strong>Feedback Content:</strong> {entry.feedbackContent}<br />
            <strong>Resolved:</strong> {entry.isResolved ? 'Yes' : 'No'}<br />
            {entry.attachmentUrl && <a href={entry.attachmentUrl} target="_blank" rel="noopener noreferrer">View Attachment</a>}<br />
            <strong>Submitted At:</strong> {entry.timestamp?.toDate().toLocaleString()}<br />
            <button onClick={() => entry.id && handleDelete(entry.id)}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}>Previous</button>
      <button onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}>Next</button>
    </div>
  );
};