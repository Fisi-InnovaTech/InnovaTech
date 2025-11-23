import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";


export const RouteGuard = ({
    children,
    requireAuth = true,
    requiredRoles = []

    }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, getUserRole, authChecked } = useAuthStore();

    useEffect(() => {
        if (!authChecked) {
            return;
        }

        const authenticated = isAuthenticated();
        const userRole = getUserRole();
        
        if(requireAuth && !authenticated){
            navigate('/iniciar-sesion', {state: { from: location }, replace: true});
            return null;
        };
        
        if (!requireAuth && authenticated) {
            navigate('/', {replace: true});
            return null;
        }
        
        if(requireAuth && authenticated && authChecked && requiredRoles.length > 0){
            const hasRequiredRole = requiredRoles.includes(userRole);
            if(!hasRequiredRole){
                navigate('/', {replace: true});
                return null;
           }
        }
    
        if(!requireAuth && authenticated && userRole =="moderador"){
            navigate('/moderador', {replace: true});
            return null;
        }
    
    }, [
        authChecked,
        isAuthenticated,
        getUserRole,
        requireAuth,
        requiredRoles,
        navigate,
        location
    ])
    
    return children;
}