import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

/**
 * View Component: CreateIncidentModal
 * Form to register a new incident directly matching database `reports` schema
 */
export function CreateIncidentModal({ isOpen, onClose, onSave, isLoading }) {
  const [type, setType] = useState('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      type,
      title,
      category,
      location,
      description
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container incident-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-header">
          <h3>Create New Incident Report</h3>
          <p>Register an incident report into database <code>reports</code> table.</p>
        </div>

        <form onSubmit={handleSubmit} className="incident-form">
          {/* Incident Type */}
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <div className="type-toggle-group">
              <button
                type="button"
                className={`type-btn ${type === 'lost' ? 'active lost' : ''}`}
                onClick={() => setType('lost')}
              >
                Lost Report (Citizen Lost Item)
              </button>
              <button
                type="button"
                className={`type-btn ${type === 'found' ? 'active found' : ''}`}
                onClick={() => setType('found')}
              >
                Found Report (Turned In Item)
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Item Title / Model</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              required
            />
          </div>

          {/* Category & Location */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Electronics">Electronics</option>
                <option value="Personal Item">Personal Item</option>
                <option value="Luggage">Luggage & Bags</option>
                <option value="Documents">Documents / ID</option>
                <option value="Jewelry">Jewelry & Watch</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Terminal 2 Departure Gate 5"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Distinct Characteristics / Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Color, scratches, engravings, serial number fragments..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Register Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIncidentModal;
