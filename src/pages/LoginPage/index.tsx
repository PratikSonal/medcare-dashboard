import { LeftPanel } from './components/LeftPanel';
import { AuthForm } from './components/AuthForm';

const LoginPage = () => (
  <div className="dot-grid min-h-screen flex bg-bg-primary">
    <LeftPanel />
    <AuthForm />
  </div>
);

export default LoginPage;
