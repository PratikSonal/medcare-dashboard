import { Provider } from "react-redux";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppRouter } from "@/routes";
import { store } from "@/store";

const App = () => (
  <Provider store={store}>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </Provider>
);

export default App;
