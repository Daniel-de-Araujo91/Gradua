import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Rota protegida por role.
 * Apenas usuários com role ADMIN ou MONITOR podem acessar o Painel.
 * Usuários autenticados mas sem permissão são redirecionados para /.
 */
const ALLOWED_ROLES = ['ADMIN', 'MONITOR', 'PROFESSOR'];

export default function AdminRoute() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const role = user?.role?.toUpperCase() || '';
    if (!ALLOWED_ROLES.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
