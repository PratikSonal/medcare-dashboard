import { AlertTriangle } from "lucide-react";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-red-subtle)] flex items-center justify-center">
            <AlertTriangle size={22} className="text-accent-red" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-text-primary mb-1">Something went wrong</p>
            <p className="text-sm text-text-secondary max-w-[340px]">
              {this.state.error?.message ?? "An unexpected error occurred in this section."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-[10px] text-sm font-medium border border-border-primary bg-bg-secondary text-text-secondary cursor-pointer font-sans"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
