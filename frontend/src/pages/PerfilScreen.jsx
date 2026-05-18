import React from 'react';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import perfil from '../assets/perfil.webp';
import { TrendingUp, ChevronRight, FileText, History, KeyRound, LogOut, CheckCircle2, ShieldAlert } from 'lucide-react';
import { gerarHistoricoEscolar } from '../utils/gerarHistoricoPDF';

/* -------------------------
   Sub-components
------------------------- */
const ProfileCard = () => (
  <div className="bg-white rounded-3xl p-6 mb-4 flex flex-col items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative">
    
    <div className="relative w-32 h-40 sm:w-40 sm:h-48 mb-2">
      <div className="w-full h-full rounded-2xl overflow-hidden bg-orange-50 shadow-inner">
        <img
          src={perfil}
          alt="Foto de Perfil"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5">
        <CheckCircle2 size={28} className="text-gradua-perfil fill-gradua-perfil/10" />
      </div>
    </div>

    <p className="text-[11px] font-bold text-gray-400 tracking-[1.5px] uppercase mt-2">
      MATRÍCULA: xxxxxxxxx
    </p>

    <h1 className="text-2xl sm:text-3xl font-black text-gradua-perfil text-center leading-tight">
      Tester da Silva Santos
    </h1>

    <div className="flex gap-2 flex-wrap justify-center mt-1">
      <span className="bg-gradua-perfil/10 text-gradua-perfil text-xs font-bold px-4 py-1.5 rounded-full">
        Ciência da Computação
      </span>
      <span className="bg-gradua-perfil/10 text-gradua-perfil text-xs font-bold px-4 py-1.5 rounded-full">
        4º Semestre
      </span>
    </div>
  </div>
);

const IRACard = () => (
  <div className="bg-white rounded-3xl p-6 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[11px] font-bold text-gray-400 tracking-[1.5px] uppercase">
        IRA GERAL
      </span>
      <div className="bg-gradua-inicio/10 p-2 rounded-full">
        <TrendingUp size={18} className="text-gradua-inicio" />
      </div>
    </div>

    <p className="text-6xl font-black text-gradua-perfil leading-none tracking-tight">
      7.5
    </p>

    <p className="text-sm font-semibold text-gray-500 mt-3 flex items-center gap-1.5">
      <span className="text-amber-500">✨</span> Top 30% da Turma
    </p>
  </div>
);

const ProgressCard = () => (
  <div className="bg-white rounded-3xl p-6 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50">
    <span className="text-[11px] font-bold text-gray-400 tracking-[1.5px] uppercase block mb-3">
      PROGRESSO DO CURSO
    </span>

    <div className="flex justify-between items-end mb-3">
      <p className="text-xl sm:text-2xl font-black text-gradua-perfil leading-tight">
        Conclusão Total
      </p>
      <p className="text-4xl font-black text-gradua-perfil leading-none">
        68%
      </p>
    </div>

    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-5">
      <div className="h-full bg-gradua-perfil rounded-full transition-all duration-500" style={{ width: '68%' }} />
    </div>

    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
      <div>
        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
          CRÉDITOS
        </p>
        <p className="text-lg font-black text-gradua-perfil">
          164 / 240
        </p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
          HORAS EXT.
        </p>
        <p className="text-lg font-black text-gradua-perfil">
          90 / 120
        </p>
      </div>
    </div>
  </div>
);

const CentralAlunoItem = ({ icon: Icon, title, subtitle, isRed = false, onClick }) => (
  <div 
    className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 cursor-pointer group"
    onClick={onClick}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isRed ? 'bg-red-50 group-hover:bg-red-100' : 'bg-gradua-perfil/5 group-hover:bg-gradua-perfil/10'}`}>
      <Icon size={20} className={isRed ? 'text-red-500' : 'text-gradua-perfil'} />
    </div>
    <div className="flex-1">
      <p className={`text-base font-bold m-0 ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {title}
      </p>
      <p className={`text-xs mt-0.5 font-medium ${isRed ? 'text-red-400' : 'text-gray-500'}`}>
        {subtitle}
      </p>
    </div>
    <ChevronRight size={20} className={isRed ? 'text-red-400' : 'text-gray-400'} />
  </div>
);

const CentralAlunoCard = ({ onNavigate }) => (
  <div className="bg-white rounded-3xl p-6 mb-28 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50">
    <h3 className="text-lg font-black text-gradua-perfil mb-2">
      Central do Aluno
    </h3>

    <div className="flex flex-col">
        <CentralAlunoItem icon={FileText} title="Meus Documentos" subtitle="RG, CPF e Comprovante de Residência" onClick={() => onNavigate('documentos')} />
        <CentralAlunoItem icon={History} title="Histórico Escolar" subtitle="Emitir via PDF oficial" onClick={gerarHistoricoEscolar} />
        <CentralAlunoItem icon={KeyRound} title="Alterar Senha" subtitle="Segurança e recuperação de conta" />
        <CentralAlunoItem 
          icon={ShieldAlert} 
          title="Painel Administrativo" 
          subtitle="Moderação de conteúdo e avisos docentes" 
          onClick={() => onNavigate('admin')}/>
        <CentralAlunoItem 
          icon={LogOut} 
          title="Sair da Conta" 
          subtitle="Encerrar sessão no dispositivo" 
          isRed 
          onClick={() => onNavigate('login')}
        />
    </div>
  </div>
);

/* -------------------------
   Main Component
------------------------- */
const PerfilScreen = ({ onNavigate, activeTab }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header onNavigate={onNavigate} activeTab='profile' />

      <main className="flex-1 px-4 py-5 overflow-y-auto">
        <ProfileCard />
        <IRACard />
        <ProgressCard />
        <CentralAlunoCard onNavigate={onNavigate} />
      </main>

      <BottomNavBar activeTab="profile" onTabChange={onNavigate} />
    </div>
  );
};

export default PerfilScreen;