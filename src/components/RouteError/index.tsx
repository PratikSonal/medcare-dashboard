import { AlertTriangle } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const RouteError = (): React.ReactElement => {
  const error = useRouteError();

  let message = "An unexpected error occurred in this section.";
  if (isRouteErrorResponse(error)) {
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--accent-red-subtle)] flex items-center justify-center">
        <AlertTriangle size={22} className="text-accent-red" />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-text-primary mb-1">Something went wrong</p>
        <p className="text-sm text-text-secondary max-w-[340px]">{message}</p>
      </div>
    </div>
  );
};
