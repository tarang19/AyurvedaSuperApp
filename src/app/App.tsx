import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootNavigator} from './navigation/RootNavigator';
import {ThemeProvider, useTheme} from '../shared/theme/ThemeProvider';
import {ToastProvider} from '../shared/components/ToastProvider';
import {ErrorBoundary} from '../shared/components/ErrorBoundary';
import {syncQueue} from '../core/offline/syncQueue';
import {bookSlot, releaseSlot} from '../data/generators/doctors';
import type {Booking} from '../data/generators/doctors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

syncQueue.register('CREATE_BOOKING', async action => {
  const booking = action.payload as unknown as Booking;
  bookSlot(booking.slotId);
  return true;
});

syncQueue.register('CANCEL_BOOKING', async action => {
  const {id} = action.payload as {id: string};
  releaseSlot(id);
  return true;
});

function AppContent() {
  const {isDark} = useTheme();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected === true;
      if (online) syncQueue.processQueue(true);
    });
    return unsubscribe;
  }, []);

  const navTheme = isDark
    ? {...DarkTheme, colors: {...DarkTheme.colors, primary: '#2D6A4F', background: '#030712'}}
    : {...DefaultTheme, colors: {...DefaultTheme.colors, primary: '#2D6A4F', background: '#F8F6F0'}};

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
