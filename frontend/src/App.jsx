import { useState } from 'react';
import HomePage from './pages/HomePage';
import AgendaPage from './pages/AgendaPage';
import ForumScreen from './pages/ForumScreen';
import PerfilScreen from './pages/PerfilScreen';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import MeusDocumentosPage from './pages/MeusDocumentosPage';

function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const handleNavigate = (tab) => {
    const tabMapping = {
      'home': 'home',
      'agenda': 'agenda',
      'forum': 'forum',
      'profile': 'perfil',
      'login': 'login',
      'cadastro': 'cadastro',
      'documentos': 'documentos',
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
      case 'cadastro':
        return <Cadastro onNavigate={handleNavigate} onRegisterSuccess={() => handleNavigate('login')} />;
      case 'documentos':
        return <MeusDocumentosPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return <>{renderScreen()}</>;
}

export default App;