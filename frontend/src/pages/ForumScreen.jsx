import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { ArrowUp, ArrowDown, MessageCircle, Search, Plus, BookOpen, Bell, Lightbulb, CalendarDays, X, Trash2, Loader2, Pencil, Check, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { forumService } from '../services/forumService';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import { useWebNotifications } from '../hooks/useWebNotifications';

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
   Comment Item
───────────────────────────────────────── */
const CommentItem = ({ comment, currentUserId, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const isAuthor = currentUserId && comment.authorId === currentUserId;

  const handleSave = async () => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await onUpdate(comment.commentId, editText.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-2 py-2 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-full overflow-hidden bg-orange-100 flex-shrink-0 mt-0.5">
        <img
          src={`https://api.dicebear.com/7.x/personas/svg?seed=${comment.authorName}&backgroundColor=ffedd5`}
          alt={comment.authorName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold text-gray-800">{comment.authorName}</span>
          {comment.isEdited && (
            <span className="text-[9px] text-gray-400 italic">editado</span>
          )}
        </div>
        {editing ? (
          <div className="flex gap-2 items-end">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="flex-1 text-xs border border-gradua-forum rounded-lg p-2 outline-none resize-none focus:ring-1 focus:ring-gradua-forum"
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-1.5 bg-gradua-forum text-white rounded-lg hover:opacity-90 disabled:opacity-60"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              </button>
              <button
                onClick={() => { setEditing(false); setEditText(comment.content); }}
                className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-600 leading-relaxed">{comment.content}</p>
        )}
      </div>
      {isAuthor && !editing && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-gray-300 hover:text-gradua-forum hover:bg-gradua-forum/10 rounded transition-colors"
            title="Editar comentário"
          >
            <Pencil size={11} />
          </button>
          <button
            onClick={() => onDelete(comment.commentId)}
            className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Excluir comentário"
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Post Card
───────────────────────────────────────── */
const PostCard = ({
  topicId, avatar, name, time, title, content,
  tag, tagVariant, type, isEdited,
  voteScore: initialVoteScore, commentCount: initialCommentCount,
  currentUser, onDelete,
}) => {
  // Spec 2.2: robusto a maiúsculas/minúsculas vindas da API
  const isAnnouncement = (type || '').toLowerCase() === 'aviso';

  const [likes, setLikes]       = useState(Math.max(0, initialVoteScore || 0));
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [featured] = useState(false);

  // Controle de edição inline (spec 4.3)
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [editSaving, setEditSaving] = useState(false);

  // Seção de comentários
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(initialCommentCount || 0);
  const [postingComment, setPostingComment] = useState(false);

  // Comparação de autoria insensível a maiúsculas
  const isAuthor = currentUser?.name &&
    name?.toLowerCase().trim() === currentUser.name?.toLowerCase().trim();

  const handleVote = (voteType) => {
    if (isAnnouncement) return; // Spec 2.2: avisos não permitem votação
    if (voteType === 'up') {
      if (userVote === 'up') { setLikes(l => l - 1); setUserVote(null); }
      else { setLikes(l => l + 1); if (userVote === 'down') setDislikes(d => d - 1); setUserVote('up'); }
    } else {
      if (userVote === 'down') { setDislikes(d => d - 1); setUserVote(null); }
      else { setDislikes(d => d + 1); if (userVote === 'up') setLikes(l => l - 1); setUserVote('down'); }
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    setEditSaving(true);
    try {
      await forumService.updateTopic(topicId, { title: editTitle, content: editContent, type });
      setEditing(false);
    } catch (err) {
      alert(err.message || 'Erro ao editar.');
    } finally {
      setEditSaving(false);
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const data = await apiClient.get(`/forum/comment/topic/${topicId}`);
      setComments(data || []);
    } catch {
      // Silencia
    } finally {
      setCommentsLoading(false);
    }
  };

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      await loadComments();
    }
    setShowComments(v => !v);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setPostingComment(true);
    try {
      const created = await apiClient.post(`/forum/comment/topic/${topicId}`, { content: newComment.trim() });
      setComments(prev => [...prev, created]);
      setCommentCount(c => c + 1);
      setNewComment('');
    } catch (err) {
      alert(err.message || 'Erro ao comentar.');
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Excluir comentário?')) return;
    try {
      await apiClient.delete(`/forum/comment/${commentId}`);
      setComments(prev => prev.filter(c => c.commentId !== commentId));
      setCommentCount(c => Math.max(0, c - 1));
    } catch (err) {
      alert(err.message || 'Erro ao excluir.');
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    const updated = await apiClient.put(`/forum/comment/${commentId}`, { content: newContent });
    setComments(prev => prev.map(c => c.commentId === commentId ? { ...c, content: updated.content, isEdited: true } : c));
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
            <div className="flex items-center gap-1.5">
              <p className={`text-[10px] font-medium tracking-wide uppercase ${featured ? 'text-white/70' : 'text-gray-500'}`}>{time}</p>
              {/* Spec 2.2: indicador "editado" */}
              {isEdited && (
                <span className={`text-[9px] italic ${featured ? 'text-white/50' : 'text-gray-400'}`}>• editado</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Botão de edição — apenas para o autor (spec 4.3) */}
          {isAuthor && !editing && (
            <button
              onClick={() => setEditing(true)}
              className={`p-1.5 rounded-lg transition-colors ${featured ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gradua-forum hover:bg-gradua-forum/10'}`}
              title="Editar tópico"
            >
              <Pencil size={14} />
            </button>
          )}
          {isAuthor && (
            <button
              onClick={() => onDelete(topicId)}
              className={`p-1.5 rounded-lg transition-colors ${featured ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
              title="Excluir tópico"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo — modo leitura ou edição inline */}
      {editing ? (
        <div className="mb-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full border-2 border-gradua-forum rounded-xl p-2.5 text-sm font-bold text-gray-900 outline-none mb-2 focus:ring-1 focus:ring-gradua-forum"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="w-full border-2 border-gradua-forum rounded-xl p-2.5 text-sm text-gray-800 outline-none resize-none focus:ring-1 focus:ring-gradua-forum"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              disabled={editSaving}
              className="px-4 py-2 bg-gradua-forum text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-60 flex items-center gap-1.5"
            >
              {editSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Salvar
            </button>
            <button
              onClick={() => { setEditing(false); setEditTitle(title); setEditContent(content); }}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className={`text-base font-bold mb-2 leading-tight ${featured ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-[13px] mb-4 leading-relaxed ${featured ? 'text-white/90' : 'text-gray-600'}`}>{content}</p>
        </>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          {/* Spec 2.2: votação oculta para AVISO, habilitada para DISCUSSÃO */}
          {!isAnnouncement && (
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
          )}
          {/* Botão de comentários */}
          <button
            onClick={toggleComments}
            className={`flex items-center gap-1.5 px-1.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              featured ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gradua-forum hover:bg-gradua-forum/10'
            }`}
          >
            <MessageCircle size={16} />
            <span>{commentCount}</span>
            {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
        <CategoryTag label={tag} variant={tagVariant} />
      </div>

      {/* Seção de comentários */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
          {commentsLoading ? (
            <div className="flex items-center justify-center py-4 gap-2 text-gradua-forum/60">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs">Carregando comentários...</span>
            </div>
          ) : (
            <div className="space-y-0">
              {comments.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">Nenhum comentário ainda. Seja o primeiro!</p>
              ) : (
                comments.map(c => (
                  <CommentItem
                    key={c.commentId}
                    comment={c}
                    currentUserId={null} // TODO: incluir userId no AuthContext para controle preciso
                    onDelete={handleDeleteComment}
                    onUpdate={handleUpdateComment}
                  />
                ))
              )}
            </div>
          )}
          {/* Campo para novo comentário */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
              className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-gradua-forum transition-colors"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || postingComment}
              className="p-2 bg-gradua-forum text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {postingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Card de Adição — categorias filtradas por perfil
   Spec 1.2: monitor pode criar AVISO; aluno não pode
───────────────────────────────────────── */
const ALL_CATEGORIES = [
  { id: 'pergunta', label: 'Pergunta', icon: BookOpen },
  { id: 'aviso',    label: 'Aviso',    icon: Bell },
  { id: 'dica',     label: 'Dica',     icon: Lightbulb },
  { id: 'evento',   label: 'Evento',   icon: CalendarDays },
];

const AddPostCard = ({ onPublish, loading: publishLoading, userRole }) => {
  const [isExpanded, setIsExpanded]             = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('pergunta');
  const [title, setTitle]                       = useState('');
  const [postText, setPostText]                 = useState('');

  // Spec 1.2: filtro de categorias por perfil
  const allowedCategories = userRole === 'MONITOR'
    ? ALL_CATEGORIES
    : ALL_CATEGORIES.filter(c => c.id !== 'aviso');

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
            {allowedCategories.map(({ id, label, icon: Icon }) => {
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
  const { pushNotify } = useWebNotifications();

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
      // Notificação push nativa ao publicar AVISO (spec 1.2 — exclusivo de Monitor)
      if ((type || '').toLowerCase() === 'aviso') {
        pushNotify({
          title: '📢 Novo aviso publicado',
          body: title || content?.slice(0, 80),
          tag: 'forum-aviso',
        });
      }
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
      topicId:      post.topicId,
      avatar:       post.authorName?.toLowerCase().replace(/\s+/g, '-') || 'user',
      name:         post.authorName || 'Usuário',
      time,
      title:        post.title,
      content:      post.content,
      tag:          tagInfo.label,
      tagVariant:   tagInfo.variant,
      type:         post.type,
      isEdited:     post.isEdited || false,
      voteScore:    post.voteScore || 0,
      commentCount: post.commentCount || 0,
      featured:     false,
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
            <AddPostCard onPublish={handlePublish} loading={publishLoading} userRole={user?.role} />
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
                currentUser={{ name: currentUserName }}
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