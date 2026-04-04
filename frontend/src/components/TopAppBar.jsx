import React from 'react';
import guilhermeFoto from '../assets/guilherme_perfil.webp';

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="#10305F" />
  </svg>
);

const TopAppBar = ({ userName = 'Guilherme', avatarInitials = 'G', showOnlineDot = true }) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      backgroundColor: '#FFFFFF',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Avatar + Dot */}
      <div style={{ position: 'relative', width: '44px', height: '44px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#D4A574',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={guilhermeFoto}
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        {showOnlineDot && (
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '11px',
            height: '11px',
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            border: '2px solid #FFFFFF',
          }} />
        )}
      </div>

      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#10305F',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.5px',
        }}>
          UFAL SIGAA
        </span>
      </div>

      {/* Bell */}
      <button style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <BellIcon />
      </button>
    </header>
  );
};

export default TopAppBar;
