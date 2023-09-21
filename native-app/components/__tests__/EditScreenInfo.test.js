import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect'; // Extend expect with custom matchers
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Mock AsyncStorage using the mock implementation
jest.mock('@react-native-async-storage/async-storage', () =>
  require('../__tests__/react-native-async-storage-mock')
);

// Import your component after mocking AsyncStorage
import EditScreenInfo from '../EditScreenInfo'; // Update the import path as needed
// Import useMachineData from your app module
import { useMachineData } from '../../app/useMachineData';

// Import the NavigationMock component
import { NavigationMock } from '../__tests__/NavigationMock'; // Update the path as needed

// Wrap your component with NavigationMock
const renderWithNavigationMock = (component) => {
  return render(
    <NavigationMock>
      {component}
    </NavigationMock>
  );
};

describe('EditScreenInfo Component', () => {

  // Test to check if the component renders correctly
  it('should render the component', () => {
    const { getByText, getByPlaceholderText } = renderWithNavigationMock(
      <EditScreenInfo path="/" />
    );

    // Check if key elements are rendered
    expect(getByText('Machine Name')).toBeTruthy();
    expect(getByText('Part Name')).toBeTruthy();
    expect(getByText('Part Value')).toBeTruthy();
    expect(getByPlaceholderText('Enter part value')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  // Test to check if the component updates state when input fields change
  it('should update state when input fields change', async () => {
    const { getByPlaceholderText } = renderWithNavigationMock(
      <EditScreenInfo path="/" />
    );

    const partValueInput = getByPlaceholderText('Enter part value');

    // Simulate user input
    fireEvent.changeText(partValueInput, 'New Part Value');

    // Check if state is updated
    await waitFor(() => {
      expect(partValueInput.props.value).toBe('New Part Value');
    });
  });

  // Test to check if the component saves part when "Save" button is pressed
  it('should save part when "Save" button is pressed', () => {
    const { getByPlaceholderText, getByText } = renderWithNavigationMock(
      <EditScreenInfo path="/" />
    );

    const partValueInput = getByPlaceholderText('Enter part value');

    // Simulate user input
    fireEvent.changeText(partValueInput, 'New Part Value');

    // Click the "Save" button
    fireEvent.press(getByText('Save'));
  });

});
