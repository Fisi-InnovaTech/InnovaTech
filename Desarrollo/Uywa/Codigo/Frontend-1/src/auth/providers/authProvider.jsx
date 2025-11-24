import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";

export const AuthProvider = ({ children }) => {
  const { user, token, setAuthChecked, clearUser, setUser } = useAuthStore();
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
        const response = await fetch("http://localhost:3000/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token inválido, limpiar estado
          clearUser();
        } else {
          // Token válido, actualizar datos del usuario si no existen
          if (!user) {
            const userData = await response.json();
            setUser(userData);
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
  }, []); // Array vacío para ejecutar solo una vez

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