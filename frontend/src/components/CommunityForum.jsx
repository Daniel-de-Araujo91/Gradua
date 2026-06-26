import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { forumService } from '../services/forumService';

const CommunityForum = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    forumService.getFeed(null).then(data => {
      if (!mounted) return;
      setPosts((data || []).slice(0, 3).map(p => ({ id: p.topicId, author: p.authorName, authorPhoto: p.authorPhoto, time: p.creationDate, content: p.content, likes: p.voteScore || 0, dislikes: 0, userVote: null })));
    }).catch(() => {}).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleVote = (postId, voteType) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id !== postId) return post;

        let newLikes = post.likes;
        let newDislikes = post.dislikes;
        let newVote = post.userVote;

        if (voteType === 'up') {
          if (post.userVote === 'up') {
            newLikes -= 1; 
            newVote = null;
          } else {
            newLikes += 1; 
            if (post.userVote === 'down') newDislikes -= 1; 
            newVote = 'up';
          }
        } else if (voteType === 'down') {
          if (post.userVote === 'down') {
            newDislikes -= 1;
            newVote = null;
          } else {
            newDislikes += 1; 
            if (post.userVote === 'up') newLikes -= 1;
            newVote = 'down';
          }
        }

        return { ...post, likes: newLikes, dislikes: newDislikes, userVote: newVote };
      })
    );
  };

  return (
    <div className="px-4 mb-24">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Fórum da Comunidade</h2>
        
        <button 
          onClick={() => navigate('/forum')}
          className="text-gradua-inicio/60 text-sm font-medium flex items-center gap-1 hover:text-gradua-inicio/90 transition-colors">
          Explorar
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-100 flex-shrink-0">
                {post.authorPhoto ? (
                  <img src={post.authorPhoto} alt={post.author} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class=\"text-xs font-bold text-orange-600\">' + post.author?.charAt(0)?.toUpperCase() + '</span>'; }} />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-xs font-bold text-orange-600">{post.author?.charAt(0)?.toUpperCase() || '?'}</span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{post.content}</p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleVote(post.id, 'up')}
                className={`flex items-center gap-1 transition-colors ${
                  post.userVote === 'up' ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-green-600'
                }`}>
                <ArrowUp size={18} strokeWidth={post.userVote === 'up' ? 3 : 2} />
                <span className="text-sm">{post.likes}</span>
              </button>
              
              <button 
                onClick={() => handleVote(post.id, 'down')}
                className={`flex items-center gap-1 transition-colors ${
                  post.userVote === 'down' ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-red-600'
                }`}>
                <ArrowDown size={18} strokeWidth={post.userVote === 'down' ? 3 : 2} />
                <span className="text-sm">{post.dislikes}</span>
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;
