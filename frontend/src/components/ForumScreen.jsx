import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import BottomNavBar from './BottomNavBar';
import { ArrowUp, ArrowDown, MessageCircle, Search, Plus, BookOpen, Bell, Lightbulb, CalendarDays, X } from 'lucide-react';

/* ─────────────────────────────────────────
   Dados dos posts — cada post tem um campo
   "category" que corresponde aos filtros.
───────────────────────────────────────── */
const INITIAL_POSTS = [
  {
    id: 1,
    avatar: 'beatriz-oliveira',
    name: 'Beatriz Oliveira',
    meta: '7º SEMESTRE • MACEIÓ',
    time: 'Há 2 horas',
    title: 'Dicas para a prova final de Estrutura de Dados II',
    content:
      'Pessoal, alguém tem resumos sobre Árvores B+ e Grafos direcionados? A prova do Prof. Ricardo está chegando e o conteúdo de Red-Black Trees ainda está um pouco nebuloso...',
    likes: 24,
    dislikes: 2,
    comments: 12,
    tag: 'PERGUNTAS',
    tagVariant: 'perguntas',
    category: 'perguntas',
    featured: false,
  },
  {
    id: 2,
    avatar: 'lucas-ferreira',
    name: 'Lucas Ferreira',
    meta: '4º SEMESTRE • MACEIÓ',
    time: 'Há 5 horas',
    title: 'Grupo de estudos para Redes de Computadores',
    content:
      'Estamos montando um grupo para praticar configuração de roteadores e subnets. Quem tiver interesse, vamos nos reunir na biblioteca central quarta-feira às 14h.',
    likes: 15,
    dislikes: 0,
    comments: 8,
    tag: 'AVISOS',
    tagVariant: 'avisos',
    category: 'avisos',
    featured: false,
  },
  {
    id: 3,
    avatar: 'coordenacao',
    name: 'Coordenação do Curso',
    meta: 'MACEIÓ • INSTITUCIONAL',
    time: 'Ontem',
    title: 'Vaga de estágio no polo tecnológico',
    content:
      'Abertura de seleção para estágio em Desenvolvimento Web (React/Node). Necessário estar cursando a partir do 5º semestre. Bolsa auxílio compatível com o mercado + benefícios.',
    likes: 56,
    dislikes: 1,
    comments: 31,
    tag: 'DESTAQUE',
    tagVariant: 'destaque',
    category: 'destaque',
    featured: true,
  },
];

/* ─────────────────────────────────────────
   Category Tag
───────────────────────────────────────── */
const CategoryTag = ({ label, variant }) => {
  const styles = {
    perguntas: { bg: '#E8F5E9', color: '#2E7D32' },
    avisos: { bg: '#E3F2FD', color: '#1565C0' },
    destaque: { bg: '#10305F', color: '#FFFFFF' },
  };
  const s = styles[variant] || { bg: '#E0E0E0', color: '#424242' };

  return (
    <span
      style={{
        backgroundColor: s.bg,
        color: s.color,
        fontSize: '11px',
        fontWeight: '700',
        padding: '4px 12px',
        borderRadius: '20px',
        letterSpacing: '0.5px',
        fontFamily: 'Inter, sans-serif',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
};

/* ─────────────────────────────────────────
   Post Card
───────────────────────────────────────── */
const PostCard = ({
  avatar, name, meta, time, title, content,
  initialLikes, initialDislikes = 0, comments,
  tag, tagVariant, featured = false,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState(null);

  const handleVote = (voteType) => {
    if (voteType === 'up') {
      if (userVote === 'up') { setLikes(l => l - 1); setUserVote(null); }
      else { setLikes(l => l + 1); if (userVote === 'down') setDislikes(d => d - 1); setUserVote('up'); }
    } else {
      if (userVote === 'down') { setDislikes(d => d - 1); setUserVote(null); }
      else { setDislikes(d => d + 1); if (userVote === 'up') setLikes(l => l - 1); setUserVote('down'); }
    }
  };

  const bg = featured ? '#10305F' : '#FFFFFF';
  const textColor = featured ? '#FFFFFF' : '#10305F';
  const subColor = featured ? 'rgba(255,255,255,0.7)' : '#9E9E9E';
  const contentColor = featured ? 'rgba(255,255,255,0.85)' : '#424242';

  return (
    <div
      style={{
        backgroundColor: bg,
        borderRadius: '20px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: featured ? 'none' : '0px 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#D4A574', flexShrink: 0 }}>
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${avatar}&backgroundColor=b6e3f4`}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: textColor, margin: 0, fontFamily: 'Inter, sans-serif' }}>{name}</p>
            <p style={{ fontSize: '11px', color: subColor, margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: '500' }}>{meta}</p>
          </div>
        </div>
        <span style={{ fontSize: '11px', color: subColor, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>{time}</span>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: textColor, margin: '0 0 8px', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>{title}</h3>

      {/* Content */}
      <p style={{ fontSize: '13px', color: contentColor, margin: '0 0 14px', fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>{content}</p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => handleVote('up')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', color: userVote === 'up' ? '#4CAF50' : subColor, fontWeight: userVote === 'up' ? '700' : '600' }}
            >
              <ArrowUp size={16} strokeWidth={userVote === 'up' ? 3 : 2} />
              <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{likes}</span>
            </button>
            <button
              onClick={() => handleVote('down')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', color: userVote === 'down' ? '#F44336' : subColor, fontWeight: userVote === 'down' ? '700' : '600' }}
            >
              <ArrowDown size={16} strokeWidth={userVote === 'down' ? 3 : 2} />
              <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{dislikes}</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: subColor }}>
            <MessageCircle size={16} />
            <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>{comments}</span>
          </div>
        </div>
        <CategoryTag label={tag} variant={tagVariant} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Card de Adição — baseado no Figma node 118-2
   "card_forum": card de criação de postagem
───────────────────────────────────────── */
const CARD_CATEGORIES = [
  { id: 'pergunta', label: 'Pergunta', icon: BookOpen },
  { id: 'aviso', label: 'Aviso', icon: Bell },
  { id: 'dica', label: 'Dica', icon: Lightbulb },
  { id: 'evento', label: 'Evento', icon: CalendarDays },
];

const AddPostCard = ({ onPublish }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [postText, setPostText] = useState('');

  const handleClose = () => {
    setIsExpanded(false);
    setSelectedCategory(null);
    setPostText('');
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1.5px dashed #B0BEC5',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: isExpanded ? 'default' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!isExpanded) e.currentTarget.style.borderColor = '#10305F';
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) e.currentTarget.style.borderColor = '#B0BEC5';
      }}
      onClick={() => { if (!isExpanded) setIsExpanded(true); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !isExpanded) setIsExpanded(true); }}
    >
      {/* Linha do avatar + prompt / header expandido */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
        {/* Avatar do usuário atual (seed fixo) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, backgroundColor: '#E8EEF4' }}>
            <img
              src="https://api.dicebear.com/7.x/personas/svg?seed=usuario-atual&backgroundColor=b6e3f4"
              alt="Você"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {!isExpanded ? (
            /* Estado colapsado — prompt clicável */
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <span style={{ fontSize: '14px', color: '#9E9E9E', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                Compartilhe algo com a turma...
              </span>
            </div>
          ) : (
            /* Estado expandido — título */
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#10305F', margin: 0, fontFamily: 'Inter, sans-serif' }}>
              Criar Postagem
            </p>
          )}
        </div>

        {isExpanded ? (
          /* Botão fechar */
          <button
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E9E9E', padding: '4px', display: 'flex', alignItems: 'center', borderRadius: '8px' }}
          >
            <X size={18} />
          </button>
        ) : (
          /* Ícone de plus colapsado */
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#10305F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <div style={{ marginTop: '16px' }}>
          {/* Seleção de categorias */}
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#9E9E9E', margin: '0 0 8px', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Categoria
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CARD_CATEGORIES.map(({ id, label, icon: Icon }) => {
                const isSelected = selectedCategory === id;
                return (
                  <button
                    key={id}
                    onClick={(e) => { e.stopPropagation(); setSelectedCategory(isSelected ? null : id); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '50px',
                      border: isSelected ? '1.5px solid #10305F' : '1.5px solid #E0E0E0',
                      backgroundColor: isSelected ? '#10305F' : '#F5F5F5',
                      color: isSelected ? '#FFFFFF' : '#424242',
                      fontSize: '12px',
                      fontWeight: '600',
                      fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={14} strokeWidth={2} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área de texto */}
          <textarea
            placeholder="O que você quer compartilhar com a turma?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1.5px solid #E0E0E0',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#10305F',
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              lineHeight: '1.6',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#10305F'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; }}
          />

          {/* Botão publicar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!postText.trim()) return;
              const categoryMap = {
                pergunta: { tag: 'PERGUNTAS', tagVariant: 'perguntas', category: 'perguntas' },
                aviso:    { tag: 'AVISOS',    tagVariant: 'avisos',    category: 'avisos'    },
                dica:     { tag: 'DICAS',     tagVariant: 'perguntas', category: 'perguntas' },
                evento:   { tag: 'EVENTOS',   tagVariant: 'avisos',    category: 'avisos'    },
              };
              const cat = categoryMap[selectedCategory] || { tag: 'PERGUNTAS', tagVariant: 'perguntas', category: 'perguntas' };
              onPublish({
                id: Date.now(),
                avatar: 'usuario-atual',
                name: 'Você',
                meta: 'ESTUDANTE • MACEIÓ',
                time: 'Agora mesmo',
                title: postText.trim().split('\n')[0] || postText.trim(),
                content: postText.trim(),
                likes: 0,
                dislikes: 0,
                comments: 0,
                tag: cat.tag,
                tagVariant: cat.tagVariant,
                category: cat.category,
                featured: false,
              });
              handleClose();
            }}
            disabled={!postText.trim()}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: postText.trim() ? '#10305F' : '#E8EEF4',
              color: postText.trim() ? '#FFFFFF' : '#9E9E9E',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Inter, sans-serif',
              border: 'none',
              cursor: postText.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
            }}
          >
            Publicar
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Estado vazio (sem resultados)
───────────────────────────────────────── */
const EmptyState = ({ query, filter }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px',
      gap: '12px',
      textAlign: 'center',
    }}
  >
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#E8EEF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Search size={28} color="#B0BEC5" strokeWidth={1.5} />
    </div>
    <p style={{ fontSize: '16px', fontWeight: '700', color: '#10305F', margin: 0, fontFamily: 'Inter, sans-serif' }}>
      Nenhum resultado encontrado
    </p>
    <p style={{ fontSize: '13px', color: '#9E9E9E', margin: 0, fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
      {query
        ? `Não encontramos posts com "${query}".`
        : `Não há posts na categoria "${filter}".`}
      <br />
      Tente ajustar o filtro ou o termo de busca.
    </p>
  </div>
);

/* ─────────────────────────────────────────
   Main Component — ForumScreen
───────────────────────────────────────── */
const STORAGE_KEY = 'forum_posts_v1';

const ForumScreen = ({ onNavigate }) => {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Persiste no localStorage sempre que a lista mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch { /* quota excedida — ignora */ }
  }, [posts]);

  const handlePublish = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const filters = [
    { id: 'todos', label: 'Todos os Tópicos' },
    { id: 'perguntas', label: 'Perguntas' },
    { id: 'avisos', label: 'Avisos' },
    { id: 'destaque', label: 'Destaque' },
  ];

  /* ── Lógica de filtragem reativa ── */
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeFilter === 'todos' || post.category === activeFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.name.toLowerCase().includes(q) ||
        post.tag.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [posts, activeFilter, searchQuery]);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header onNavigate={onNavigate} />

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

        {/* Title Section */}
        <div style={{ padding: '16px 20px 0' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#10305F',
              margin: '0 0 4px',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.2',
            }}
          >
            Fórum de Ciência da Computação
          </h1>
          <p style={{ fontSize: '13px', color: '#9E9E9E', margin: '0 0 16px', fontFamily: 'Inter, sans-serif' }}>
            Comunidade acadêmica • Maceió
          </p>

          {/* ── Campo de busca ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '11px 16px',
              border: '1.5px solid #E0E0E0',
              marginBottom: '14px',
              transition: 'border-color 0.15s ease',
            }}
            onFocusCapture={(e) => { e.currentTarget.style.borderColor = '#10305F'; }}
            onBlurCapture={(e) => { e.currentTarget.style.borderColor = '#E0E0E0'; }}
          >
            <Search size={18} color="#9E9E9E" strokeWidth={2} style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Buscar posts, autores, tópicos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                color: '#10305F',
                backgroundColor: 'transparent',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9E9E9E', display: 'flex', alignItems: 'center' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* ── Filtros de categoria ── */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              marginBottom: '16px',
            }}
          >
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

          {/* Card de adição — aparece apenas em "Todos os Tópicos" */}
          {activeFilter === 'todos' && !searchQuery && <AddPostCard onPublish={handlePublish} />}

          {/* Lista filtrada */}
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                avatar={post.avatar}
                name={post.name}
                meta={post.meta}
                time={post.time}
                title={post.title}
                content={post.content}
                initialLikes={post.likes}
                initialDislikes={post.dislikes}
                comments={post.comments}
                tag={post.tag}
                tagVariant={post.tagVariant}
                featured={post.featured}
              />
            ))
          ) : (
            <EmptyState
              query={searchQuery}
              filter={filters.find((f) => f.id === activeFilter)?.label}
            />
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNavBar activeTab="forum" onTabChange={onNavigate} />
    </div>
  );
};

export default ForumScreen;