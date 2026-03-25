import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import ChatPanel from './components/common/ChatPanel';
import CommandCenter from './pages/CommandCenter';
import Dashboard from './pages/Dashboard';
import FaultLibrary from './pages/FaultLibrary';
import Faults from './pages/Faults';
import Equipment from './pages/Equipment';
import Sites from './pages/Sites';
import Agents from './pages/Agents';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-full bg-white">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      <main className="flex-1 min-w-0 overflow-y-auto h-full">
        <Routes>
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/fault-library" element={<FaultLibrary />} />
          <Route path="/faults" element={<Faults />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/sites/:siteId" element={<Sites />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <ChatPanel />
    </div>
  );
}
