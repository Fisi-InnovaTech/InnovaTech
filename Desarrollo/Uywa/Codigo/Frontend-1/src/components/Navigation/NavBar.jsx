import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LoginIcon from '@mui/icons-material/Login';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../../auth/store/authStore';

// Páginas para usuarios regulares
const userPages = [
  { id: 'home', path: '/', name: 'Inicio', icon: <HomeIcon /> },
  { id: 'report', path: '/realizar-alerta', name: 'Reportar', icon: <ReportIcon /> },
  { id: 'events', path: '/informacion-trafico-animales', name: 'Eventos', icon: <EventIcon /> },
  { id: 'alerts', path: '/ver-alerta', name: 'Ver Alertas', icon: <VisibilityIcon /> },
  { id: 'animals', path: '/ver-animales', name: 'Animales', icon: <ReportIcon />}
];

// Páginas para moderadores
const moderatorPages = [
  { id: 'moderator', path: '/moderador', name: 'Inicio', icon: <HomeIcon /> },
  { id: 'alerts', path: '/ver-alerta', name: 'Ver Alertas', icon: <VisibilityIcon /> },
  { id: 'reports', path: '/moderador-reportes', name: 'Reportes', icon: <AssessmentIcon /> },
  { id: 'statistics', path: '/estadistica', name: 'Estadísticas', icon: <BarChartIcon /> },
  { id: 'events', path: '/informacion-trafico-animales', name: 'Eventos', icon: <EventIcon /> },
];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const { user, logout, getFullName } = useAuthStore();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [open, setOpen] = useState(false);

  // Determinar si el usuario es moderador o admin
  const isModerator = user?.rol === 'moderador' || user?.rol === 'admin';
  
  // Seleccionar las páginas según el rol
  const pages = isModerator ? moderatorPages : userPages;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfileClick = () => {
    handleCloseUserMenu();
    navigate('/perfil');
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const getIconForPage = (pageId) => {
    const page = [...userPages, ...moderatorPages].find(p => p.id === pageId);
    return page?.icon || <HomeIcon />;
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#3AB795', fontWeight: 'bold' }}>
          {user ? `Hola, ${user.nombres}` : 'Menú'}
        </Typography>
        {user && (
          <Typography variant="caption" sx={{ color: '#666' }}>
            {user.rol === 'moderador' ? 'Moderador' : user.rol === 'admin' ? 'Administrador' : 'Usuario'}
          </Typography>
        )}
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page.id} disablePadding>
            <ListItemButton component={Link} to={page.path}>
              <ListItemIcon sx={{ color: '#3AB795' }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {user && (
        <>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleProfileClick}>
                <ListItemIcon sx={{ color: '#3AB795' }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Perfil" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon sx={{ color: '#f44336' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <AppBar position="fixed" sx={{ background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: '70px' }}>
          {/* Logo Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <Typography
              variant="h6"
              component={Link}
              to={isModerator ? '/moderador' : '/'}
              sx={{
                fontWeight: 'bold',
                color: '#3AB795',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              UWYA
            </Typography>
          </Box>

          {/* Menu Icon Mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: '#3AB795' }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
          </Box>

          {/* Logo Mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
            <Typography
              variant="h6"
              component={Link}
              to={isModerator ? '/moderador' : '/'}
              sx={{
                fontWeight: 'bold',
                color: '#3AB795',
                textDecoration: 'none'
              }}
            >
              UWYA
            </Typography>
          </Box>

          {/* Navigation Links Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {pages.map((page) => (
              <Link key={page.id} to={page.path} style={{ textDecoration: 'none' }}>
                <Button
                  sx={{
                    my: 2,
                    mx: 1,
                    color: '#212429',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: '500',
                    '&:hover': {
                      color: '#3AB795',
                      backgroundColor: 'rgba(58, 183, 149, 0.1)'
                    }
                  }}
                >
                  {page.icon}
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          {/* User Menu or Login Button */}
          {!user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Link to="/iniciar-sesion" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{
                    backgroundColor: '#3AB795',
                    color: '#FFFFFF',
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': {
                      backgroundColor: '#2d9478'
                    }
                  }}
                >
                  Iniciar Sesión
                </Button>
                <IconButton
                  sx={{
                    backgroundColor: '#3AB795',
                    color: '#FFFFFF',
                    display: { xs: 'flex', md: 'none' },
                    '&:hover': {
                      backgroundColor: '#2d9478'
                    }
                  }}
                >
                  <LoginIcon />
                </IconButton>
              </Link>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* User Name (Desktop only) */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body2" sx={{ color: '#212429', fontWeight: '600' }}>
                  {getFullName()}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {user.rol === 'moderador' ? 'Moderador' : user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </Typography>
              </Box>

              {/* Avatar with Menu */}
              <Tooltip title="Configuración">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={getFullName()}
                    src="https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png"
                    sx={{
                      border: '2px solid #3AB795'
                    }}
                  />
                </IconButton>
              </Tooltip>
              
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* User info in menu (Mobile) */}
                <Box sx={{ px: 2, py: 1, display: { xs: 'block', md: 'none' } }}>
                  <Typography variant="body2" sx={{ fontWeight: '600' }}>
                    {getFullName()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" sx={{ color: '#3AB795' }} />
                  </ListItemIcon>
                  <Typography textAlign="center">Perfil</Typography>
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: '#f44336' }} />
                  </ListItemIcon>
                  <Typography textAlign="center" sx={{ color: '#f44336' }}>
                    Cerrar Sesión
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;