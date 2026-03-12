import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03DAC6',
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#6200ee' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'My Todos' }} />
          <Stack.Screen
            name="add-edit"
            options={({ route }) => ({
              title: (route.params as any)?.id ? 'Edit Todo' : 'Add Todo',
              presentation: 'modal',
            })}
          />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
