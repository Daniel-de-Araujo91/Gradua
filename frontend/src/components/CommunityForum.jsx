import { ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react';

const CommunityForum = () => {
  const posts = [
    {
      id: 1,
      author: "Beatriz Silva",
      time: "2h atrás",
      content: "Alguém conseguiu resolver a questão 4 da lista de Grafos? O enunciado parece...",
      likes: 12,
      dislikes: 5,
    },
    {
      id: 2,
      author: "Ricardo M.",
      time: "5h atrás",
      content: "Dica: O site da biblioteca está com o acervo de Engenharia de Software liberado.",
      likes: 8,
      dislikes: 2,
    },
  ];

  return (
    <div className="px-4 mb-24">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Fórum da Comunidade</h2>
        <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
          Explorar
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{post.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-600 hover:text-green-600">
                <ThumbsUp size={16} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-red-600">
                <ThumbsDown size={16} />
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