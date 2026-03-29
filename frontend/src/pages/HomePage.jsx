import { useState } from "react";
import Header from '../components/Header';
import ButtomNav from '../components/ButtomNav';
import TodayAgenda from '../components/TodayAgenda';
import StatsCards from "../components/StatsCards";

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Header userName="Guilherme"></Header>
            <ButtomNav activeTab={activeTab} onTabChange={setActiveTab}></ButtomNav>
            <StatsCards></StatsCards>
            <TodayAgenda></TodayAgenda>

        </div>
    );
};

export default HomePage;