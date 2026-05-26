import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { ArrowUp, ArrowDown, MessageCircle, Search, Plus, BookOpen, Bell, Lightbulb, CalendarDays, X, Trash2, Loader2 } from 'lucide-react';
import { forumService } from '../services/forumService';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────
   Mapeamento de tipos: UI ↔ API
───────────────────────────────────────── */
const FILTER_TO_API_TYPE = {
  perguntas: 'pergunta',
  avisos:    'aviso',
  dicas:     'dica',
  eventos:   'evento',
};

const TYPE_TO_TAG = {
  pergunta: { label: 'PERGUNTA',  variant: 'perguntas' },
  aviso:    { label: 'AVISO',     variant: 'avisos'    },
  dica:     { label: 'DICA',      variant: 'perguntas' },
  evento:   { label: 'EVENTO',    variant: 'avisos'    },
};

/* ─────────────────────────────────────────
   Category Tag
───────────────────────────────────────── */
const CategoryTag = ({ label, variant }) => {
  const styles = {
    perguntas: 'bg-green-50 text-green-800',
    avisos:    'bg-blue-100 text-blue-800',
    destaque:  'bg-white text-gradua-forum',
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
  topicId, avatar, name, time, title, content,
  tag, tagVariant, featured = false,
  currentUserName, onDelete,
}) => {
  const [likes, setLikes]       = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const isAuthor = currentUserName && name === currentUserName;

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
            <p className={`text-[10px] font-medium tracking-wide uppercase ${featured ? 'text-white/70' : 'text-gray-500'}`}>{time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthor && (
            <button
              onClick={() => onDelete(topicId)}
              className={`p-1.5 rounded-lg transition-colors ${featured ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
              title="Excluir tópico"
            >
              <Trash2 size={15} />
            </button>
          )}
          <span className={`text-[11px] whitespace-nowrap ${featured ? 'text-white/70' : 'text-gray-400'}`}>{time}</span>
        </div>
      </div>

      <h3 className={`text-base font-bold mb-2 leading-tight ${featured ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-[13px] mb-4 leading-relaxed ${featured ? 'text-white/90' : 'text-gray-600'}`}>{content}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
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
            <span>0</span>
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
  { id: 'aviso',    label: 'Aviso',    icon: Bell },
  { id: 'dica',     label: 'Dica',     icon: Lightbulb },
  { id: 'evento',   label: 'Evento',   icon: CalendarDays },
];

const AddPostCard = ({ onPublish, loading: publishLoading }) => {
  const [isExpanded, setIsExpanded]             = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('pergunta');
  const [title, setTitle]                       = useState('');
  const [postText, setPostText]                 = useState('');

  const handleClose = () => {
    setIsExpanded(false);
    setSelectedCategory('pergunta');
    setTitle('');
    setPostText('');
  };

  const handlePublish = async (e) => {
    e.stopPropagation();
    if (!postText.trim()) return;
    await onPublish({
      title: title.trim() || postText.trim().split('\n')[0].slice(0, 80),
      content: postText.trim(),
      type: selectedCategory,
    });
    handleClose();
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
          {!isExpanded
            ? <span className="text-sm font-medium text-gray-400">Compartilhe algo com a turma...</span>
            : <p className="text-sm font-bold text-gradua-forum">Criar Postagem</p>
          }
        </div>
        {isExpanded
          ? <button onClick={(e) => { e.stopPropagation(); handleClose(); }} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full"><X size={18} /></button>
          : <div className="w-9 h-9 rounded-full bg-gradua-forum flex items-center justify-center flex-shrink-0 text-white"><Plus size={18} strokeWidth={2.5} /></div>
        }
      </div>

      {isExpanded && (
        <div className="mt-4 animate-fade-in">
          <input
            type="text"
            placeholder="Título da postagem"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full p-3 rounded-xl border-2 border-gray-200 text-sm text-gray-800 focus:border-gradua-forum outline-none transition-colors bg-gray-50 focus:bg-white mb-3 font-semibold"
          />
          <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Categoria</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {CARD_CATEGORIES.map(({ id, label, icon: Icon }) => {
              const isSelected = selectedCategory === id;
              return (
                <button
                  key={id}
                  onClick={(e) => { e.stopPropagation(); setSelectedCategory(id); }}
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
            onClick={handlePublish}
            disabled={!postText.trim() || publishLoading}
            className={`w-full mt-3 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              postText.trim() && !publishLoading ? 'bg-gradua-forum text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {publishLoading ? <><Loader2 size={16} className="animate-spin" /> Publicando...</> : 'Publicar'}
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Estados de Loading, Erro e Vazio
───────────────────────────────────────── */
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-gradua-forum/60">
    <Loader2 size={32} className="animate-spin" />
    <p className="text-sm font-semibold">Carregando tópicos...</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-5 text-center gap-3">
    <p className="text-base font-bold text-red-500">Erro ao carregar</p>
    <p className="text-sm text-gray-500">{message}</p>
    <button onClick={onRetry} className="mt-2 px-5 py-2 rounded-xl bg-gradua-forum text-white text-sm font-bold hover:opacity-90 transition-opacity">
      Tentar novamente
    </button>
  </div>
);

const EmptyState = ({ query, filter }) => (
  <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
    <div className="w-16 h-16 rounded-full bg-gradua-forum/10 flex items-center justify-center mb-4 text-gradua-forum/50">
      <Search size={28} strokeWidth={2} />
    </div>
    <p className="text-base font-bold text-gray-900 mb-1">Nenhum resultado encontrado</p>
    <p className="text-sm text-gray-500 max-w-[250px]">
      {query ? `Não encontramos posts com "${query}".` : `Não há posts na categoria "${filter}".`}{' '}
      Tente ajustar o filtro ou o termo de busca.
    </p>
  </div>
);

/* ─────────────────────────────────────────
   Main Component — ForumScreen
───────────────────────────────────────── */
const ForumScreen = () => {
  const { user } = useAuth();
  const currentUserName = user ? `${user.firstName} ${user.lastName}`.trim() : null;

  const [posts, setPosts]                     = useState([]);
  const [activeFilter, setActiveFilter]       = useState('todos');
  const [searchQuery, setSearchQuery]         = useState('');
  const [loading, setLoading]                 = useState(true);
  const [publishLoading, setPublishLoading]   = useState(false);
  const [error, setError]                     = useState(null);

  const filters = [
    { id: 'todos',     label: 'Todos os Tópicos' },
    { id: 'perguntas', label: 'Perguntas' },
    { id: 'avisos',    label: 'Avisos' },
    { id: 'dicas',     label: 'Dicas' },
    { id: 'eventos',   label: 'Eventos' },
  ];

  const fetchFeed = useCallback(async (filter = 'todos') => {
    setLoading(true);
    setError(null);
    try {
      const apiType = FILTER_TO_API_TYPE[filter] || null;
      const data = await forumService.getFeed(apiType);
      setPosts(data || []);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os tópicos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(activeFilter);
  }, [activeFilter, fetchFeed]);

  const handlePublish = async ({ title, content, type }) => {
    setPublishLoading(true);
    try {
      const newTopic = await forumService.createTopic({ title, content, type });
      setPosts(prev => [newTopic, ...prev]);
    } catch (err) {
      alert(err.message || 'Erro ao publicar. Tente novamente.');
    } finally {
      setPublishLoading(false);
    }
  };

  const handleDelete = async (topicId) => {
    if (!window.confirm('Deseja excluir este tópico?')) return;
    try {
      await forumService.deleteTopic(topicId);
      setPosts(prev => prev.filter(p => p.topicId !== topicId));
    } catch (err) {
      alert(err.message || 'Erro ao excluir o tópico.');
    }
  };

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.content?.toLowerCase().includes(q) ||
      p.authorName?.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const toCardProps = (post) => {
    const tagInfo = TYPE_TO_TAG[post.type] || { label: post.type?.toUpperCase() || 'POST', variant: 'perguntas' };
    const date = post.creationDate ? new Date(post.creationDate) : null;
    const time = date
      ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      : '';
    return {
      topicId:    post.topicId,
      avatar:     post.authorName?.toLowerCase().replace(/\s+/g, '-') || 'user',
      name:       post.authorName || 'Usuário',
      time,
      title:      post.title,
      content:    post.content,
      tag:        tagInfo.label,
      tagVariant: tagInfo.variant,
      featured:   false,
    };
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab="forum" />

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
          {activeFilter === 'todos' && !searchQuery && (
            <AddPostCard onPublish={handlePublish} loading={publishLoading} />
          )}

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchFeed(activeFilter)} />
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.topicId}
                {...toCardProps(post)}
                currentUserName={currentUserName}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <EmptyState query={searchQuery} filter={filters.find((f) => f.id === activeFilter)?.label} />
          )}
        </div>
      </div>

      <BottomNavBar activeTab="forum" />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-5px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ForumScreen;