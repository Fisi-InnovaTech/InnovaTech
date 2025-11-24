import { create } from "zustand";
import { persist } from "zustand/middleware";

// Store to manage user authentication state
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      authChecked: false,
      token: null,

      setUser: (userData) => set({ user: userData }),
      setAuthChecked: (checked) => set({ authChecked: checked }),
      setToken: (token) => set({ token: token }),

      login: (responseData) =>
        set({
          user: {
            email: responseData.email,
            nombres: responseData.nombres,
            apellidos: responseData.apellidos,
            rol: responseData.rol,
          },
          token: responseData.access_token,
          authChecked: true,
        }),

      logout: () => set({ user: null, token: null, authChecked: true }),

      getUserRole: () => {
        const user = get().user;
        return user ? user.rol : null;
      },

      getFullName: () => {
        const user = get().user;
        return user ? `${user.nombres} ${user.apellidos}` : "";
      },

      isAuthenticated: () => {
        return Boolean(get().user);
      },

      clearUser: () => set({ user: null, token: null, authChecked: true }),
    }),
    {
      name: "auth-storage", // nombre del item en localStorage
    }
  )
);