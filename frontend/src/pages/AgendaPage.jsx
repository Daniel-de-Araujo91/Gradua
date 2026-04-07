import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

const AgendaPage = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full px-4 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Minha Agenda</h1>
        <p className="text-gray-500">Conteúdo da agenda em desenvolvimento...</p>
      </main>
      <BottomNavBar activeTab="agenda" onTabChange={onNavigate} />
    </div>
  );
};

export default AgendaPage;