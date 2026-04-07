import { useState } from 'react';
import HomePage from './pages/HomePage';
import AgendaPage from './pages/AgendaPage';
import ForumScreen from './components/ForumScreen';
import PerfilScreen from './components/PerfilScreen';

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

function App() {
  const [currentTab, setCurrentTab] = useState('inicio');

  const renderScreen = () => {
    switch (currentTab) {
      case 'inicio':
        return <HomePage onNavigate={setCurrentTab} />;
      case 'agenda':
        return <AgendaPage onNavigate={setCurrentTab} />;
      case 'forum':
        return <ForumScreen onNavigate={setCurrentTab} />;
      case 'perfil':
        return <PerfilScreen onNavigate={setCurrentTab} />;
      default:
        return <HomePage onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F5F5F5',
    }}>
      {renderScreen()}
    </div>
  );
}

export default App;