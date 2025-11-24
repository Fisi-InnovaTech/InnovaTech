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
import {useAuthStore} from '../auth/store/authStore';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReportIcon from '@mui/icons-material/Report';
import BadgeIcon from '@mui/icons-material/Badge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import primerReporte from '../assets/Logros/PrimerReporte.png';
import segundoReporte from '../assets/Logros/SegundoLogro.png';
import tercerReporte from '../assets/Logros/TercerLogro.png';
import primerLogro from '../assets/Logros/PrimerLogro.png';
import DiezContribuciones from '../assets/Logros/DiezContribuciones.png';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const ACHIEVEMENTS = [
  { 
    id: 'achievement-1', 
    level: 1, 
    name: 'Bienvenido a Uywa', 
    image: primerReporte, 
    rank: 'Aprendiz de Naturaleza',
    required: 1
  },
  { 
    id: 'achievement-2', 
    level: 2, 
    name: 'Primeros Pasos', 
    image: DiezContribuciones, 
    rank: 'Vigilante de la Vida Silvestre',
    required: 5
  },
  { 
    id: 'achievement-3', 
    level: 3, 
    name: 'Amante de los animales', 
    image: primerLogro, 
    rank: 'Guardián del Medio Ambiente',
    required: 10
  },
  { 
    id: 'achievement-4', 
    level: 4, 
    name: 'Guardián de la naturaleza', 
    image: segundoReporte, 
    rank: 'Defensor del Ecosistema',
    required: 25
  },
  { 
    id: 'achievement-5', 
    level: 5, 
    name: 'Protector de la biósfera', 
    image: tercerReporte, 
    rank: 'Héroe de la Tierra',
    required: 50
  },
];

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [alertCount, setAlertCount] = useState(0);
  const [userStats, setUserStats] = useState(null);

  // Calcular rango actual basado en el número de alertas
  const getCurrentRank = (count) => {
    const achievement = [...ACHIEVEMENTS]
      .reverse()
      .find(a => count >= a.required);
    return achievement || ACHIEVEMENTS[0];
  };

  // Obtener logros desbloqueados
  const getUnlockedAchievements = (count) => {
    return ACHIEVEMENTS.filter(a => count >= a.required);
  };

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

  const currentRank = getCurrentRank(alertCount);
  const unlockedAchievements = getUnlockedAchievements(alertCount);
  const nextAchievement = ACHIEVEMENTS.find(a => alertCount < a.required);
  const progress = nextAchievement 
    ? (alertCount / nextAchievement.required) * 100 
    : 100;

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

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: 1,
                mt: 1
              }}>
                <EmojiEventsIcon sx={{ color: '#FFD700' }} />
                <Typography variant="h6" color="text.secondary">
                  {currentRank.rank}
                </Typography>
              </Box>
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

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ReportIcon sx={{ fontSize: 48, color: '#3AB795', mb: 1 }} />
                <Typography variant="h3" fontWeight="bold" color="#3AB795">
                  {alertCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alertas Reportadas
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiEventsIcon sx={{ fontSize: 48, color: '#FFD700', mb: 1 }} />
                <Typography variant="h3" fontWeight="bold" color="#FFD700">
                  {unlockedAchievements.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Logros Desbloqueados
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
            </Card>
          </Grid>
        </Grid>

        {/* Progreso al Siguiente Logro */}
        {nextAchievement && (
          <Card sx={{ 
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progreso al Siguiente Logro
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <img 
                  src={nextAchievement.image} 
                  alt={nextAchievement.name}
                  style={{ width: 50, height: 50 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {nextAchievement.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {alertCount} / {nextAchievement.required} alertas
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                width: '100%', 
                height: 8, 
                backgroundColor: '#e0e0e0',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#3AB795',
                  transition: 'width 0.3s ease'
                }} />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Logros Desbloqueados */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Mis Logros ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </Typography>
            <Grid container spacing={2}>
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
                return (
                  <Grid item xs={12} sm={6} key={achievement.id}>
                    <Card 
                      sx={{ 
                        backgroundColor: isUnlocked ? '#f0f9f6' : '#f5f5f5',
                        opacity: isUnlocked ? 1 : 0.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: isUnlocked ? 'translateY(-4px)' : 'none',
                          boxShadow: isUnlocked ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <img 
                            src={achievement.image} 
                            alt={achievement.name}
                            style={{ 
                              width: 60, 
                              height: 60,
                              filter: isUnlocked ? 'none' : 'grayscale(100%)'
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" fontWeight="bold">
                              {achievement.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {achievement.rank}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                              {isUnlocked ? '✓ Desbloqueado' : `Requiere ${achievement.required} alertas`}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Profile;