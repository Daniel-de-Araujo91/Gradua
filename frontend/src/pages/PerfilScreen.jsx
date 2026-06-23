import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { TrendingUp, ChevronRight, FileText, History, KeyRound, LogOut, CheckCircle2, ShieldAlert, Loader2, Camera, X, Save, Eye, EyeOff, User } from 'lucide-react';
import { gerarHistoricoEscolar } from '../utils/gerarHistoricoPDF';
import { academicHistoryService } from '../services/academicHistoryService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../services/apiClient';

const ProfileCard = ({ profile, loading, onPhotoChange, uploadingPhoto }) => {
  const fileInputRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const photoUrl = profile?.profilePhoto;

  return (
    <div className="bg-white rounded-3xl p-6 mb-4 flex flex-col items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative">
      <div className="relative w-32 h-40 sm:w-40 sm:h-48 mb-2">
        <div
          className="w-full h-full rounded-2xl overflow-hidden bg-orange-50 shadow-inner cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          {photoUrl && !imgError ? (
            <img
              src={photoUrl}
              alt="Foto de Perfil"
              className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <User size={64} className="text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all rounded-2xl">
            <Camera size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5">
          <CheckCircle2 size={28} className="text-gradua-perfil fill-gradua-perfil/10" />
        </div>
        {uploadingPhoto && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
            <Loader2 size={32} className="text-white animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPhotoChange}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <p className="text-[11px] font-bold text-gray-400 tracking-[1.5px] uppercase mt-2">
            MATRÍCULA: {profile?.enrollmentNumber || '—'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-gradua-perfil text-center leading-tight">
            {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : 'Nome do Aluno'}
          </h1>
        </>
      )}

      <div className="flex gap-2 flex-wrap justify-center mt-1">
        <span className="bg-gradua-perfil/10 text-gradua-perfil text-xs font-bold px-4 py-1.5 rounded-full">
          Ciência da Computação
        </span>
        <span className="bg-gradua-perfil/10 text-gradua-perfil text-xs font-bold px-4 py-1.5 rounded-full">
          {loading ? '—' : (profile?.currentTerm ? `${profile.currentTerm}º Semestre` : '—')}
        </span>
      </div>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-2 text-xs font-bold text-gradua-perfil bg-gradua-perfil/5 px-4 py-2 rounded-xl hover:bg-gradua-perfil/10 transition-colors"
      >
        Alterar Foto
      </button>
    </div>
  );
};

const IRACard = ({ ira, loading }) => (
  <div className="bg-white rounded-3xl p-6 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[11px] font-bold text-gray-400 tracking-[1.5px] uppercase">IRA GERAL</span>
      <div className="bg-gradua-inicio/10 p-2 rounded-full">
        <TrendingUp size={18} className="text-gradua-inicio" />
      </div>
    </div>
    {loading
      ? <div className="h-16 w-28 bg-gray-200 rounded animate-pulse" />
      : <p className="text-6xl font-black text-gradua-perfil leading-none tracking-tight">
          {ira != null ? Number(ira).toFixed(2) : '—'}
        </p>
    }
  </div>
);

const ProgressCard = ({ stats, loading }) => {
  const integral = stats?.integralizationPercent ?? null;
  const hours = stats?.hoursPending ?? null;

  const creditsTotal = 240;
  const creditsDone  = integral != null ? Math.round((integral / 100) * creditsTotal) : null;

  return (
    <div className="bg-white rounded-3xl p-6 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50">
      <span className="text-[11px] font-bold text-gray-400 tracking-[1.5px] uppercase block mb-3">
        PROGRESSO DO CURSO
      </span>

      <div className="flex justify-between items-end mb-3">
        <p className="text-xl sm:text-2xl font-black text-gradua-perfil leading-tight">Conclusão Total</p>
        {loading
          ? <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          : <p className="text-4xl font-black text-gradua-perfil leading-none">
              {integral != null ? `${integral}%` : '—'}
            </p>
        }
      </div>

      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradua-perfil rounded-full transition-all duration-500"
          style={{ width: `${integral ?? 0}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">CRÉDITOS</p>
          <p className="text-lg font-black text-gradua-perfil">
            {loading ? '—' : (creditsDone != null ? `${creditsDone} / ${creditsTotal}` : '—')}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">HORAS PEND.</p>
          <p className="text-lg font-black text-gradua-perfil">
            {loading ? '—' : (hours != null ? `${hours}h` : '—')}
          </p>
        </div>
      </div>
    </div>
  );
};

const CentralAlunoItem = ({ icon: Icon, title, subtitle, isRed = false, onClick }) => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 cursor-pointer group" onClick={onClick}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isRed ? 'bg-red-50 group-hover:bg-red-100' : 'bg-gradua-perfil/5 group-hover:bg-gradua-perfil/10'}`}>
      <Icon size={20} className={isRed ? 'text-red-500' : 'text-gradua-perfil'} />
    </div>
    <div className="flex-1">
      <p className={`text-base font-bold m-0 ${isRed ? 'text-red-600' : 'text-gradua-perfil'}`}>{title}</p>
      <p className={`text-xs mt-0.5 font-medium ${isRed ? 'text-red-400' : 'text-gray-500'}`}>{subtitle}</p>
    </div>
    <ChevronRight size={20} className={isRed ? 'text-red-400' : 'text-gray-400'} />
  </div>
);

const ADMIN_ROLES = ['ADMIN', 'MONITOR', 'PROFESSOR'];

const EditProfilePanel = ({ profile, onClose, onSave, saving }) => {
  const [email, setEmail] = useState(profile?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const documentValue = profile?.cpf || profile?.passport || '—';

  const handleSave = async () => {
    setError('');
    if (!currentPassword) {
      setError('Senha atual é obrigatória');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError('Nova senha e confirmação não conferem');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    await onSave({ email: email || undefined, currentPassword, newPassword: newPassword || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gradua-perfil">Editar Perfil</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Documento (CPF/Passaporte)</label>
            <input
              type="text"
              value={documentValue}
              disabled
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl font-medium cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1 font-medium">O documento não pode ser alterado.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-perfil focus:ring-2 focus:ring-gradua-perfil/20 focus:bg-white outline-none transition-all font-medium"
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3">Alterar Senha (opcional)</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Senha Atual</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-perfil focus:ring-2 focus:ring-gradua-perfil/20 focus:bg-white outline-none transition-all font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nova Senha</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Nova senha"
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-perfil focus:ring-2 focus:ring-gradua-perfil/20 focus:bg-white outline-none transition-all font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirmar Nova Senha</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-perfil focus:ring-2 focus:ring-gradua-perfil/20 focus:bg-white outline-none transition-all font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradua-perfil text-white py-4 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-gradua-perfil/20 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CentralAlunoCard = ({ user, profile, stats, onEditClick, showToast }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isPrivileged = ADMIN_ROLES.includes(user?.role?.toUpperCase() || '');
  const roleLabel = user?.role?.toUpperCase() === 'ADMIN' ? 'Administrador'
    : user?.role?.toUpperCase() === 'PROFESSOR' ? 'Professor'
    : 'Aluno';

  return (
    <div className="bg-white rounded-3xl p-6 mb-28 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50">
      <h3 className="text-lg font-black text-gradua-perfil mb-2">{`Central do ${roleLabel}`}</h3>
      <div className="flex flex-col">
        <CentralAlunoItem icon={FileText} title="Meus Documentos" subtitle="RG, CPF e Comprovante de Residência" onClick={() => navigate('/documentos')} />
        {!isPrivileged && (
          <CentralAlunoItem icon={History} title="Histórico Escolar" subtitle="Emitir via PDF oficial" onClick={async () => {
            try {
              const historyData = await academicHistoryService.getHistory();
              gerarHistoricoEscolar(profile, historyData, stats);
            } catch (err) {
              showToast('Erro ao gerar histórico: ' + (err.message || ''), 'error');
            }
          }} />
        )}
        <CentralAlunoItem icon={KeyRound} title="Alterar Senha / Email" subtitle="Segurança e recuperação de conta" onClick={onEditClick} />
        {isPrivileged && (
          <CentralAlunoItem
            icon={ShieldAlert}
            title="Painel Administrativo"
            subtitle="Moderação de conteúdo e avisos docentes"
            onClick={() => navigate('/admin')} />
        )}
        <CentralAlunoItem
          icon={LogOut}
          title="Sair da Conta"
          subtitle="Encerrar sessão no dispositivo"
          isRed
          onClick={() => { logout(); navigate('/login'); }}
        />
      </div>
    </div>
  );
};

const PerfilScreen = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const navigate = useNavigate();
  const isPrivileged = ADMIN_ROLES.includes(user?.role?.toUpperCase() || '');

  const loadProfile = () => {
    Promise.all([
      apiClient.get('/dashboard/profile').catch(() => null),
      apiClient.get('/dashboard/stats').catch(() => null),
    ]).then(([profileData, statsData]) => {
      setProfile(profileData);
      if (profileData) {
        localStorage.setItem('gradua_profile', JSON.stringify(profileData));
      }
      setStats(statsData);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const result = await apiClient.upload('/dashboard/profile/photo', formData);
      setProfile(prev => ({ ...prev, profilePhoto: result.photoUrl }));
      localStorage.setItem('gradua_profile', JSON.stringify({ ...profile, profilePhoto: result.photoUrl }));
    } catch (err) {
      showToast(err.message || 'Erro ao fazer upload da foto', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleProfileSave = async (data) => {
    setSavingProfile(true);
    try {
      const updated = await apiClient.put('/dashboard/profile', data);
      setProfile(updated);
      localStorage.setItem('gradua_profile', JSON.stringify(updated));
      setShowEditPanel(false);
    } catch (err) {
      showToast(err.message || 'Erro ao salvar perfil', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab='profile' />
      <main className="flex-1 px-4 py-5 overflow-y-auto">
        <ProfileCard profile={profile} loading={loading} onPhotoChange={handlePhotoChange} uploadingPhoto={uploadingPhoto} />
        {!isPrivileged && <IRACard ira={profile?.ira} loading={loading} />}
        {!isPrivileged && <ProgressCard stats={stats} loading={loading} />}
        <CentralAlunoCard user={user} profile={profile} stats={stats} onEditClick={() => setShowEditPanel(true)} showToast={showToast} />
      </main>
      <BottomNavBar activeTab="profile" />

      {showEditPanel && (
        <EditProfilePanel
          profile={profile}
          onClose={() => setShowEditPanel(false)}
          onSave={handleProfileSave}
          saving={savingProfile}
        />
      )}
    </div>
  );
};

export default PerfilScreen;