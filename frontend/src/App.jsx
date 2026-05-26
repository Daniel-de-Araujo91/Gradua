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

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rotas privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/forum" element={<ForumScreen />} />
        <Route path="/perfil" element={<PerfilScreen />} />
        <Route path="/documentos" element={<MeusDocumentosPage />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;