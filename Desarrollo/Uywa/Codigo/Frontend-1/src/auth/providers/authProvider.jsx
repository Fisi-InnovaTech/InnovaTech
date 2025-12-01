import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";

export const AuthProvider = ({ children }) => {
  const { user, token, setAuthChecked, clearUser, setUser, updateUserWithId } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Evitar ejecuciones múltiples
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAuth = async () => {
      try {
        // Si no hay token, marcar como verificado y continuar
        if (!token) {
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        // Verificar el token con el servidor
        const response = await fetch("https://backend-uywa.onrender.com/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token inválido, limpiar estado
          clearUser();
        } else {
          const data = await response.json();
          
          if (data.valid) {
            // Token válido
            const userData = data.user; // { id, email, rol }
            
            if (!user) {
              // Si no hay usuario, establecer uno básico
              setUser({
                email: userData.email,
                nombres: "", // No vienen en la verificación
                apellidos: "", // No vienen en la verificación
                rol: userData.rol,
              });
            }
            
            // Actualizar el usuario con el ID
            updateUserWithId(userData);
          } else {
            clearUser();
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        clearUser();
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [token, user, setAuthChecked, clearUser, setUser, updateUserWithId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Cargando...</h1>
      </div>
    );
  }

  return <>{children}</>;
};