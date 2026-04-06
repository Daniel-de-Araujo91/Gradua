import React from 'react';

const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={active ? '#10305F' : '#9E9E9E'} />
  </svg>
);

const AgendaIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill={active ? '#10305F' : '#9E9E9E'} />
  </svg>
);

const ForumIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill={active ? '#10305F' : '#9E9E9E'} />
  </svg>
);

const PerfilIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={active ? '#10305F' : '#9E9E9E'} />
  </svg>
);

const tabs = [
  { id: 'inicio', label: 'INÍCIO', Icon: HomeIcon },
  { id: 'agenda', label: 'AGENDA', Icon: AgendaIcon },
  { id: 'forum', label: 'FÓRUM', Icon: ForumIcon },
  { id: 'perfil', label: 'PERFIL', Icon: PerfilIcon },
];

const BottomNavBar = ({ activeTab = 'inicio', onNavigate }) => {
  return (
    <nav style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #F0F0F0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0 16px',
      boxShadow: '0px -2px 8px rgba(0,0,0,0.06)',
      flexShrink: 0,
    }}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate && onNavigate(id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: isActive ? '20px' : '0',
              backgroundColor: isActive ? '#E8EEF4' : 'transparent',
            }}
          >
            <Icon active={isActive} />
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? '700' : '500',
              color: isActive ? '#10305F' : '#9E9E9E',
              letterSpacing: '0.5px',
              fontFamily: 'Inter, sans-serif',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
