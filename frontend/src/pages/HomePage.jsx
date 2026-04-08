import { useState } from 'react';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import StatsCards from '../components/StatsCards';
import TodayAgenda from '../components/TodayAgenda';
import Announcements from '../components/Announcements';
import CommunityForum from '../components/CommunityForum';
import MySubjects from '../components/MySubjects';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full px-4 pb-24">
        <StatsCards />
        <TodayAgenda />
        <Announcements />
        <CommunityForum />
        <MySubjects />
      </main>
      <BottomNavBar activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};

export default HomePage;