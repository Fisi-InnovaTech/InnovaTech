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

      login: (responseData) => {
        console.log('Login data recibida:', responseData);
        
        // IMPORTANTE: La respuesta del login NO incluye el id
        // Solo guardamos lo que viene del login
        set({
          user: {
            email: responseData.email,
            nombres: responseData.nombres,
            apellidos: responseData.apellidos,
            rol: responseData.rol,
          },
          token: responseData.access_token,
          authChecked: true,
        });
        
        // Después del login, obtenemos el id del usuario verificando el token
        // Esto se hará automáticamente en el AuthProvider
      },

      // Nueva función para actualizar usuario con ID después de verificar
      updateUserWithId: (userWithId) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              id: userWithId.id // Añadimos el id al usuario existente
            }
          });
        }
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
        return Boolean(get().user && get().token);
      },

      clearUser: () => set({ user: null, token: null, authChecked: true }),
    }),
    {
      name: "auth-storage", // nombre del item en localStorage
    }
  )
);