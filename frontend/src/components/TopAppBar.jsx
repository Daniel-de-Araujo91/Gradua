import { Bell } from 'lucide-react';
import guilhermeFoto from '../assets/guilherme_perfil.webp';

const TopAppBar = ({ userName = 'Guilherme', showOnlineDot = true }) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      backgroundColor: '#FFFFFF',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      boxSizing: 'border-box',
      borderBottom: '1px solid #F0F0F0',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        position: 'relative',
      }}>
        <Bell size={22} color="#10305F" />
        <span style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#E53935',
        }} />
      </button>
    </header>
  );
};

export default TopAppBar;