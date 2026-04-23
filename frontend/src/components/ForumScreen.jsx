import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { ArrowUp, ArrowDown, MessageCircle, Search, Plus, BookOpen, Bell, Lightbulb, CalendarDays, X } from 'lucide-react';

/* ─────────────────────────────────────────
   Dados dos posts
───────────────────────────────────────── */
const INITIAL_POSTS = [
  {
    id: 1,
    avatar: 'beatriz-oliveira',
    name: 'Beatriz Oliveira',
    meta: '7º SEMESTRE • MACEIÓ',
    time: 'Há 2 horas',
    title: 'Dicas para a prova final de Estrutura de Dados II',
    content: 'Pessoal, alguém tem resumos sobre Árvores B+ e Grafos direcionados? A prova do Prof. Ricardo está chegando e o conteúdo de Red-Black Trees ainda está um pouco nebuloso...',
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
    content: 'Estamos montando um grupo para praticar configuração de roteadores e subnets. Quem tiver interesse, vamos nos reunir na biblioteca central quarta-feira às 14h.',
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
    content: 'Abertura de seleção para estágio em Desenvolvimento Web (React/Node). Necessário estar cursando a partir do 5º semestre. Bolsa auxílio compatível com o mercado + benefícios.',
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
    perguntas: 'bg-green-50 text-green-800',
    avisos: 'bg-blue-100 text-blue-800',
    destaque: 'bg-white text-gradua-forum', 
  };
  const activeStyle = styles[variant] || 'bg-gray-200 text-gray-800';

  return (
    <span className={`text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase ${activeStyle}`}>
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

  return (
    <div className={`rounded-2xl p-5 mb-4 shadow-sm transition-shadow ${featured ? 'bg-gradua-forum text-white' : 'bg-white border border-gray-100'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-100 flex-shrink-0">
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${avatar}&backgroundColor=ffedd5`}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className={`text-sm font-bold ${featured ? 'text-white' : 'text-gray-900'}`}>{name}</p>
            <p className={`text-[10px] font-medium tracking-wide uppercase ${featured ? 'text-white/70' : 'text-gray-500'}`}>{meta}</p>
          </div>
        </div>
        <span className={`text-[11px] whitespace-nowrap ${featured ? 'text-white/70' : 'text-gray-400'}`}>{time}</span>
      </div>

      {/* Title & Content */}
      <h3 className={`text-base font-bold mb-2 leading-tight ${featured ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-[13px] mb-4 leading-relaxed ${featured ? 'text-white/90' : 'text-gray-600'}`}>{content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          
          {/* Lógica de Cores dos Botões Corrigida! */}
          <div className="flex gap-2">
            <button
              onClick={() => handleVote('up')}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-md transition-colors ${
                featured 
                  ? (userVote === 'up' ? 'text-white font-black bg-white/20' : 'text-white/70 hover:text-white hover:bg-white/10') 
                  : (userVote === 'up' ? 'text-green-600 font-bold bg-green-50' : 'text-gray-500 hover:text-green-600 hover:bg-gray-50')
              }`}
            >
              <ArrowUp size={16} strokeWidth={userVote === 'up' ? 3 : 2} />
              <span className="text-xs">{likes}</span>
            </button>
            
            <button
              onClick={() => handleVote('down')}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-md transition-colors ${
                featured 
                  ? (userVote === 'down' ? 'text-white font-black bg-white/20' : 'text-white/70 hover:text-white hover:bg-white/10') 
                  : (userVote === 'down' ? 'text-red-600 font-bold bg-red-50' : 'text-gray-500 hover:text-red-600 hover:bg-gray-50')
              }`}
            >
              <ArrowDown size={16} strokeWidth={userVote === 'down' ? 3 : 2} />
              <span className="text-xs">{dislikes}</span>
            </button>
          </div>

          <div className={`flex items-center gap-1.5 px-1.5 py-1 text-xs font-semibold ${featured ? 'text-white/70' : 'text-gray-500'}`}>
            <MessageCircle size={16} />
            <span>{comments}</span>
          </div>
        </div>
        <CategoryTag label={tag} variant={tagVariant} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Card de Adição
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
      className={`bg-white rounded-2xl border-2 border-dashed p-4 mb-4 transition-all cursor-pointer ${isExpanded ? 'border-gradua-forum shadow-md' : 'border-gray-300 hover:border-gradua-forum'}`}
      onClick={() => { if (!isExpanded) setIsExpanded(true); }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-50 flex-shrink-0">
            <img src="https://api.dicebear.com/7.x/personas/svg?seed=usuario-atual&backgroundColor=ffedd5" alt="Você" className="w-full h-full object-cover" />
          </div>
          {!isExpanded ? (
            <span className="text-sm font-medium text-gray-400">Compartilhe algo com a turma...</span>
          ) : (
            <p className="text-sm font-bold text-gradua-forum">Criar Postagem</p>
          )}
        </div>

        {isExpanded ? (
          <button onClick={(e) => { e.stopPropagation(); handleClose(); }} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradua-forum flex items-center justify-center flex-shrink-0 text-white">
            <Plus size={18} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 animate-fade-in">
          <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Categoria</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {CARD_CATEGORIES.map(({ id, label, icon: Icon }) => {
              const isSelected = selectedCategory === id;
              return (
                <button
                  key={id}
                  onClick={(e) => { e.stopPropagation(); setSelectedCategory(isSelected ? null : id); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border-2 ${
                    isSelected ? 'bg-gradua-forum border-gradua-forum text-white' : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={14} strokeWidth={isSelected ? 2.5 : 2} /> {label}
                </button>
              );
            })}
          </div>

          <textarea
            placeholder="O que você quer compartilhar?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            rows={4}
            className="w-full p-3 rounded-xl border-2 border-gray-200 text-sm text-gray-800 focus:border-gradua-forum outline-none resize-none transition-colors bg-gray-50 focus:bg-white"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!postText.trim()) return;
              const cat = CARD_CATEGORIES.find(c => c.id === selectedCategory) || CARD_CATEGORIES[0];
              onPublish({
                id: Date.now(), avatar: 'usuario-atual', name: 'Você', meta: 'ESTUDANTE • MACEIÓ', time: 'Agora mesmo',
                title: postText.trim().split('\n')[0] || postText.trim(), content: postText.trim(),
                likes: 0, dislikes: 0, comments: 0, tag: cat.label.toUpperCase(), tagVariant: cat.id === 'pergunta' ? 'perguntas' : cat.id === 'aviso' ? 'avisos' : 'perguntas', category: cat.id, featured: false,
              });
              handleClose();
            }}
            disabled={!postText.trim()}
            className={`w-full mt-3 py-3 rounded-xl font-bold text-sm transition-all ${
              postText.trim() ? 'bg-gradua-forum text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Publicar
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Estado Vazio
───────────────────────────────────────── */
const EmptyState = ({ query, filter }) => (
  <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
    <div className="w-16 h-16 rounded-full bg-gradua-forum/10 flex items-center justify-center mb-4 text-gradua-forum/50">
      <Search size={28} strokeWidth={2} />
    </div>
    <p className="text-base font-bold text-gray-900 mb-1">Nenhum resultado encontrado</p>
    <p className="text-sm text-gray-500 max-w-[250px]">
      {query ? `Não encontramos posts com "${query}".` : `Não há posts na categoria "${filter}".`} Tente ajustar o filtro ou o termo de busca.
    </p>
  </div>
);

/* ─────────────────────────────────────────
   Main Component — ForumScreen
───────────────────────────────────────── */
const STORAGE_KEY = 'forum_posts_v2';

const ForumScreen = ({ onNavigate }) => {
  const [posts, setPosts] = useState(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : INITIAL_POSTS; } 
    catch { return INITIAL_POSTS; }
  });
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch { }
  }, [posts]);

  const handlePublish = (newPost) => setPosts((prev) => [newPost, ...prev]);

  const filters = [
    { id: 'todos', label: 'Todos os Tópicos' },
    { id: 'perguntas', label: 'Perguntas' },
    { id: 'avisos', label: 'Avisos' },
    { id: 'destaque', label: 'Destaque' },
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = activeFilter === 'todos' || post.category === activeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q) || post.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeFilter, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header onNavigate={onNavigate} />

      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-4">
          <h1 className="text-2xl font-black text-gradua-forum mb-1 leading-tight">Fórum da Comunidade</h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-5">Comunidade Acadêmica • UFAL</p>

          {/* Campo de Busca */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-3 border-2 border-gray-200 mb-4 transition-colors focus-within:border-gradua-forum shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar posts, autores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`text-[13px] font-bold px-5 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                    isActive ? 'bg-gradua-forum text-white shadow-md' : 'bg-gradua-forum/10 text-gradua-forum hover:bg-gradua-forum/20'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="px-4 pb-28">
          {activeFilter === 'todos' && !searchQuery && <AddPostCard onPublish={handlePublish} />}

          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} {...post} />)
          ) : (
            <EmptyState query={searchQuery} filter={filters.find((f) => f.id === activeFilter)?.label} />
          )}
        </div>
      </div>

      <BottomNavBar activeTab="forum" onTabChange={onNavigate} />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ForumScreen;