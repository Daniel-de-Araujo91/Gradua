import { useState } from 'react';
import HomePage from './pages/HomePage';
import AgendaPage from './pages/AgendaPage';
import ForumScreen from './pages/ForumScreen';
import PerfilScreen from './pages/PerfilScreen';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import MeusDocumentosPage from './pages/MeusDocumentosPage';
import AdminScreen from './components/AdminScreen';

function App() {
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem('gradua_current_tab') || 'home';
  });

  const handleNavigate = (tab) => {
    const tabMapping = {
      'home': 'home',
      'agenda': 'agenda',
      'forum': 'forum',
      'profile': 'perfil',
      'login': 'login',
      'cadastro': 'cadastro',
      'documentos': 'documentos',
      'admin': 'admin'
    };
    
    const targetTab = tabMapping[tab] || 'home';
    setCurrentTab(targetTab);
    localStorage.setItem('gradua_current_tab', targetTab)
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
      case 'admin':
        return <AdminScreen onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return <>{renderScreen()}</>;
}

export default App;