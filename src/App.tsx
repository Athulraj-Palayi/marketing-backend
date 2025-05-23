import React from 'react';
import Sidebar from './components/Sidebar';
import ContactList from './components/ContactList';
import MessageArea from './components/MessageArea';
import { useStore } from './store/useStore';

function App() {
  const { activeView } = useStore();

  const handleAddUser = async () => {
    try {
      const response = await fetch('https://marketing-backend-8bd1.onrender.com/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Athulraj',
          email: 'test@shaji.ae'
        })
      });

      const data = await response.json();
      alert(`✅ User added: ${data.name}`);
      console.log('✅ API response:', data);
    } catch (error) {
      console.error('❌ API call failed:', error);
      alert('❌ Failed to connect to backend');
    }
  };

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
            <p className="text-gray-600 mb-4">Configure your WhatsApp Business API settings here.</p>
            <button
              onClick={handleAddUser}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
            >
              ➕ Add Test User to MongoDB
            </button>
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
