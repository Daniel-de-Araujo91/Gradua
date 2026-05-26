import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import {
  ArrowLeft, Upload, Trash2, Eye, FileText, CreditCard,
  Home, CheckCircle2, AlertCircle, X, ZoomIn,
} from 'lucide-react';

/* ─────────────────────────────────────────
   Configuração dos documentos suportados
───────────────────────────────────────── */
const DOCS_CONFIG = [
  {
    id: 'rg',
    label: 'RG',
    sublabel: 'Registro Geral',
    icon: CreditCard,
    color: 'text-gradua-perfil',
    bg: 'bg-gradua-perfil/10',
    border: 'border-gradua-perfil/30',
    accent: '#b85d43',
    accept: 'image/*,application/pdf',
  },
  {
    id: 'cpf',
    label: 'CPF',
    sublabel: 'Cadastro de Pessoa Física',
    icon: FileText,
    color: 'text-gradua-inicio',
    bg: 'bg-gradua-inicio/10',
    border: 'border-gradua-inicio/30',
    accent: '#1e3a5f',
    accept: 'image/*,application/pdf',
  },
  {
    id: 'comprovante',
    label: 'Comprovante de Residência',
    sublabel: 'Conta de água, luz ou telefone',
    icon: Home,
    color: 'text-gradua-forum',
    bg: 'bg-gradua-forum/10',
    border: 'border-gradua-forum/30',
    accent: '#52796f',
    accept: 'image/*,application/pdf',
  },
];

/* ─────────────────────────────────────────
   Modal de visualização
───────────────────────────────────────── */
const PreviewModal = ({ file, onClose }) => {
  if (!file) return null;
  const isPDF = file.type === 'application/pdf';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-slide-up"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-bold text-gray-800 text-base truncate pr-2">{file.name}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* conteúdo */}
        <div className="p-5">
          {isPDF ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <FileText size={56} className="text-red-400" />
              <p className="text-sm text-gray-500 text-center">Arquivo PDF — abra externamente para visualizar</p>
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 bg-gradua-perfil text-white px-5 py-2.5 rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <ZoomIn size={16} /> Abrir PDF
              </a>
            </div>
          ) : (
            <img
              src={file.url}
              alt={file.name}
              className="w-full rounded-2xl object-contain max-h-72"
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Card de um documento
───────────────────────────────────────── */
const DocCard = ({ config, docFile, onUpload, onRemove, onPreview }) => {
  const inputRef = useRef(null);
  const Icon = config.icon;
  const hasFile = !!docFile;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(config.id, { name: file.name, type: file.type, url, size: file.size });
    e.target.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`bg-white rounded-3xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border ${hasFile ? 'border-green-200' : 'border-gray-100'} transition-all duration-300`}>
      {/* topo */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
          <Icon size={22} className={config.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-gray-800 text-base leading-tight">{config.label}</h3>
            {hasFile && <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{config.sublabel}</p>
        </div>
      </div>

      {/* área do arquivo */}
      {hasFile ? (
        <div className="bg-gray-50 rounded-2xl p-3 mb-3 flex items-center gap-3">
          {docFile.type !== 'application/pdf' ? (
            <img
              src={docFile.url}
              alt={docFile.name}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText size={22} className="text-red-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">{docFile.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatSize(docFile.size)}</p>
          </div>
        </div>
      ) : (
        /* zona de upload vazia */
        <button
          onClick={() => inputRef.current?.click()}
          className={`w-full border-2 border-dashed ${config.border} rounded-2xl py-6 flex flex-col items-center gap-2 mb-3 hover:bg-gray-50 transition-colors active:scale-[0.98]`}
        >
          <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
            <Upload size={18} className={config.color} />
          </div>
          <span className="text-sm font-semibold text-gray-500">Toque para enviar</span>
          <span className="text-xs text-gray-400">JPG, PNG ou PDF</span>
        </button>
      )}

      {/* botões de ação */}
      <div className="flex gap-2">
        {hasFile ? (
          <>
            <button
              onClick={() => onPreview(docFile)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-2xl text-sm transition-colors active:scale-[0.98]"
            >
              <Eye size={15} /> Visualizar
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 font-semibold py-2.5 rounded-2xl text-sm transition-colors active:scale-[0.98]"
              style={{ backgroundColor: `${config.accent}15`, color: config.accent }}
            >
              <Upload size={15} /> Substituir
            </button>
            <button
              onClick={() => onRemove(config.id)}
              className="w-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl transition-colors active:scale-[0.98]"
            >
              <Trash2 size={15} />
            </button>
          </>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-2xl text-sm transition-all active:scale-[0.98] hover:opacity-90"
            style={{ backgroundColor: config.accent }}
          >
            <Upload size={16} /> Enviar Documento
          </button>
        )}
      </div>

      {/* input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

/* ─────────────────────────────────────────
   Banner de aviso de privacidade
───────────────────────────────────────── */
const PrivacyBanner = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex gap-3 items-start mb-5">
    <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
    <p className="text-xs text-amber-700 font-medium leading-relaxed">
      Os arquivos são salvos <strong>apenas neste dispositivo</strong>. Nenhum documento é enviado para servidores externos.
    </p>
  </div>
);

/* ─────────────────────────────────────────
   Componente principal
───────────────────────────────────────── */
const MeusDocumentosPage = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState({}); // { rg: { name, type, url, size }, ... }
  const [preview, setPreview] = useState(null);

  const handleUpload = (id, fileData) => {
    setDocs((prev) => {
      // liberar URL antiga para não vazar memória
      if (prev[id]?.url) URL.revokeObjectURL(prev[id].url);
      return { ...prev, [id]: fileData };
    });
  };

  const handleRemove = (id) => {
    setDocs((prev) => {
      if (prev[id]?.url) URL.revokeObjectURL(prev[id].url);
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const totalEnviados = Object.keys(docs).length;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab="profile" />

      <main className="flex-1 px-4 py-5 overflow-y-auto pb-32">
        {/* cabeçalho da página */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate('/perfil')}
            className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors active:scale-95"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gradua-perfil leading-tight">Meus Documentos</h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {totalEnviados} de {DOCS_CONFIG.length} enviados
            </p>
          </div>
        </div>

        {/* barra de progresso geral */}
        <div className="bg-white rounded-3xl px-5 py-4 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progresso</span>
            <span className="text-sm font-black text-gradua-perfil">
              {Math.round((totalEnviados / DOCS_CONFIG.length) * 100)}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradua-perfil rounded-full transition-all duration-500"
              style={{ width: `${(totalEnviados / DOCS_CONFIG.length) * 100}%` }}
            />
          </div>
          {totalEnviados === DOCS_CONFIG.length && (
            <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Todos os documentos enviados!
            </p>
          )}
        </div>

        <PrivacyBanner />

        {/* cards */}
        <div className="flex flex-col gap-4">
          {DOCS_CONFIG.map((cfg) => (
            <DocCard
              key={cfg.id}
              config={cfg}
              docFile={docs[cfg.id] || null}
              onUpload={handleUpload}
              onRemove={handleRemove}
              onPreview={setPreview}
            />
          ))}
        </div>
      </main>

      <BottomNavBar activeTab="profile" />

      {/* modal de preview */}
      {preview && <PreviewModal file={preview} onClose={() => setPreview(null)} />}
    </div>
  );
};

export default MeusDocumentosPage;
