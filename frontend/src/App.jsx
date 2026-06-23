import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AgendaPage from './pages/AgendaPage';
import ForumScreen from './pages/ForumScreen';
import PerfilScreen from './pages/PerfilScreen';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import MeusDocumentosPage from './pages/MeusDocumentosPage';
import AdminScreen from './components/AdminScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import RedirectHome from './components/RedirectHome';
import NotificationToast from './components/NotificationToast';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      {/* Toast global de notificações — aparece em todas as páginas autenticadas */}
      <NotificationToast />

      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<RedirectHome />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/forum" element={<ForumScreen />} />
          <Route path="/perfil" element={<PerfilScreen />} />
          <Route path="/documentos" element={<MeusDocumentosPage />} />
        </Route>

        {/* Rotas restritas a ADMIN / MONITOR / PROFESSOR */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminScreen />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
