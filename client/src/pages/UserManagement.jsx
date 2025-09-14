import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Phone
} from 'lucide-react';
import Nav from '../components/Nav';
import '../css/UserManagement.css';

const UserManagement = () => {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [voicePartFilter, setVoicePartFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Chorister',
    voicePart: 'Soprano',
    isActive: true
  });

  const roles = [
    'Regular member',
    'Liason officer',
    'Head of voice',
    'Secretary',
    'Marketer'
  ];

  const voiceParts = [
    'Soprano',
    'Alto',
    'Tenor',
    'Bass'
  ];

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/users/");
        const data = await res.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;
    
    // Search filter
    try{
   
    if (searchTerm) {
      filtered = filtered.filter(user =>
        `${user.username}`.includes(searchTerm.toLowerCase()) || `${user.username}`.includes(searchTerm)
      );
    }
    }catch(e){

    }


    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Voice part filter
    
    if (voicePartFilter !== 'all') {
      filtered = filtered.filter(user => user.Part === voicePartFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, voicePartFilter]);

  const handleAddUser = async () => {
    if (newUser.firstName && newUser.lastName && newUser.email) {
      try {
        const res = await fetch("https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/users/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newUser),
        });

        if (!res.ok) {
          throw new Error("Failed to add user");
        }

        const savedUser = await res.json();
        setUsers(prev => [...prev, savedUser]);

        // Reset form
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'Chorister',
          voicePart: 'Soprano',
          isActive: true
        });
        setShowAddUser(false);
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const handleEditUser = async () => {
    if (selectedUser && selectedUser.firstName && selectedUser.lastName && selectedUser.email) {
      try {
        const res = await fetch(`https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/users/update/${selectedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(selectedUser),
        });

        if (!res.ok) {
          throw new Error("Failed to update user");
        }

        const updatedUser = await res.json();
        setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
        setShowEditUser(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/users/delete/${userId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to delete user");
        }

        setUsers(prev => prev.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser({ ...user });
    setShowEditUser(true);
  };

  if (!user.role == "admin") {
    return (
      <>
        <Nav />
        <div className="user-management-root">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Nav />
        <div className="user-management-root">
          <div className="loading">Loading users...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="user-management-root">
        <div className="user-management-container">
          {/* Header */}
          <div className="user-management-header">
            <div className="header-left">
              <div className="icon-wrapper">
                <Users className="header-icon" />
              </div>
              <div>
                <h1 className="page-title">User Management</h1>
                <p className="page-subtitle">Manage choir members and their roles</p>
              </div>
            </div>
            {/* <button onClick={() => setShowAddUser(true)} className="add-user-button">
              <Plus className="plus-icon" />
              Add User
            </button> */}
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="search-box">
              
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <div className="filter-item">
                <Filter className="filter-icon" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Roles</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <select
                  value={voicePartFilter}
                  onChange={(e) => setVoicePartFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Voice Parts</option>
                  {voiceParts.map(part => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Voice Part</th>
              
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-name">
                        {user.username}
                      </div>
                    </td>
    
                    <td>
                      <span className={`role-badge role-${user.role.toLowerCase().replace(/\s+/g, '-')}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`voice-badge voice-${user.voicePart}`}>
                        {user.Part}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openEditModal(user)}
                          className="action-btn edit-btn"
                          title="Edit User"
                        >
                          <Edit className="action-icon" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="action-btn delete-btn"
                          title="Delete User"
                        >
                          <Trash2 className="action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="no-users">
                <Users className="no-users-icon" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 className="modal-title">Add New User</h3>

              <div className="modal-form">
                <div className="modal-row">
                  <div>
                    <label className="modal-label">First Name</label>
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      className="modal-input"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="modal-label">Last Name</label>
                    <input
                      type="text"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      className="modal-input"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <label className="modal-label">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="modal-input"
                  placeholder="Enter email address"
                />

                <label className="modal-label">Phone (Optional)</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="modal-input"
                  placeholder="Enter phone number"
                />

                <div className="modal-row">
                  <div>
                    <label className="modal-label">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="modal-input"
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="modal-label">Voice Part</label>
                    <select
                      value={newUser.voicePart}
                      onChange={(e) => setNewUser({ ...newUser, voicePart: e.target.value })}
                      className="modal-input"
                    >
                      {voiceParts.map(part => (
                        <option key={part} value={part}>{part}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newUser.isActive}
                      onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })}
                      className="checkbox-input"
                    />
                    Active User
                  </label>
                </div>
              </div>

              <div className="modal-buttons">
                <button onClick={() => setShowAddUser(false)} className="modal-btn cancel">
                  Cancel
                </button>
                <button onClick={handleAddUser} className="modal-btn add">
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditUser && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 className="modal-title">Edit User</h3>

              <div className="modal-form">
                <label className="modal-label">Username</label>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                  className="modal-input"
                  placeholder="Enter username"
                />

                <div className="modal-row">
                  <div>
                    <label className="modal-label">Role</label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                      className="modal-input"
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="modal-label">Voice Part</label>
                    <select
                      value={selectedUser.Part}
                      onChange={(e) => setSelectedUser({ ...selectedUser, Part: e.target.value })}
                      className="modal-input"
                    >
                      {voiceParts.map(part => (
                        <option key={part} value={part}>{part}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-buttons">
                <button onClick={() => setShowEditUser(false)} className="modal-btn cancel">
                  Cancel
                </button>
                <button onClick={handleEditUser} className="modal-btn add">
                  Update User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagement;