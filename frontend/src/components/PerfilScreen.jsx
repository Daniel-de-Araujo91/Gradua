import React from 'react';
import Header from './Header';
import BottomNavBar from './BottomNavBar';
import perfil from '../assets/perfil.webp';
/* -------------------------
   SVG Icons
------------------------- */
const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M17 6h6v6" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const ChevronRightIcon = ({ color = '#10305F' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#10305F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#10305F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10305F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const PasswordIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#10305F" strokeWidth="1.5" fill="none" />
    <path d="M7 11V7a5 5 0 0110 0v4" stroke="#10305F" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const VerifiedBadgeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="14" fill="#10305F" />
    <path d="M8 14l4 4 8-8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* -------------------------
   Sub-components
------------------------- */
const ProfileCard = () => (
  <div style={{
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '24px 20px',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  }}>
    {/* Photo + Badge */}
    <div style={{ position: 'relative', width: '160px', height: '190px' }}>
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#C8E0F4',
      }}>
        <img
          src={perfil}
          alt="Tester"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {/* Verified badge */}
      <div style={{
        position: 'absolute',
        bottom: '-8px',
        right: '-8px',
      }}>
        <VerifiedBadgeIcon />
      </div>
    </div>

    {/* Matricula */}
    <p style={{
      fontSize: '11px',
      fontWeight: '600',
      color: '#9E9E9E',
      letterSpacing: '1.5px',
      margin: 0,
      fontFamily: 'Inter, sans-serif',
      textTransform: 'uppercase',
      marginTop: '8px',
    }}>
      MATRÍCULA: xxxxxxxxx
    </p>

    {/* Name */}
    <h1 style={{
      fontSize: '26px',
      fontWeight: '800',
      color: '#10305F',
      margin: 0,
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center',
      lineHeight: '1.2',
    }}>
      Tester da Silva Santos
    </h1>

    {/* Chips */}
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <span style={{
        backgroundColor: '#E3EBF6',
        color: '#10305F',
        fontSize: '12px',
        fontWeight: '600',
        padding: '6px 14px',
        borderRadius: '20px',
        fontFamily: 'Inter, sans-serif',
      }}>
        Ciência da Computação
      </span>
      <span style={{
        backgroundColor: '#F0F0F0',
        color: '#555555',
        fontSize: '12px',
        fontWeight: '600',
        padding: '6px 14px',
        borderRadius: '20px',
        fontFamily: 'Inter, sans-serif',
      }}>
        8º Semestre
      </span>
    </div>
  </div>
);

const IRACard = () => (
  <div style={{
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px',
    }}>
      <span style={{
        fontSize: '11px',
        fontWeight: '700',
        color: '#9E9E9E',
        letterSpacing: '1.5px',
        fontFamily: 'Inter, sans-serif',
        textTransform: 'uppercase',
      }}>
        IRA GERAL
      </span>
      <TrendingUpIcon />
    </div>

    <p style={{
      fontSize: '60px',
      fontWeight: '900',
      color: '#10305F',
      margin: 0,
      fontFamily: 'Inter, sans-serif',
      lineHeight: '1',
    }}>
      7.5
    </p>

    <p style={{
      fontSize: '13px',
      color: '#757575',
      margin: '8px 0 0',
      fontFamily: 'Inter, sans-serif',
    }}>
      ✨ Top 30% da Turma
    </p>
  </div>
);

const ProgressCard = () => (
  <div style={{
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
  }}>
    <span style={{
      fontSize: '11px',
      fontWeight: '700',
      color: '#9E9E9E',
      letterSpacing: '1.5px',
      fontFamily: 'Inter, sans-serif',
      textTransform: 'uppercase',
    }}>
      PROGRESSO DO CURSO
    </span>

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginTop: '8px',
    }}>
      <p style={{
        fontSize: '24px',
        fontWeight: '800',
        color: '#10305F',
        margin: 0,
        fontFamily: 'Inter, sans-serif',
        lineHeight: '1.2',
      }}>
        Conclusão<br />Total
      </p>
      <p style={{
        fontSize: '36px',
        fontWeight: '900',
        color: '#10305F',
        margin: 0,
        fontFamily: 'Inter, sans-serif',
      }}>
        68%
      </p>
    </div>

    {/* Progress Bar */}
    <div style={{
      marginTop: '12px',
      height: '6px',
      backgroundColor: '#E8EEF4',
      borderRadius: '3px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: '68%',
        height: '100%',
        backgroundColor: '#10305F',
        borderRadius: '3px',
      }} />
    </div>

    {/* Stats */}
    <div style={{
      display: 'flex',
      gap: '24px',
      marginTop: '16px',
    }}>
      <div>
        <p style={{
          fontSize: '10px',
          fontWeight: '700',
          color: '#9E9E9E',
          letterSpacing: '1px',
          margin: '0 0 4px',
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
        }}>
          CRÉDITOS
        </p>
        <p style={{
          fontSize: '18px',
          fontWeight: '800',
          color: '#10305F',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
        }}>
          164 / 240
        </p>
      </div>
      <div>
        <p style={{
          fontSize: '10px',
          fontWeight: '700',
          color: '#9E9E9E',
          letterSpacing: '1px',
          margin: '0 0 4px',
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
        }}>
          HORAS EXT.
        </p>
        <p style={{
          fontSize: '18px',
          fontWeight: '800',
          color: '#10305F',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
        }}>
          90 / 120
        </p>
      </div>
    </div>
  </div>
);

const CentralAlunoItem = ({ icon: Icon, title, subtitle, isRed = false }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
    borderBottom: '1px solid #F5F5F5',
    cursor: 'pointer',
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      backgroundColor: isRed ? '#FDECEA' : '#EEF2F8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon />
    </div>
    <div style={{ flex: 1 }}>
      <p style={{
        fontSize: '15px',
        fontWeight: '700',
        color: isRed ? '#E53935' : '#10305F',
        margin: 0,
        fontFamily: 'Inter, sans-serif',
      }}>
        {title}
      </p>
      <p style={{
        fontSize: '12px',
        color: isRed ? '#EF9A9A' : '#9E9E9E',
        margin: '2px 0 0',
        fontFamily: 'Inter, sans-serif',
      }}>
        {subtitle}
      </p>
    </div>
    <ChevronRightIcon color={isRed ? '#E53935' : '#10305F'} />
  </div>
);

const CentralAlunoCard = () => (
  <div style={{
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '100px',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
  }}>
    <p style={{
      fontSize: '16px',
      fontWeight: '700',
      color: '#10305F',
      margin: '0 0 4px',
      fontFamily: 'Inter, sans-serif',
    }}>
      Central do Aluno
    </p>

    <CentralAlunoItem
      icon={DocumentIcon}
      title="Meus Documentos"
      subtitle="RG, CPF e Comprovante de Residência"
    />
    <CentralAlunoItem
      icon={HistoryIcon}
      title="Histórico Escolar"
      subtitle="Emitir via PDF oficial (assinado digitalmente)"
    />
    <CentralAlunoItem
      icon={PasswordIcon}
      title="Alterar Senha"
      subtitle="Segurança e recuperação de conta"
    />
    <CentralAlunoItem
      icon={LogoutIcon}
      title="Sair"
      subtitle="Encerrar sessão no dispositivo"
      isRed
    />
  </div>
);

/* -------------------------
   Main Component
------------------------- */
const PerfilScreen = ({ onNavigate }) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header />
      <main style={{ flex: 1, maxWidth: '600px', width: '100%', margin: '0 auto', padding: '16px 20px 80px 20px', overflowY: 'auto' }}></main>

      {/* Scrollable Content */}
      <main style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
        <ProfileCard />
        <IRACard />
        <ProgressCard />
        <CentralAlunoCard />
      </main>

      {/* Bottom Nav */}
        <BottomNavBar activeTab="profile" onTabChange={onNavigate} />
    </div>
  );
};

export default PerfilScreen;
