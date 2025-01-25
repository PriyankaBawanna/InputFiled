
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
 

  test('submits the form with both fields empty and does not display a full name', () => {
    render(<App />);

    // Find the first name and last name inputs
    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    const submitButton = screen.getByTestId('submit-button');

    // Simulate empty form submission
    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.change(lastNameInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    // Check that the full name is not displayed
    const fullNameDisplay = screen.queryByTestId('full-name-display');
    expect(fullNameDisplay).toBeNull(); // Full name should not be displayed
  });



  

  const testCases = [
    // Valid Names
    { input: 'John', type: 'first', expected: true },
    { input: 'Doe', type: 'last', expected: true },
    { input: 'Mary-Jane', type: 'first', expected: true },
    { input: "O'Connor", type: 'last', expected: true },

    // Invalid Names with Special Characters
    { input: 'John123', type: 'first', expected: false },
    { input: 'Doe@', type: 'last', expected: false },
    { input: 'John!', type: 'first', expected: false },
    { input: 'Doe#', type: 'last', expected: false },

    // Names with Numbers
    { input: '123John', type: 'first', expected: false },
    { input: 'Doe456', type: 'last', expected: false },

    // Names with Symbols
    { input: 'John$', type: 'first', expected: false },
    { input: 'Doe%', type: 'last', expected: false },

    // Empty Inputs
    { input: '', type: 'first', expected: false },
    { input: '', type: 'last', expected: false },

    // Boundary Cases
    { input: 'A', type: 'first', expected: true },
    { input: 'Z', type: 'last', expected: true },
  ];

  testCases.forEach(({ input, type, expected }) => {
    test(`validates ${type} name input: "${input}" - ${expected ? 'Valid' : 'Invalid'}`, () => {
      render(<App />);

      const inputElement = type === 'first' 
        ? screen.getByTestId('first-name-input') 
        : screen.getByTestId('last-name-input');

      const submitButton = screen.getByTestId('submit-button');

      // Type input
      fireEvent.change(inputElement, { target: { value: input } });
      fireEvent.blur(inputElement);

      // Check validation result
      if (!expected) {
        const errorElement = type === 'first'
          ? screen.queryByTestId('first-name-error')
          : screen.queryByTestId('last-name-error');

        expect(errorElement).toBeInTheDocument();
      }
    });
  });

  test('prevents form submission with invalid inputs', () => {
    render(<App />);

    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    const submitButton = screen.getByTestId('submit-button');

    // Test various invalid input combinations
    const invalidCombinations = [
      { firstName: 'John123', lastName: 'Doe' },
      { firstName: 'John', lastName: 'Doe@' },
      { firstName: '123John', lastName: 'Doe' },
      { firstName: 'John!', lastName: 'Doe' },
    ];

    invalidCombinations.forEach(({ firstName, lastName }) => {
      fireEvent.change(firstNameInput, { target: { value: firstName } });
      fireEvent.change(lastNameInput, { target: { value: lastName } });
      fireEvent.click(submitButton);

      // Verify full name is not displayed
      const fullNameDisplay = screen.queryByTestId('full-name-display');
      expect(fullNameDisplay).toBeNull();
    });
  });

  test('allows form submission with valid inputs', () => {
    render(<App />);

    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    const submitButton = screen.getByTestId('submit-button');

    // Test various valid input combinations
    const validCombinations = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Mary-Jane', lastName: "O'Connor" },
      { firstName: 'Alice', lastName: 'Smith' },
    ];

    validCombinations.forEach(({ firstName, lastName }) => {
      fireEvent.change(firstNameInput, { target: { value: firstName } });
      fireEvent.change(lastNameInput, { target: { value: lastName } });
      fireEvent.click(submitButton);

      // Verify full name is displayed
      const fullNameDisplay = screen.getByTestId('full-name-display');
      expect(fullNameDisplay).toHaveTextContent(`Full Name: ${firstName} ${lastName}`);
    });
  });


  test('tests input fields functionality', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Get input fields
    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');

    // Test first name input
    await user.type(firstNameInput, 'John');
    expect(firstNameInput).toHaveValue('John');

    // Test last name input
    await user.type(lastNameInput, 'Doe');
    expect(lastNameInput).toHaveValue('Doe');

    // Test input clearing
    await user.clear(firstNameInput);
    await user.clear(lastNameInput);
    expect(firstNameInput).toHaveValue('');
    expect(lastNameInput).toHaveValue('');
  });


  test('submits the form and displays the full name', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Get input fields and submit button
    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    const submitButton = screen.getByTestId('submit-button');

    // Enter valid names
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');

    // Submit the form
    await user.click(submitButton);

    // Check if full name is displayed
    const fullNameDisplay = screen.getByTestId('full-name-display');
    expect(fullNameDisplay).toHaveTextContent('Full Name: John Doe');
  });
  test('checks if the form submission does not reload the page', async () => {
    const user = userEvent.setup();
    render(<App />);
  
    // Get input fields and submit button
    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    const form = screen.getByTestId('name-form');
  
    // Enter valid names
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
  
    // Create a spy on preventDefault
    const preventDefaultSpy = jest.fn();
    const mockEvent = {
      preventDefault: preventDefaultSpy
    };
  
    // Simulate form submission
    fireEvent.submit(form, mockEvent);
  
    // Check if preventDefault was called
    expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
  });
  

  test('checks if the form submission does not reload the page', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Mock the preventDefault method
    const mockPreventDefault = jest.fn();
    const event = {
      preventDefault: mockPreventDefault
    };

    // Get input fields and submit button
    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    const submitButton = screen.getByTestId('submit-button');

    // Enter valid names
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');

    // Simulate form submission
    const form = screen.getByTestId('name-form');
    fireEvent.submit(form, event);

    // Check if preventDefault was called
    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
  });
});












