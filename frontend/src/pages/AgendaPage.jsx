import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';

const AgendaPage = ({ onNavigate }) => {
  return (
    <div style={{
      width: '390px',
      height: '100%',
      backgroundColor: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <TopAppBar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#10305F',
          marginBottom: '20px',
        }}>
          Minha Agenda
        </h1>
        <p style={{ color: '#9E9E9E' }}>Conteúdo da agenda em desenvolvimento...</p>
      </main>
      <BottomNavBar activeTab="agenda" onNavigate={onNavigate} />
    </div>
  );
};

export default AgendaPage;