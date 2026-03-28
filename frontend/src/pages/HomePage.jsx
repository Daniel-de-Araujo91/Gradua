import { useState } from "react";
import Header from '../components/Header';
import ButtomNav from '../components/ButtomNav';

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Header userName="Guilherme"></Header>
            <ButtomNav activeTab={activeTab} onTabChange={setActiveTab}></ButtomNav>

        </div>
    );
};

export default HomePage;