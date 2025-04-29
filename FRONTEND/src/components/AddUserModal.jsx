import React from 'react';
import PropTypes from 'prop-types';
import '../styles/UserManagement.css';

const AddUserModal = ({ onClose, onUserAdded, currentUser }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New User</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>This is a placeholder for the Add User modal.</p>
          <p>Current Role: <strong>{currentUser?.role || 'Unknown'}</strong></p>
          {/* TODO: Implement Add User form here */}
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

AddUserModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUserAdded: PropTypes.func,
  currentUser: PropTypes.object
};

export default AddUserModal;
