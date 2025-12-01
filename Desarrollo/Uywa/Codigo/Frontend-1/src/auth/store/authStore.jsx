import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      authChecked: false,
      token: null,

      setUser: (userData) => set({ user: userData }),
      setAuthChecked: (checked) => set({ authChecked: checked }),
      setToken: (token) => set({ token: token }),

      login: (responseData) => {
        console.log('Login data:', responseData);
        set({
          user: {
            id: responseData.id, // AÑADIR ESTO
            email: responseData.email,
            nombres: responseData.nombres,
            apellidos: responseData.apellidos,
            rol: responseData.rol,
          },
          token: responseData.access_token,
          authChecked: true,
        });
      },

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

      // AÑADIR ESTA FUNCIÓN PARA ACTUALIZAR EL USUARIO CON EL ID
      updateUserWithId: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              id: userData.id,
              email: userData.email,
              rol: userData.rol
            }
          });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);