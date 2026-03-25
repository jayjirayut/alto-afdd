import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  HardDrive,
  Building2,
  Bot,
  BarChart3,
  Settings,
  Zap,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Library,
} from 'lucide-react';

const navItems = [
  { to: '/command-center', icon: Monitor, label: 'Command Center' },
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/fault-library', icon: Library, label: 'Fault Library' },
  { to: '/faults', icon: AlertTriangle, label: 'Faults' },
  { to: '/equipment', icon: HardDrive, label: 'Equipment' },
  { to: '/sites', icon: Building2, label: 'Sites' },
  { to: '/agents', icon: Bot, label: 'AI Agents' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed = false, onToggle }) {
  return (
    <aside className={`${collapsed ? 'w-14' : 'w-60'} shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col h-full transition-all duration-200`}>
      {/* Logo */}
      <div className={`${collapsed ? 'px-3 py-4' : 'px-5 py-5'} border-b border-gray-200`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-base font-semibold text-gray-900 leading-tight">AltoTech</div>
              <div className="text-xs font-medium text-sky-600 tracking-wide uppercase">AFDD</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'px-1.5' : 'px-3'} py-3 space-y-0.5 overflow-y-auto`}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2'} rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Toggle + Bottom info */}
      <div className={`${collapsed ? 'px-1.5' : 'px-3'} py-3 border-t border-gray-200`}>
        <button
          onClick={onToggle}
          className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-2.5 px-3 w-full'} py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
        {!collapsed && (
          <div className="px-3 mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>All systems operational</span>
            </div>
            <div className="mt-1.5 text-xs text-gray-400">
              AFDD v1.1 · 6 sites connected
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
