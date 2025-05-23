import React from 'react';
import { MessageSquare, Users, Calendar, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

const Sidebar = () => {
  const { activeView, setActiveView } = useStore();

  const navItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ] as const;

  return (
    <div className="w-16 bg-gray-900 h-screen flex flex-col items-center py-4">
      <div className="flex flex-col space-y-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`p-3 text-white rounded-lg transition-colors ${
                activeView === item.id ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
              title={item.label}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;