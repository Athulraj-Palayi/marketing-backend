import React from 'react';
import Sidebar from './components/Sidebar';
import ContactList from './components/ContactList';
import MessageArea from './components/MessageArea';
import { useStore } from './store/useStore';

function App() {
  const { activeView } = useStore();

  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        return (
          <>
            <ContactList />
            <MessageArea />
          </>
        );
      case 'contacts':
        return <ContactList />;
      case 'calendar':
        return (
          <div className="flex-1 bg-white p-8">
            <h2 className="text-2xl font-semibold mb-4">Campaign Calendar</h2>
            <p className="text-gray-600">Schedule and manage your campaigns here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 bg-white p-8">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-600">Configure your WhatsApp Business API settings here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {renderContent()}
    </div>
  );
}

export default App;