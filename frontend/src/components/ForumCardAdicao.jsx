import React, { useState } from 'react';
import guilhermeFoto from '../assets/guilherme_perfil.webp';

/* -----------------------------------------------
   SVG Icons (Lucide-compatible inline)
----------------------------------------------- */
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="#10305F" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9E9E9E" strokeWidth="1.8" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="#9E9E9E" />
    <path d="M21 15l-5-5L5 21" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <line x1="8" y1="6" x2="21" y2="6" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="8" y1="12" x2="21" y2="12" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="8" y1="18" x2="21" y2="18" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="3" cy="6" r="1.2" fill="#9E9E9E" />
    <circle cx="3" cy="12" r="1.2" fill="#9E9E9E" />
    <circle cx="3" cy="18" r="1.2" fill="#9E9E9E" />
  </svg>
);

const BoldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M6 4h8a4 4 0 010 8H6V4zM6 12h9a4 4 0 010 8H6V12z" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="1.5" fill="#9E9E9E" />
    <circle cx="12" cy="12" r="1.5" fill="#9E9E9E" />
    <circle cx="19" cy="12" r="1.5" fill="#9E9E9E" />
  </svg>
);

/* -----------------------------------------------
   Category Chip
----------------------------------------------- */
const CategoryChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: active ? '#10305F' : '#F0F2F5',
      color: active ? '#FFFFFF' : '#10305F',
      fontSize: '13px',
      fontWeight: '600',
      padding: '8px 18px',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      transition: 'all 0.15s ease',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </button>
);

/* -----------------------------------------------
   ForumCardAdicao — Modal de Criação de Postagem
----------------------------------------------- */
const ForumCardAdicao = ({ onClose, onPublish }) => {
  const [selectedCategory, setSelectedCategory] = useState('Pergunta');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const categories = ['Pergunta', 'Aviso', 'Dica', 'Evento'];
  const MAX_CHARS = 2000;
  const charCount = body.length;

  const handlePublish = () => {
    if (!title.trim()) return;
    onPublish?.({
      category: selectedCategory,
      title: title.trim(),
      body: body.trim(),
    });
    onClose?.();
  };

  return (
    /* Overlay backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Sheet panel — stopPropagation para não fechar ao clicar dentro */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px 24px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          /* altura máxima para não sair da tela */
          maxHeight: 'calc(100% - 60px)',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #F0F2F5',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F2F5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <XIcon />
          </button>

          <span
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#10305F',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Criar Postagem
          </span>

          <button
            onClick={handlePublish}
            style={{
              backgroundColor: title.trim() ? '#10305F' : '#C5D2E0',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '700',
              padding: '10px 22px',
              borderRadius: '50px',
              border: 'none',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.2s ease',
            }}
          >
            Publicar
          </button>
        </div>

        {/* ── User Info ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px 12px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={guilhermeFoto}
              alt="Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#10305F',
                margin: 0,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Guilherme Novais
            </p>
            <p
              style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#9E9E9E',
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Estudante de Ciência da Computação
            </p>
          </div>
        </div>

        {/* ── Category Selection ── */}
        <div style={{ padding: '0 20px 16px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9E9E9E',
              margin: '0 0 10px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
            }}
          >
            Selecione uma categoria
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </div>

        {/* ── Text Inputs ── */}
        <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }}>
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que você quer compartilhar?"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '18px',
              fontWeight: '700',
              color: '#10305F',
              fontFamily: 'Inter, sans-serif',
              placeholder: '#BDBDBD',
              backgroundColor: 'transparent',
              marginBottom: '12px',
              boxSizing: 'border-box',
            }}
          />
          {/* Body textarea */}
          <textarea
            value={body}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setBody(e.target.value);
            }}
            placeholder="Escreva aqui os detalhes da sua postagem..."
            rows={5}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontWeight: '400',
              color: '#424242',
              fontFamily: 'Inter, sans-serif',
              backgroundColor: 'transparent',
              resize: 'none',
              lineHeight: '1.6',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* ── Toolbar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderTop: '1px solid #F0F2F5',
          }}
        >
          {/* Icon actions */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {[ImageIcon, LinkIcon, ListIcon, BoldIcon].map((Icon, i) => (
              <button
                key={i}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F2F5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Icon />
              </button>
            ))}
          </div>

          {/* Right side: char count + more */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '12px',
                color: charCount > MAX_CHARS * 0.9 ? '#E53935' : '#9E9E9E',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '500',
              }}
            >
              {charCount} / {MAX_CHARS}
            </span>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MoreIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumCardAdicao;
