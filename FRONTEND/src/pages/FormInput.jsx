import React from 'react';

const FormInput = ({ 
  label, 
  type = 'text', 
  name,
  value, 
  onChange, 
  placeholder = '', 
  error = '', 
  required = false 
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name}>
          {label}{required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        required={required}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormInput;