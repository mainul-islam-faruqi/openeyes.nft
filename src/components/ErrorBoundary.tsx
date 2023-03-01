import { Component, ReactNode } from "react";
import { datadogRum } from "@datadog/browser-rum";
import { ApplicationError } from "./Layout/Errors/ApplicationError";

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    datadogRum.addError(error);
  }

  render() {
    if (this.state.hasError) {
      return <ApplicationError />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
