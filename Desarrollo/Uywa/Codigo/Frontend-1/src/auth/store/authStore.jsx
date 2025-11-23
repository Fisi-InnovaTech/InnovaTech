import { create } from "zustand"
import {persist} from "zustand/middleware"
// Store to manage user authentication state
export const useAuthStore =create(
    persist((set,) => ({
    user: null,
    authChecked: false,
    token: null,

    setUser: (userData) => set({ user: userData}),
    setAuthChecked: (checked) => set({ authChecked: checked }),
    setToken: (token) => set({ token: token }),

    login: (responseData) => set({ 
        user: {
          email: responseData.email,
          nombres: responseData.nombres,
          apellidos: responseData.apellidos,
          rol: responseData.rol
        }, 
        token: responseData.access_token,
        authChecked: true 
    }),


    logout: () => set({ user: null, token: null, authChecked: true }),

    getUserRole: () => {
        const user = useAuthStore.getState().user;
        return user ? user.rol : null;
    },

    getFullName: () => {
        const user = useAuthStore.getState().user;
        return user ? `${user.nombres} ${user.apellidos}` : '';
    },

    isAuthenticated: () => {
        return Boolean(useAuthStore.getState().user);
    },

    clearUser: () => set({ user: null, authChecked: true }),

    
})));

