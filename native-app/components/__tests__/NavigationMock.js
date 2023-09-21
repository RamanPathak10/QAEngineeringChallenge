import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// This component is a mock navigation container for testing purposes.
// It wraps the provided children in a mock navigation stack.
export const NavigationMock = ({ children }) => {
  return (
    <NavigationContainer>
      {/* Create a mock navigation stack with an initial route named "TestScreen" */}
      <Stack.Navigator initialRouteName="TestScreen">
        {/* Create a screen within the stack that renders the provided children */}
        <Stack.Screen name="TestScreen">
          {() => children}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

