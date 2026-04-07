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
      width: '390px',
      height: '100%',
      backgroundColor: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <TopAppBar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
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