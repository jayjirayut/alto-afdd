import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@workos-inc/authkit-react';
import { Zap, LogIn } from 'lucide-react';
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
  const { user, isLoading, signIn } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center animate-pulse">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-sm text-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">AltoTech AFDD</h1>
          <p className="text-sm text-gray-500 mb-6">Automated Fault Detection & Diagnostics</p>
          <button
            onClick={() => signIn()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-sky-600 hover:to-blue-600 transition-colors"
          >
            <LogIn size={16} />
            Sign in to continue
          </button>
          <p className="text-xs text-gray-400 mt-4">Authorized AltoTech personnel only</p>
        </div>
      </div>
    );
  }

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
