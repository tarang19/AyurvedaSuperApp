import React, {Component, ErrorInfo, ReactNode} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {logger} from '../../core/logging/logger';

type Props = {children: ReactNode; fallback?: ReactNode};
type State = {hasError: boolean; error?: Error};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {hasError: false};

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('ErrorBoundary caught', error, {componentStack: info.componentStack});
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <View className="flex-1 items-center justify-center bg-ayurveda-cream p-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</Text>
            <Text className="text-gray-500 text-center mb-6">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </Text>
            <TouchableOpacity
              className="bg-ayurveda-leaf px-6 py-3 rounded-xl"
              onPress={() => this.setState({hasError: false, error: undefined})}
              accessibilityRole="button"
              accessibilityLabel="Try again">
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        )
      );
    }
    return this.props.children;
  }
}
