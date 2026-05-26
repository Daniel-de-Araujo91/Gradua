import { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

const CommunityForum = ({ onNavigate }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Beatriz Silva",
      time: "2h atrás",
      content: "Alguém conseguiu resolver a questão 4 da lista de Grafos? O enunciado parece...",
      likes: 12,
      dislikes: 5,
      userVote: null, 
    },
    {
      id: 2,
      author: "Ricardo M.",
      time: "5h atrás",
      content: "Dica: O site da biblioteca está com o acervo de Engenharia de Software liberado.",
      likes: 8,
      dislikes: 2,
      userVote: null,
    },
  ]);

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
          onClick={() => onNavigate('forum')}
          className="text-gradua-inicio/60 text-sm font-medium flex items-center gap-1 hover:text-gradua-inicio/90 transition-colors">
          Explorar
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
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