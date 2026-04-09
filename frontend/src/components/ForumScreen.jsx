import React, { useState } from 'react';
import Header from './Header';
import BottomNavBar from './BottomNavBar';
import { ArrowUp, ArrowDown, MessageCircle } from 'lucide-react';

/* -------------------------
   Post Category Tag
------------------------- */
const CategoryTag = ({ label, variant }) => {
  const styles = {
    perguntas: { bg: '#E8F5E9', color: '#2E7D32' },
    avisos: { bg: '#E3F2FD', color: '#1565C0' },
    destaque: { bg: '#10305F', color: '#FFFFFF' },
  };
  const s = styles[variant] || { bg: '#E0E0E0', color: '#424242' };

  return (
    <span style={{
      backgroundColor: s.bg,
      color: s.color,
      fontSize: '11px',
      fontWeight: '700',
      padding: '4px 12px',
      borderRadius: '20px',
      letterSpacing: '0.5px',
      fontFamily: 'Inter, sans-serif',
      textTransform: 'uppercase',
    }}>
      {label}
    </span>
  );
};

/* -------------------------
   Post Card
------------------------- */
const PostCard = ({
  avatar,
  name,
  meta,
  time,
  title,
  content,
  initialLikes,
  initialDislikes = 0,
  comments,
  tag,
  tagVariant,
  featured = false,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState(null); 

  const handleVote = (voteType) => {
    if (voteType === 'up') {
      if (userVote === 'up') {
        setLikes(likes - 1);
        setUserVote(null);
      } else {
        setLikes(likes + 1);
        if (userVote === 'down') setDislikes(dislikes - 1);
        setUserVote('up');
      }
    } else {
      if (userVote === 'down') {
        setDislikes(dislikes - 1);
        setUserVote(null);
      } else {
        setDislikes(dislikes + 1);
        if (userVote === 'up') setLikes(likes - 1);
        setUserVote('down');
      }
    }
  };

  const bg = featured ? '#10305F' : '#FFFFFF';
  const textColor = featured ? '#FFFFFF' : '#10305F';
  const subColor = featured ? 'rgba(255,255,255,0.7)' : '#9E9E9E';
  const contentColor = featured ? 'rgba(255,255,255,0.85)' : '#424242';

  return (
    <div style={{
      backgroundColor: bg,
      borderRadius: '20px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: featured ? 'none' : '0px 2px 8px rgba(0,0,0,0.05)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#D4A574',
            flexShrink: 0,
          }}>
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${avatar}&backgroundColor=b6e3f4`}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          {/* Name + Meta */}
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: '700',
              color: textColor,
              margin: 0,
              fontFamily: 'Inter, sans-serif',
            }}>
              {name}
            </p>
            <p style={{
              fontSize: '11px',
              color: subColor,
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontWeight: '500',
            }}>
              {meta}
            </p>
          </div>
        </div>

        {/* Time */}
        <span style={{
          fontSize: '11px',
          color: subColor,
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
        }}>
          {time}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '16px',
        fontWeight: '700',
        color: textColor,
        margin: '0 0 8px',
        fontFamily: 'Inter, sans-serif',
        lineHeight: '1.4',
      }}>
        {title}
      </h3>

      {/* Content */}
      <p style={{
        fontSize: '13px',
        color: contentColor,
        margin: '0 0 14px',
        fontFamily: 'Inter, sans-serif',
        lineHeight: '1.6',
      }}>
        {content}
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Interactions */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          
          {/* Votos (Up/Down) */}
          <div style={{ display: 'flex', gap: '12px' }}>
             <button 
                onClick={() => handleVote('up')}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  color: userVote === 'up' ? '#4CAF50' : subColor,
                  fontWeight: userVote === 'up' ? '700' : '600'
                }}>
                <ArrowUp size={16} strokeWidth={userVote === 'up' ? 3 : 2} />
                <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{likes}</span>
             </button>

             <button 
                onClick={() => handleVote('down')}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  color: userVote === 'down' ? '#F44336' : subColor,
                  fontWeight: userVote === 'down' ? '700' : '600'
                }}>
                <ArrowDown size={16} strokeWidth={userVote === 'down' ? 3 : 2} />
                <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{dislikes}</span>
             </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: subColor }}>
            <MessageCircle size={16} />
            <span style={{
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
            }}>
              {comments}
            </span>
          </div>
        </div>

        {/* Tag */}
        <CategoryTag label={tag} variant={tagVariant} />
      </div>
    </div>
  );
};

/* -------------------------
   Floating Action Button
------------------------- */
const PlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const FAB = () => (
  <button style={{
    position: 'fixed', 
    bottom: '90px',    
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#10305F',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 16px rgba(16, 48, 95, 0.4)',
    zIndex: 50,
  }}>
    <PlusIcon />
  </button>
);

/* -------------------------
   Main Component
------------------------- */
const ForumScreen = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const filters = [
      { id: 'todos', label: 'Todos os Tópicos' },
      { id: 'perguntas', label: 'Perguntas' },
      { id: 'avisos', label: 'Avisos' },
    ];

    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Header onNavigate={onNavigate} />

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* Title Section */}
        <div style={{ padding: '16px 20px 0' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#10305F',
            margin: '0 0 4px',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.2',
          }}>
            Fórum de Ciência da Computação
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#9E9E9E',
            margin: '0 0 20px',
            fontFamily: 'Inter, sans-serif',
          }}>
            Comunidade acadêmica • Maceió
          </p>

          {/* Filters */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            marginBottom: '16px',
          }}>
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    backgroundColor: isActive ? '#10305F' : '#E8EEF4',
                    color: isActive ? '#FFFFFF' : '#10305F',
                    fontSize: '13px',
                    fontWeight: '600',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts Feed */}
        <div style={{ padding: '0 20px', paddingBottom: '120px' }}>
          <PostCard
            avatar="beatriz-oliveira"
            name="Beatriz Oliveira"
            meta="7º SEMESTRE • MACEIÓ"
            time="Há 2 horas"
            title="Dicas para a prova final de Estrutura de Dados II"
            content="Pessoal, alguém tem resumos sobre Árvores B+ e Grafos direcionados? A prova do Prof. Ricardo está chegando e o conteúdo de Red-Black Trees ainda está um pouco nebuloso..."
            initialLikes={24}
            initialDislikes={2}
            comments={12}
            tag="PERGUNTAS"
            tagVariant="perguntas"
          />

          <PostCard
            avatar="lucas-ferreira"
            name="Lucas Ferreira"
            meta="4º SEMESTRE • MACEIÓ"
            time="Há 5 horas"
            title="Grupo de estudos para Redes de Computadores"
            content="Estamos montando um grupo para praticar configuração de roteadores e subnets. Quem tiver interesse, vamos nos reunir na biblioteca central quarta-feira às 14h."
            initialLikes={15}
            initialDislikes={0}
            comments={8}
            tag="AVISOS"
            tagVariant="avisos"
          />

          <PostCard
            avatar="coordenacao"
            name="Coordenação do Curso"
            meta="MACEIÓ • INSTITUCIONAL"
            time="Ontem"
            title="Vaga de estágio no polo tecnológico"
            content="Abertura de seleção para estágio em Desenvolvimento Web (React/Node). Necessário estar cursando a partir do 5º semestre. Bolsa auxílio compatível com o mercado + benefícios."
            initialLikes={56}
            initialDislikes={1}
            comments={31}
            tag="DESTAQUE"
            tagVariant="destaque"
            featured={true}
          />
        </div>

      </div>
      
      {/* FAB */}
      <FAB />

      {/* Bottom Nav */}
        <BottomNavBar activeTab="forum" onTabChange={onNavigate} />
    </div>
  );
};

export default ForumScreen;