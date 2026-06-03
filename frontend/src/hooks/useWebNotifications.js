/**
 * useWebNotifications.js
 *
 * Hook para gerenciar notificações push nativas do navegador (Web Notifications API).
 * Persiste IDs "já vistos" no localStorage para evitar re-disparar em reloads.
 */
import { useState, useEffect, useCallback } from 'react';

const ICON_URL = '/images/icon-192.png';
const STORAGE_KEY = 'gradua_seen_notif_ids';

/** Carrega set de IDs já vistos do localStorage */
function loadSeenIds() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return new Set(raw ? JSON.parse(raw) : []);
    } catch {
        return new Set();
    }
}

/** Persiste set de IDs vistos no localStorage (mantém últimos 200) */
function saveSeenIds(set) {
    try {
        const arr = [...set].slice(-200);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch {
        // ignorado
    }
}

export function useWebNotifications() {
    const [permission, setPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'denied'
    );

    const requestPermission = useCallback(async () => {
        if (typeof Notification === 'undefined') return 'denied';
        if (Notification.permission === 'granted') {
            setPermission('granted');
            return 'granted';
        }
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    }, []);

    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            requestPermission();
        }
    }, [requestPermission]);

    /**
     * Dispara uma notificação push nativa do navegador.
     * @param {{ title: string, body: string, icon?: string, tag?: string }} opts
     */
    const pushNotify = useCallback(({ title, body, icon, tag } = {}) => {
        if (typeof Notification === 'undefined') return;
        if (Notification.permission !== 'granted') return;

        const n = new Notification(title, {
            body,
            icon: icon || ICON_URL,
            badge: ICON_URL,
            tag: tag || `gradua-${Date.now()}`,
            requireInteraction: false,
        });

        setTimeout(() => n.close(), 7000);
        return n;
    }, []);

    return { permission, requestPermission, pushNotify, loadSeenIds, saveSeenIds };
}
