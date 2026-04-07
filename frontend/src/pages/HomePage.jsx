import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import StatsCards from '../components/StatsCards';
import TodayAgenda from '../components/TodayAgenda';
import Announcements from '../components/Announcements';
import CommunityForum from '../components/CommunityForum';
import MySubjects from '../components/MySubjects';

const HomePage = ({ onNavigate }) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <TopAppBar />
      <main style={{ 
        flex: 1, 
        maxWidth: '600px', 
        width: '100%', 
        margin: '0 auto',
        padding: '16px 0 80px 0'
      }}>
        <StatsCards />
        <TodayAgenda />
        <Announcements />
        <CommunityForum />
        <MySubjects />
      </main>
      <BottomNavBar activeTab="inicio" onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;