import { 
  Avatar, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReportIcon from '@mui/icons-material/Report';
import BadgeIcon from '@mui/icons-material/Badge';
import { useAuthStore } from '../../auth/store/authStore';

const API_URL = import.meta.env.VITE_API_URL || '/api';


const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [alertCount, setAlertCount] = useState(0);
  const [userStats, setUserStats] = useState(null);


  // Fetch user alerts count
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user || !token) {
        navigate('/iniciar-sesion');
        return;
      }

      try {
        setLoading(true);
        
        // TODO: Reemplaza esta URL con tu endpoint real
        // Endpoint sugerido: GET /api/users/me/stats
        const response = await fetch(`${API_URL}/users/me/alerts/count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAlertCount(data.count || 0);
          setUserStats(data);
        } else {
          // Si falla, usar valor por defecto
          setAlertCount(0);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setAlertCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user, token, navigate]);

  if (!user) {
    return null;
  }

  // Generar iniciales para el avatar
  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres?.charAt(0) || '';
    const lastInitial = apellidos?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const getRoleColor = (rol) => {
    switch (rol) {
      case 'admin':
        return '#f44336';
      case 'moderador':
        return '#ff9800';
      default:
        return '#3AB795';
    }
  };

  const getRoleLabel = (rol) => {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'moderador':
        return 'Moderador';
      default:
        return 'Usuario';
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'calc(100vh - 64px)',
          mt: 8
        }}
      >
        <CircularProgress sx={{ color: '#3AB795' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#f5f5f5',
      py: { xs: 10, md: 12 },
      px: 2 
    }}>
      <Box sx={{ maxWidth: '1000px', width: '100%' }}>
        {/* Header Card con Avatar */}
        <Card sx={{ 
          mb: 3, 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'visible'
        }}>
          {/* Banner superior */}
          <Box sx={{ 
            height: 150, 
            background: 'linear-gradient(135deg, #3AB795 0%, #2d9478 100%)',
            position: 'relative'
          }}>
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>

          <CardContent sx={{ pt: 0 }}>
            {/* Avatar */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: -8 
            }}>
              <Avatar
                alt={`${user.nombres} ${user.apellidos}`}
                sx={{
                  width: 150,
                  height: 150,
                  border: '5px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  backgroundColor: getRoleColor(user.rol),
                  fontSize: '3rem',
                  fontWeight: 'bold'
                }}
              >
                {getInitials(user.nombres, user.apellidos)}
              </Avatar>
            </Box>

            {/* Información del Usuario */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {user.nombres} {user.apellidos}
              </Typography>
              
              <Chip 
                label={getRoleLabel(user.rol)}
                size="small"
                sx={{ 
                  backgroundColor: getRoleColor(user.rol),
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 1
                }}
              />

            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Información de Contacto */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <EmailIcon sx={{ color: '#3AB795' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Correo Electrónico
                    </Typography>
                    <Typography variant="body1">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                
              </Grid>
            </Grid>
          </CardContent>
        </Card>

      </Box>
    </Box>
  );
};

export default Profile;