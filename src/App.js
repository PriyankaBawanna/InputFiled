// Component (App.js)
import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [touched, setTouched] = useState({ first: false, last: false });
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  // Regex pattern for valid names (letters only)
  const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ-' ]+$/;

  const validateName = (value, type) => {
    if (!value.trim()) {
      if (type === 'first') {
        setFirstNameError('This field is required');
      } else {
        setLastNameError('This field is required');
      }
      return false;
    } else if (!NAME_REGEX.test(value)) {
      if (type === 'first') {
        setFirstNameError('Invalid characters detected');
      } else {
        setLastNameError('Invalid characters detected');
      }
      return false;
    } else {
      if (type === 'first') {
        setFirstNameError('');
      } else {
        setLastNameError('');
      }
      return true;
    }
  };

  const handleSubmit = (e) => {
    // CRITICAL: Prevent default form submission behavior
    e.preventDefault();
    
    // Force validation of both fields
    setTouched({ first: true, last: true });

    // Explicitly validate both first and last names
    const isFirstNameValid = validateName(firstName, 'first');
    const isLastNameValid = validateName(lastName, 'last');

    // Only set full name if both fields are valid
    if (isFirstNameValid && isLastNameValid) {
      setFullName(`${firstName.trim()} ${lastName.trim()}`);
    } else {
      setFullName('');
    }
  };

  return (
    <div>
      <form 
        onSubmit={handleSubmit} 
        data-testid="name-form"
      >
        <label htmlFor="first-name-input">
          First Name
          <input
            id="first-name-input"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (touched.first) {
                validateName(e.target.value, 'first');
              }
            }}
            onBlur={() => {
              setTouched(p => ({ ...p, first: true }));
              validateName(firstName, 'first');
            }}
            data-testid="first-name-input"
            aria-invalid={!!firstNameError}
          />
          {touched.first && firstNameError && (
            <span className="error" data-testid="first-name-error">
              {firstNameError}
            </span>
          )}
        </label>
        
        <label htmlFor="last-name-input">
          Last Name
          <input
            id="last-name-input"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (touched.last) {
                validateName(e.target.value, 'last');
              }
            }}
            onBlur={() => {
              setTouched(p => ({ ...p, last: true }));
              validateName(lastName, 'last');
            }}
            data-testid="last-name-input"
            aria-invalid={!!lastNameError}
          />
          {touched.last && lastNameError && (
            <span className="error" data-testid="last-name-error">
              {lastNameError}
            </span>
          )}
        </label>
        
        <button 
          type="submit" 
          data-testid="submit-button"
        >
          Submit
        </button>
      </form>

      {fullName && (
        <div data-testid="full-name-display">
          Full Name: {fullName}
        </div>
      )}
    </div>
  );
};

export default App;
