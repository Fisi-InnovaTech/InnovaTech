import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { ReactComponent as Logo } from '../logoprincipal.svg';
import { Link } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import LoginIcon from '@mui/icons-material/Login';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';

const pages = [
  { id: 'home', path: '/', name: 'Inicio' },
  { id: 'report', path: '/realizar-alerta', name: 'Reportar' },
  { id: 'alerts', path: '/ver-alerta', name: 'Ver Alertas' },
  { id: 'events', path: '/informacion-trafico-animales', name: 'Eventos' },
];

const settings = [
  { id: 'profile', name: 'Perfil' },
  { id: 'logout', name: 'Cerrar Sesion' }
];

function ResponsiveAppBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (event) => {
    setAnchorElUser(null);
    const setting = event.target.innerText;
    if (setting === "Perfil") {
      window.location.href = '/perfil';
    }
    else if (setting === "Cerrar Sesion") {
      window.localStorage.removeItem('UW-logged-session');
      window.localStorage.removeItem('UW-mod-logged-session');
      window.location.href = '/';
    }
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const token = window.localStorage.getItem('UW-logged-session') || window.localStorage.getItem('UW-mod-logged-session');
    setIsLoggedIn(!!token);
    setIsMod(!!window.localStorage.getItem('UW-mod-logged-session'));
  }, []);

  const DrawerList = (
    <Box sx={{ width: 250 }}>
      <List>
        {!isMod && pages.map((page) => (
          <ListItem key={page.id} disablePadding>
            <ListItemButton component={Link} to={page.path}>
              <ListItemIcon>
                {page.id === 'home' ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" sx={{ background: '#FFFFFF' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: '70px' }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 10 }}>
            <Logo alt="UWYA Logo" />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon className='dark-theme' />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Logo alt="UWYA Logo" />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {!isMod && pages.map((page) => (
              <Link key={page.id} to={page.path} style={{ textDecoration: 'none' }}>
                <Button
                  sx={{ my: 2, mr: 3, color: '#212429', display: 'block', fontWeight: 'bold' }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          {!isLoggedIn ? (
            <Box sx={{ flexGrow: 0, borderRadius: '10px' }}>
              <Link to="/iniciar-sesion" style={{ textDecoration: 'none' }}>
                <Button variant="contained" sx={{ backgroundColor: '#3AB795', color: '#FFFFFF', border: 'none', display: { xs: 'none', md: 'flex' } }}>
                  Iniciar Sesión
                </Button>
                <IconButton sx={{ backgroundColor: '#3AB795', color: '#FFFFFF', border: 'none', display: { xs: 'flex', md: 'none' } }}>
                  <LoginIcon />
                </IconButton>
              </Link>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Configuración">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png" />
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
                {settings.map((setting) => (
                  <MenuItem key={setting.id} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;