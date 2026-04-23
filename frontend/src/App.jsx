import { useState } from 'react';
import HomePage from './pages/HomePage';
import AgendaPage from './pages/AgendaPage';
import ForumScreen from './components/ForumScreen';
import PerfilScreen from './components/PerfilScreen';
import Login from './pages/Login'; 

function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const handleNavigate = (tab) => {
    const tabMapping = {
      'home': 'home',
      'agenda': 'agenda',
      'forum': 'forum',
      'profile': 'perfil',
      'login': 'login' 
    };
    
    setCurrentTab(tabMapping[tab] || 'home');
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'agenda':
        return <AgendaPage onNavigate={handleNavigate} />;
      case 'forum':
        return <ForumScreen onNavigate={handleNavigate} />;
      case 'perfil':
        return <PerfilScreen onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} onLoginSuccess={() => handleNavigate('home')} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return <>{renderScreen()}</>;
}

export default App;