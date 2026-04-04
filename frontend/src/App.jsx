import { useState } from 'react'
import ForumScreen from './components/ForumScreen'
import PerfilScreen from './components/PerfilScreen'
import './App.css'

// Importar Google Fonts
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

const screens = {
  forum: ForumScreen,
  perfil: PerfilScreen,
}

function App() {
  const [currentTab, setCurrentTab] = useState('forum')

  // Só navega para as telas implementadas; início e agenda são de outro responsável
  const handleNavigate = (tab) => {
    if (screens[tab]) {
      setCurrentTab(tab)
    }
  }

  const Screen = screens[currentTab]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A2E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '40px 0',
    }}>
      {/* Phone Frame */}
      <div style={{
        boxShadow: '0px 40px 80px rgba(0,0,0,0.6)',
        borderRadius: '40px',
        overflow: 'hidden',
        border: '4px solid #2A2A3E',
        width: '390px',
        height: '844px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Screen onNavigate={handleNavigate} />
      </div>
    </div>
  )
}

export default App
