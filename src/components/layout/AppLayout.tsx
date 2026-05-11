import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAppSelector } from '@/hooks/useAppDispatch';

export function AppLayout() {
  const sidebarOpen = useAppSelector(s => s.ui.sidebarOpen);
  return (
    <div className="dot-grid" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <Navbar />
      <motion.main
        animate={{ marginLeft: sidebarOpen ? '260px' : '72px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ paddingTop: '64px', minHeight: '100vh' }}
      >
        <div style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
