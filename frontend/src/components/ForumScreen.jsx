import React, { useState, useMemo } from 'react';
import TopAppBar from './TopAppBar';
import BottomNavBar from './BottomNavBar';
import ForumCardAdicao from './ForumCardAdicao';

/* -----------------------------------------------
   SVG Icons
----------------------------------------------- */
const HeartIcon = ({ filled = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
      stroke={filled ? '#E53935' : '#9E9E9E'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? '#E53935' : 'none'}
    />
  </svg>
);

const CommentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
      stroke="#9E9E9E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="#9E9E9E" strokeWidth="1.8" />
    <path d="M21 21l-4.35-4.35" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* -----------------------------------------------
   Category Tag Badge
----------------------------------------------- */
const CategoryTag = ({ label, variant }) => {
  const styles = {
    perguntas: { bg: '#E8F5E9', color: '#2E7D32' },
    pergunta:  { bg: '#E8F5E9', color: '#2E7D32' },
    avisos:    { bg: '#E3F2FD', color: '#1565C0' },
    aviso:     { bg: '#E3F2FD', color: '#1565C0' },
    destaque:  { bg: '#10305F', color: '#FFFFFF' },
    dicas:     { bg: '#FFF8E1', color: '#F57F17' },
    dica:      { bg: '#FFF8E1', color: '#F57F17' },
    eventos:   { bg: '#FCE4EC', color: '#AD1457' },
    evento:    { bg: '#FCE4EC', color: '#AD1457' },
  };
  const s = styles[variant?.toLowerCase()] || { bg: '#E0E0E0', color: '#424242' };

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
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
};

/* -----------------------------------------------
   Post Card
----------------------------------------------- */
const PostCard = ({ avatar, name, meta, time, title, content, likes, comments, tag, tagVariant, featured = false }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const bg          = featured ? '#10305F' : '#FFFFFF';
  const textColor   = featured ? '#FFFFFF'  : '#10305F';
  const subColor    = featured ? 'rgba(255,255,255,0.7)' : '#9E9E9E';
  const contentColor= featured ? 'rgba(255,255,255,0.85)' : '#424242';

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => prev ? c - 1 : c + 1);
      return !prev;
    });
  };

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
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#D4A574',
              flexShrink: 0,
            }}
          >
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${avatar}&backgroundColor=b6e3f4`}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: textColor, margin: 0, fontFamily: 'Inter, sans-serif' }}>
              {name}
            </p>
            <p style={{ fontSize: '11px', color: subColor, margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: '500' }}>
              {meta}
            </p>
          </div>
        </div>
        <span style={{ fontSize: '11px', color: subColor, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
          {time}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: textColor, margin: '0 0 8px', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
        {title}
      </h3>

      {/* Content */}
      <p style={{ fontSize: '13px', color: contentColor, margin: '0 0 14px', fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
        {content}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={handleLike}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <HeartIcon filled={liked} />
            <span style={{ fontSize: '13px', color: liked ? '#E53935' : subColor, fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
              {likeCount}
            </span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CommentIcon />
            <span style={{ fontSize: '13px', color: subColor, fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
              {comments}
            </span>
          </div>
        </div>
        <CategoryTag label={tag} variant={tagVariant} />
      </div>
    </div>
  );
};

/* -----------------------------------------------
   Filter Chips (círculo/pill, estilo Figma)
----------------------------------------------- */
const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: active ? '#10305F' : '#E8EEF4',
      color: active ? '#FFFFFF' : '#10305F',
      fontSize: '13px',
      fontWeight: '600',
      padding: '10px 18px',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontFamily: 'Inter, sans-serif',
      transition: 'all 0.15s ease',
    }}
  >
    {label}
  </button>
);

/* -----------------------------------------------
   Empty State
----------------------------------------------- */
const EmptyState = ({ query }) => (
  <div style={{ textAlign: 'center', padding: '48px 20px' }}>
    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
    <p style={{ fontSize: '16px', fontWeight: '700', color: '#10305F', margin: '0 0 6px', fontFamily: 'Inter, sans-serif' }}>
      Nenhum resultado encontrado
    </p>
    <p style={{ fontSize: '13px', color: '#9E9E9E', margin: 0, fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
      {query
        ? `Não encontramos postagens com "${query}".`
        : 'Não há postagens nesta categoria ainda.'}
    </p>
  </div>
);

/* -----------------------------------------------
   Static Posts Data
----------------------------------------------- */
const ALL_POSTS = [
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
    comments: 12,
    tag: 'PERGUNTAS',
    tagVariant: 'pergunta',
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
    comments: 8,
    tag: 'AVISOS',
    tagVariant: 'aviso',
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
    comments: 31,
    tag: 'DESTAQUE',
    tagVariant: 'destaque',
    featured: true,
  },
  {
    id: 4,
    avatar: 'ana-lima',
    name: 'Ana Lima',
    meta: '6º SEMESTRE • MACEIÓ',
    time: 'Há 1 dia',
    title: 'Dica: extensão VSCode para revisar Pull Requests',
    content:
      'Descobri uma extensão incrível que permite revisar PRs diretamente no VSCode sem precisar abrir o navegador. Muito útil para quem trabalha em projetos colaborativos no GitHub.',
    likes: 38,
    comments: 5,
    tag: 'DICAS',
    tagVariant: 'dica',
    featured: false,
  },
  {
    id: 5,
    avatar: 'pedro-alves',
    name: 'Pedro Alves',
    meta: '3º SEMESTRE • MACEIÓ',
    time: 'Há 2 dias',
    title: 'Hackathon de IA — inscrições abertas!',
    content:
      'A Liga Acadêmica de Computação está organizando um hackathon de 24h com foco em IA aplicada. Times de até 4 pessoas. Premiação em dinheiro e certificado para os finalistas.',
    likes: 72,
    comments: 19,
    tag: 'EVENTOS',
    tagVariant: 'evento',
    featured: false,
  },
];

/* -----------------------------------------------
   Main Screen
----------------------------------------------- */
const FILTERS = [
  { id: 'todos',     label: 'Todos os Tópicos' },
  { id: 'perguntas', label: 'Perguntas' },
  { id: 'avisos',    label: 'Avisos' },
  { id: 'dicas',     label: 'Dicas' },
  { id: 'eventos',   label: 'Eventos' },
];

const ForumScreen = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter]   = useState('todos');
  const [searchQuery, setSearchQuery]     = useState('');
  const [showAddCard, setShowAddCard]     = useState(false);
  const [posts, setPosts]                 = useState(ALL_POSTS);

  /* ── Mapeamento plural → singular para os filtros de categoria ── */
  const FILTER_TO_VARIANT = {
    todos:     null,           // sem restrição
    perguntas: 'pergunta',
    avisos:    'aviso',
    dicas:     'dica',
    eventos:   'evento',
  };

  /* ── Filtragem reativa ── */
  const filteredPosts = useMemo(() => {
    const query          = searchQuery.trim().toLowerCase();
    const targetVariant  = FILTER_TO_VARIANT[activeFilter]; // null = todos

    return posts.filter((post) => {
      // Filtro por categoria (comparação exata no tagVariant)
      const matchesCategory =
        targetVariant === null ||
        post.tagVariant.toLowerCase() === targetVariant;

      // Filtro por busca textual (título + conteúdo + nome do autor)
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.name.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery, posts]);

  /* ── Publicar novo post ── */
  const handlePublish = ({ category, title, body }) => {
    const newPost = {
      id: Date.now(),
      avatar: 'guilherme-novais',
      name: 'Guilherme Novais',
      meta: '4º SEMESTRE • MACEIÓ',
      time: 'Agora mesmo',
      title,
      content: body || 'Sem descrição.',
      likes: 0,
      comments: 0,
      tag: category.toUpperCase() + 'S',
      tagVariant: category.toLowerCase(),
      featured: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div
      style={{
        width: '390px',
        height: '100%',
        backgroundColor: '#F5F5F5',
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* TopBar */}
      <TopAppBar />

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* Title */}
        <div style={{ padding: '8px 20px 0' }}>
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

          {/* ── Search Bar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '10px 14px',
              marginBottom: '14px',
              boxShadow: '0px 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tópicos, pessoas..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#10305F',
                fontFamily: 'Inter, sans-serif',
                backgroundColor: 'transparent',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9E9E9E',
                  fontSize: '16px',
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* ── Filter Chips ── */}
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
            {FILTERS.map((f) => (
              <FilterChip
                key={f.id}
                label={f.label}
                active={activeFilter === f.id}
                onClick={() => setActiveFilter(f.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Posts Feed ── */}
        <div style={{ padding: '0 20px 100px' }}>
          {filteredPosts.length === 0 ? (
            <EmptyState query={searchQuery} />
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))
          )}
        </div>

        {/* ── FAB ── */}
        <button
          onClick={() => setShowAddCard(true)}
          style={{
            position: 'sticky',
            bottom: '16px',
            left: 'calc(100% - 72px)',
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
            marginLeft: 'auto',
            marginRight: '16px',
            flexShrink: 0,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0px 6px 20px rgba(16, 48, 95, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0px 4px 16px rgba(16, 48, 95, 0.4)';
          }}
        >
          <PlusIcon />
        </button>
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNavBar activeTab="forum" onNavigate={onNavigate} />

      {/* ── Modal de criação de postagem (card_forum) ── */}
      {showAddCard && (
        <ForumCardAdicao
          onClose={() => setShowAddCard(false)}
          onPublish={handlePublish}
        />
      )}
    </div>
  );
};

export default ForumScreen;
