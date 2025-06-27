import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const ModeratorRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        const verifyModerator = async () => {
            const token = localStorage.getItem('authToken');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            if (!token || !userData?.isModerator) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('https://innovatech-ztzv.onrender.com/auth/verify-moderator', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Invalid moderator');
                }

                setIsValidating(false);
            } catch (error) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                navigate('/login');
            }
        };

        verifyModerator();
    }, [navigate]);

    if (isValidating) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return children;
};

export default ModeratorRoute;