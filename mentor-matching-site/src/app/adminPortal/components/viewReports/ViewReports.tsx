import React, { useEffect, useState } from 'react';
import { reportUserService } from '../../../../service/reportUserService';
import firebase from 'firebase/app';
import 'firebase/firestore';

import './ViewReports.css';


interface ReportEntry {
  id?: string;
  reportedForUID: string;
  reportReason: string;
  reportedOn: any;
  timestamp?: any;
}

export default function ViewReports() {
  const [reportEntries, setReportEntries] = useState<ReportEntry[]>([]);
  const [sortField, setSortField] = useState('reportedForUID');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReportEntries = async () => {
      setIsLoading(true);
      try {
        const response = await reportUserService.getAllReports();
        const reportsWithConvertedTimestamps = response.map(report => ({
          ...report,
          reportedOn: new Date(report.reportedOn.seconds * 1000), // Convert the timestamp to a Date object
        }));
        setReportEntries(reportsWithConvertedTimestamps);
      } catch (error) {
        console.error('Error fetching report entries:', error);
      }
      setIsLoading(false);
    };
    fetchReportEntries();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (id: string) => {
    try {
      await reportUserService.deleteReportEntry(id);
      // Wait for the delete to complete before updating the state
      setReportEntries(prevEntries => prevEntries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error('Failed to delete report entry:', error);
    }
  };

  const sortedReportEntries = [...reportEntries].filter(entry => 
    (entry.reportedForUID && typeof entry.reportedForUID === 'string' ? entry.reportedForUID.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (entry.reportReason && typeof entry.reportReason === 'string' ? entry.reportReason.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  ).sort((a, b) => {
    const aValue = a[sortField as keyof ReportEntry];
    const bValue = b[sortField as keyof ReportEntry];
  
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

  const totalPages = Math.ceil(sortedReportEntries.length / itemsPerPage);
  const currentItems = sortedReportEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className='report-profile'>
      <h2>View Reports</h2>
      <p>Total Report Entries: {reportEntries.length}</p>
      
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
    <option value="reportedForUID">Reported User ID</option>
    <option value="reportReason">Report Reason</option>
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
      <div className='report-map'>
        {currentItems.map((entry, index) => (
          <div className="view-report" key={index}>
            <strong>Reported User ID:</strong> {entry.reportedForUID}<br /> 
            <strong>Report Reason:</strong> {entry.reportReason}<br />
            <strong>Submitted At:</strong> {entry.reportedOn.toString()}<br />            <button onClick={() => entry.id && handleDelete(entry.id)}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}>Previous</button>
      <button onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}>Next</button>
    </div>
  );
};