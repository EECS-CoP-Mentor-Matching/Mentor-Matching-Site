import React, { useEffect, useState } from 'react';
import menteeService from '../../../../service/menteeService';
import { mentorService } from '../../../../service/mentorService';
import userDb from '../../../../dal/userDb';
import './ManageUsers.css';

interface User {
  id: string;
  name: string;
  email: string;
  // Add any other properties you need
}

function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const mentees = await menteeService.getAllMenteeProfiles(); // Fetch all mentees
        const mentors = await mentorService.getAllMentorProfiles(); // Fetch all mentors
        const users = [...mentees, ...mentors].map(profile => ({
          UID: profile.data.UID,
          technicalInterest: profile.data.technicalInterest,
          technicalExperience: profile.data.technicalExperience,
          professionalInterest: profile.data.professionalInterest,
          professionalExperience: profile.data.professionalExperience,
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (id: string) => {
    try {
      await userDb.deleteUserProfileAsync(id);
      // Wait for the delete to complete before updating the state
      setUsers(prevUsers => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const sortedUsers = [...users].filter(user => 
    (user.name && typeof user.name === 'string' ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (user.email && typeof user.email === 'string' ? user.email.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  ).sort((a, b) => {
    const aValue = a[sortField as keyof User];
    const bValue = b[sortField as keyof User];
  
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

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const currentItems = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className='report-profile'>
      <h2>Manage Users</h2>
      <p>Total Users: {users.length}</p>
      
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
          <option value="name">Name</option>
          <option value="email">Email</option>
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
        {currentItems.map((user, index) => (
          <div className="view-report" key={index}>
            <strong>Name:</strong> {user.name}<br /> 
            <strong>Email:</strong> {user.email}<br />
            <button onClick={() => user.id && handleDelete(user.id)}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}>Previous</button>
      <button onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}>Next</button>
    </div>
  );
}

export default ManageUsers;