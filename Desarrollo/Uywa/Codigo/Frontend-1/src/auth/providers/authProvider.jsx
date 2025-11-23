import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

export const AuthProvider = ({children})=>{
    const {
        user,
        logout,
        token,
        isAuthenticated,    
        setAuthChecked,
        clearUser
    } = useAuthStore();
    
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const checkAuth = async()=>{
            try {
                if(user && token){
                    const response = await fetch('http://localhost:4000/api/auth/verify-token',{
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if(!response.ok){
                        logout();
                        clearUser();
                        return;
                    }

                    if(token && !user){
                        logout();
                        clearUser();
                        return;
                    }

                    const userData = await response.json();
                    useAuthStore.getState().setUser(userData);
                    setAuthChecked(true);
                }     
            } catch (error) {
                console.error("Error verifying token:", error);
                logout();
                clearUser();
            }

            finally{
                setLoading(false);
                setAuthChecked(true);
        }
    }
    checkAuth();
    },[user, token, logout, isAuthenticated,clearUser , setAuthChecked]);

    if(loading){
        return <h1>Cargando...</h1>
    }
    
    return <>{children}</>;
}