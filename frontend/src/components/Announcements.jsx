import { Megaphone, MessageSquareMore, Send } from 'lucide-react';

import { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

const Announcements = () => {
  const [ann, setAnn] = useState(null);

  useEffect(() => {
    let mounted = true;
    apiClient.get('/dashboard/announcements').then(data => {
      if (mounted && Array.isArray(data) && data.length > 0) setAnn(data[0]);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <div className="px-3 mb-6">
      <h2 className="text-xl font-semibold text-gradua-inicio mb-3">Comunicados</h2>

      <div className="rounded-[2.5rem] px-5 py-6 text-white shadow-[0_18px_45px_rgba(37,56,120,0.22)] bg-[linear-gradient(135deg,#263c86_0%,#2b3f86_55%,#314992_100%)]">
        <div className="flex items-center gap-3 mb-5 text-white/80">
          <Megaphone size={20} strokeWidth={2.2} />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase">Avisos recentes</span>
        </div>

        <p className="text-lg leading-7 font-normal mb-6">{ann ? (ann.title || ann.content) : 'Nenhum aviso recente.'}</p>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-full bg-white/10 border border-white/10 text-white font-semibold text-sm hover:bg-white/20 hover:border-white/20 active:bg-white/30 transition-all duration-200">
            <MessageSquareMore size={16} /> WhatsApp
          </button>

          <button className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-full bg-white/10 border border-white/10 text-white font-semibold text-sm hover:bg-white/20 hover:border-white/20 active:bg-white/30 transition-all duration-200">
            <Send size={16} /> Telegram
          </button>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
