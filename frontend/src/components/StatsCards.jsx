import { TrendingUp } from 'lucide-react';

const StatsCards = () => {
    return (
        <div className="grid grid-cols-2 gap-4 px-4 py-4 mb-6">
            <div className="group relative bg-gradient-to-br from-white via-white to-white border border-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10" />
                <p className="text-sm font-semibold text-gradua-inicio uppercase tracking-wide mb-2 z-10 relative">IRA GERAL</p>
                <p className="text-4xl font-black text-gradua-inicio mb-1.5 z-10 relative leading-tight">7.5</p>
                <div className="flex items-center gap-1 text-xs font-medium text-gradua-inicio z-10 relative">
                    <TrendingUp size={14} className="text-green/50" />
                    <span>+0.4 este semestre</span>
                </div>
            </div>
            <div className="group relative bg-gradient-to-br from-white via-white to-white border border-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10" />
                <div className="relative z-10">
                    <p className="text-sm font-semibold text-gradua-inicio uppercase tracking-wide mb-2">INTEGRALIZAÇÃO</p>
                    <p className="text-4xl font-black text-gradua-inicio mb-3 leading-tight">68%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-gradua-inicio to-gradua-inicio/70 h-2.5 rounded-full transition-all duration-300 group-hover:w-[72%]" style={{ width: '68%' }} />
                    </div>
                    <p className="text-sm font-semibold text-gradua-inicio mt-2">840h pendentes</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;