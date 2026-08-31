# Ayurveda Super App

A comprehensive React Native mobile application for Ayurvedic consultation, health record management, and product shopping with offline-first capabilities.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Architectural Decisions](#architectural-decisions)
- [State Management](#state-management)
- [Performance Optimizations](#performance-optimizations)
- [Offline Strategy](#offline-strategy)
- [Trade-offs](#trade-offs)
- [Future Improvements](#future-improvements)

## Quick Start

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

### Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

#### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

#### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

---

## Project Overview

Ayurveda Super App is a multi-module React Native application built with TypeScript, providing a unified platform for:

- **Consultation**: Book Ayurvedic consultations with available doctors
- **Health Records**: Track and manage personal health information
- **Shop**: Browse and purchase Ayurvedic products
- **Settings**: Manage user preferences and theme

### Tech Stack

- **Framework**: React Native 0.76.9
- **Language**: TypeScript 5.0
- **Styling**: NativeWind (Tailwind CSS) + custom theme system
- **State Management**: Zustand 5.0
- **Data Fetching**: TanStack React Query 5.102
- **Navigation**: React Navigation 7.x
- **Storage**: AsyncStorage + MMKV
- **Offline Support**: Custom sync queue with retry mechanism
- **Network Monitoring**: NetInfo
- **Testing**: Jest + React Native Testing Library

---

## Folder Structure

```
AyurvedaSuperApp/
├── src/
│   ├── app/                          # Application root and navigation
│   │   ├── App.tsx                   # Main app component with providers
│   │   ├── navigation/               # Navigation configuration
│   │   │   ├── RootNavigator.tsx     # Tab-based root navigation
│   │   │   ├── ConsultationNavigator.tsx
│   │   │   ├── HealthNavigator.tsx
│   │   │   ├── ShopNavigator.tsx
│   │   │   └── types.ts              # Navigation type definitions
│   │   └── screens/
│   │       └── SettingsScreen.tsx
│   │
│   ├── core/                         # Core application utilities
│   │   ├── api/
│   │   │   ├── client.ts             # API request handler with caching
│   │   │   └── types.ts              # API type definitions
│   │   ├── config/
│   │   │   └── env.ts                # Environment configuration
│   │   ├── logging/
│   │   │   └── logger.ts             # Logging utility
│   │   ├── offline/
│   │   │   └── syncQueue.ts          # Offline sync queue implementation
│   │   └── storage/
│   │       └── storage.ts            # Abstracted storage layer
│   │
│   ├── data/                         # Mock data generators
│   │   └── generators/
│   │       ├── doctors.ts            # Doctor and booking data
│   │       ├── healthRecords.ts      # Health record data
│   │       └── products.ts           # Product catalog data
│   │
│   ├── modules/                      # Feature modules (feature-based architecture)
│   │   ├── consultation/             # Consultation module
│   │   │   ├── components/           # Module-specific components
│   │   │   ├── hooks/                # Module-specific hooks
│   │   │   ├── screens/              # Feature screens
│   │   │   └── store/
│   │   │       └── bookingStore.ts   # Zustand store for bookings
│   │   │
│   │   ├── health-records/           # Health records module
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── screens/
│   │   │
│   │   └── shop/                     # E-commerce module
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── screens/
│   │       └── store/
│   │           ├── cartStore.ts      # Zustand store for shopping cart
│   │           └── wishlistStore.ts  # Zustand store for wishlist
│   │
│   └── shared/                       # Shared utilities and components
│       ├── components/               # Reusable UI components
│       │   ├── Badge.tsx
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── EmptyState.tsx
│       │   ├── ErrorBoundary.tsx
│       │   ├── FilterChip.tsx
│       │   ├── Input.tsx
│       │   ├── LoadingSpinner.tsx
│       │   ├── SearchBar.tsx
│       │   ├── Toast.tsx
│       │   └── ToastProvider.tsx
│       └── theme/
│           └── ThemeProvider.tsx     # Theme context and styling utilities
│
├── android/                          # Android native code
├── ios/                              # iOS native code
├── __tests__/                        # Test files
├── app.json                          # App configuration
├── metro.config.js                   # Metro bundler configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── nativewind-env.d.ts               # NativeWind type definitions
├── tsconfig.json                     # TypeScript configuration
├── jest.config.js                    # Jest testing configuration
└── package.json                      # Dependencies and scripts
```

### Folder Architecture Principles

1. **Feature-Based Structure**: Each module (consultation, shop, health-records) is self-contained with its own screens, components, hooks, and state management
2. **Core Separation**: Utilities and services (API, storage, offline sync) are isolated in the `core` folder
3. **Shared Components**: Common UI components and providers live in `shared` for reusability
4. **Data Generators**: Mock data is centralized in `data/generators` for easy management
5. **Separation of Concerns**: Each folder has a single responsibility, making the codebase maintainable and scalable

---

## Architectural Decisions

### 1. **Feature-Based Module Architecture**

The app is organized around features (Consultation, Shop, Health Records) rather than technical layers (screens, components, services). Each module is autonomous and can be developed, tested, and deployed independently.

**Rationale:**
- Improves code organization and scalability
- Reduces namespace collisions
- Facilitates team collaboration
- Enables easy feature toggling or removal

### 2. **Navigation Architecture**

- **Root Navigator**: Tab-based navigation with 4 main sections (Consultation, Shop, Health, Settings)
- **Module Navigators**: Each module has its own native stack navigator for internal navigation
- **Centralized Types**: Navigation prop types are defined centrally in `navigation/types.ts`

**Rationale:**
- Clear separation between sections
- Smooth transitions between features
- Type-safe navigation with TypeScript

### 3. **Provider-Based Composition**

The App component wraps all providers in a specific order:
```
ErrorBoundary → ThemeProvider → ToastProvider → QueryClientProvider → NavigationContainer
```

**Rationale:**
- Ensures proper initialization order
- Global error handling
- Theme support throughout the app
- Centralized toast notifications
- Network request management via React Query

### 4. **Abstracted Storage Layer**

All storage operations go through `src/core/storage/storage.ts` with:
- Unified key management (STORAGE_KEYS)
- Error logging
- Prefix namespacing
- Support for secure storage

**Rationale:**
- Single point of control for persistence
- Easy migration between storage backends
- Prevents accidental key collisions
- Simplifies testing

### 5. **API Request with Caching**

The `src/core/api/client.ts` implements:
- Automatic caching with TTL
- Network status detection
- Fallback to stale data when offline
- Simulated network delays and failures for testing

**Rationale:**
- Reduces unnecessary network requests
- Graceful offline fallback
- Better user experience with realistic network simulation
- Performance monitoring with logging

---

## State Management

### Zustand for Local State

The app uses **Zustand** for all local state management with persistence middleware. Zustand was chosen for its simplicity, minimal boilerplate, and excellent TypeScript support.

### Store Implementation Pattern

**Example: Booking Store** (`src/modules/consultation/store/bookingStore.ts`)

```typescript
export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      addBooking: async (bookingData) => { /* ... */ },
      cancelBooking: async (id) => { /* ... */ },
      loadBookings: async () => { /* ... */ },
    }),
    {
      name: 'booking-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({bookings: state.bookings}),
    },
  ),
);
```

### State Management Pattern

1. **Module-Level Stores**: Each module maintains its own Zustand store
   - `consultation/store/bookingStore.ts` - Booking state
   - `shop/store/cartStore.ts` - Shopping cart state
   - `shop/store/wishlistStore.ts` - Wishlist state

2. **Persistence Strategy**:
   - Stores are persisted to AsyncStorage automatically via the `persist` middleware
   - Only necessary fields are saved using `partialize` to minimize storage size
   - Stores are rehydrated on app startup

3. **Async Actions**: Store actions handle async operations like API calls and storage:
   ```typescript
   addBooking: async (booking) => {
     // Validate
     // Check network status
     // Enqueue if offline
     // Update local state
     // Persist to storage
   }
   ```

4. **Offline Integration**: Stores integrate with the sync queue:
   - When offline, actions enqueue operations instead of sending them
   - When online, the sync queue processes pending operations
   - Bookings marked as 'pending_sync' until confirmed

### Data Fetching with React Query

- **Default Config**: 2 retries, 5-minute stale time
- **Per-Query Overrides**: Each query can customize retry, stale time, and caching behavior
- **Cache Keys**: Centralized naming convention (e.g., `doctors`, `products`, `health-records`)

---

## Performance Optimizations

### 1. **List Virtualization**

Uses **@shopify/flash-list** for rendering large lists:
- Virtual scrolling for unlimited list sizes
- Automatic cell size measurement
- Better memory usage than FlatList
- Smooth 60 FPS scrolling

### 2. **Styling with NativeWind**

**NativeWind** (Tailwind CSS for React Native) provides:
- Compiled CSS-in-JS (faster than runtime styles)
- Consistent design system via Tailwind utilities
- Automatic dark mode support
- Smaller bundle size than alternatives

### 3. **API Caching Strategy**

```
Request → Cache Check (TTL-based)
           ↓ Hit: Return cached data
           ↓ Miss: Network request
                    ↓ Success: Cache + Return
                    ↓ Failure: Return stale cache (fallback)
```

- **Cache TTL**: Configurable via `ENV.CACHE_TTL_MS` (default: 5 minutes)
- **Fallback Mechanism**: Uses stale data if network fails
- **Skip Cache Option**: For critical/fresh data requirements

### 4. **Network Status Optimization**

- **NetInfo Listener**: Monitors connection changes in real-time
- **Lazy Processing**: Sync queue only processes when online
- **Debounced Updates**: Prevents redundant state updates

### 5. **Memory Optimization**

- **Partial Persistence**: Only persisting essential state fields
- **Cleanup**: Event listeners and intervals are properly cleaned up
- **Lazy Loading**: Screens and modules loaded on-demand via navigation

### 6. **Bundle Size Optimization**

- **Tree-shaking**: Unused code removed via rollup
- **Asset Optimization**: Images compressed in build
- **Code Splitting**: Module-based navigation naturally splits code

---

## Offline Strategy

### Sync Queue Architecture

The app implements a robust offline-first synchronization system via `src/core/offline/syncQueue.ts`:

**Key Features:**
1. **Action Queuing**: When offline, actions are stored locally with metadata
   ```typescript
   {
     id: string;              // Unique identifier
     type: string;            // Action type (CREATE_BOOKING, CANCEL_BOOKING)
     payload: Record;         // Action data
     createdAt: string;       // ISO timestamp
     retries: number;         // Retry count
   }
   ```

2. **Handler Registration**: Each action type has a handler registered at app startup
   ```typescript
   syncQueue.register('CREATE_BOOKING', async (action) => {
     const booking = action.payload as Booking;
     bookSlot(booking.slotId);
     return true; // Success
   });
   ```

3. **Automatic Retry**: Failed actions are retried up to 3 times
   - Exponential backoff not implemented (could be added)
   - Max age validation could be added

4. **Batch Processing**: All queued actions are processed when connection is restored
   - Single database write reduces contention
   - Transactional consistency

### Offline Workflow

```
User Action (Offline)
    ↓
✓ Optimistic Update (Local State)
✓ Enqueue to Sync Queue
    ↓
When Online
    ↓
Process Queue (Run Handlers)
    ↓
Successful Handler → Remove from Queue
Failed Handler → Retry (< 3 times)
    ↓
Max Retries Reached → Discard with Logging
```

### Booking-Specific Offline Support

- **Optimistic Updates**: Booking state updated immediately
- **Status Tracking**: Bookings marked as 'pending_sync' or 'confirmed'
- **User Feedback**: Toast notifications inform of pending operations
- **Recovery**: When online, app automatically syncs

### Integration with Store

The booking store integrates offline support:
```typescript
addBooking: async (bookingData) => {
  if (!getNetworkStatus()) {
    // Queue offline
    await syncQueue.enqueue({
      type: 'CREATE_BOOKING',
      payload: booking,
    });
  } else {
    // Book immediately
    bookSlot(bookingData.slotId);
  }
  // Always update local state
  set({bookings: [...bookings, booking]});
}
```

---

## Trade-offs

### 1. **Mock API vs Real Backend**

**Current Implementation**: Mock data generators
- ✅ No backend dependency, faster development
- ✅ Testing without network delays
- ❌ Doesn't test real API error scenarios
- ❌ Production migration needed

**Recommendation**: Replace `data/generators` with real API calls to backend

### 2. **AsyncStorage vs Encrypted Storage**

**Current Implementation**: AsyncStorage (unencrypted)
- ✅ Simple implementation
- ✅ No performance overhead
- ❌ Sensitive data exposed (bookings, wishlist)
- ❌ Not suitable for PII or tokens

**Trade-off**: Security vs simplicity. Production should use `react-native-keychain` for sensitive data.

### 3. **Global Theme via Context vs Zustand**

**Current Implementation**: React Context (ThemeProvider)
- ✅ Lightweight for simple state
- ✅ Familiar pattern
- ❌ Not persisted automatically
- ❌ Different pattern than module stores

**Alternative Considered**: Use Zustand for consistency, but Context is appropriate for theme.

### 4. **Optimistic Updates vs Pessimistic**

**Current Implementation**: Optimistic updates for bookings
- ✅ Excellent UX
- ✅ Fast feedback
- ❌ Requires rollback on failure
- ❌ Complex state management

**Alternative**: Pessimistic updates (wait for server) - simpler but slower.

### 5. **Data Persistence Scope**

**Current Implementation**: Partial persistence (`partialize` in stores)
- ✅ Reduced storage footprint
- ✅ Improved startup time
- ❌ Some state lost on app restart
- ❌ May need full persistence later

### 6. **Simulated vs Real Network Delays**

**Current Implementation**: Mock network delays in API client
- ✅ Realistic testing conditions
- ✅ Tests timeout scenarios
- ❌ Tests slower than real app (for quick feedback)
- ❌ Non-deterministic (10% slow by default)

---

## Future Improvements

### 1. **Backend Integration**

- [ ] Replace mock data generators with real API endpoints
- [ ] Implement token-based authentication (JWT)
- [ ] Add refresh token mechanism
- [ ] Handle 401 Unauthorized globally

### 2. **Enhanced Security**

- [ ] Implement `react-native-keychain` for secure storage
- [ ] Add certificate pinning for API requests
- [ ] Encrypt sensitive local data
- [ ] Implement biometric authentication

### 3. **Advanced Offline Features**

- [ ] Exponential backoff for retry logic
- [ ] Action expiration (discard old pending actions)
- [ ] Conflict resolution for concurrent updates
- [ ] Partial sync (per-module queue)
- [ ] Local database (SQLite) instead of AsyncStorage

### 4. **Analytics & Monitoring**

- [ ] Integration with analytics service (Firebase, Mixpanel)
- [ ] Crash reporting (Sentry)
- [ ] Performance monitoring
- [ ] Network request tracking

### 5. **Testing Improvements**

- [ ] E2E tests with Detox or Appium
- [ ] Unit tests for stores and utilities
- [ ] Integration tests for offline sync
- [ ] Component snapshot tests
- [ ] Network error scenario tests

### 6. **User Experience**

- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] In-app messaging/announcements
- [ ] User onboarding flow
- [ ] Help/FAQ section
- [ ] Rate limiting for API requests (429 handling)

### 7. **Developer Experience**

- [ ] Environment-specific configurations (.env files)
- [ ] Debugger tools (Redux DevTools-like for Zustand)
- [ ] Mock API server (Mirage.js or MSW)
- [ ] Error boundary with detailed logging
- [ ] Feature flags for gradual rollout

### 8. **Performance**

- [ ] Implement code splitting for modules
- [ ] Lazy load module images
- [ ] Service worker for web (if porting to web)
- [ ] Memory profiling for large datasets
- [ ] Bundle analysis and optimization

### 9. **Accessibility**

- [ ] Screen reader support (VoiceOver/TalkBack)
- [ ] High contrast mode
- [ ] Keyboard navigation
- [ ] WCAG 2.1 compliance

### 10. **Internationalization**

- [ ] Multi-language support (i18n)
- [ ] Right-to-left (RTL) support
- [ ] Locale-specific formatting (dates, numbers)
- [ ] Ayurvedic terminology translations

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
