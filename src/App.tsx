import { Provider } from "react-redux";
import { store } from "@/store";
import { AppRouter } from "@/routes";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const App = () => (
  <Provider store={store}>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </Provider>
);

export default App;
