import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const RouteGuard = ({ children, requireAuth = true, requiredRoles = [] }) => {
  const { user, authChecked } = useAuthStore();

  // Esperar a que se verifique la autenticación
  if (!authChecked) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h1>Verificando autenticación...</h1>
      </div>
    );
  }

  // Si requiere autenticación y no hay usuario
  if (requireAuth && !user) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  // Si NO requiere autenticación pero SÍ hay usuario (ej: página de login)
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  // Si hay roles requeridos, verificar que el usuario tenga uno de ellos
  if (requiredRoles.length > 0 && user) {
    // Verificar si el rol del usuario está en la lista de roles requeridos
    const hasRequiredRole = requiredRoles.includes(user.rol);
    
    if (!hasRequiredRole) {
      // Redirigir a home si no tiene el rol necesario
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};