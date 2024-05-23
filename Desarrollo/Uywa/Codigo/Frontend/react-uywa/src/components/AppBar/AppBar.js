import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {ReactComponent as Logo} from '../logoprincipal.svg';
import { Link } from "react-router-dom";

const pages = [
  { path: '/', name: 'Inicio' },
  { path: '/realizar-alerta', name: 'Reportar' },
  { path: '/ver-alerta', name: 'Ver Alertas' },
  { path: '/realizar-alerta', name: 'Eventos' },
  { path: '/realizar-alerta', name: 'Sobre Nosotros' },
  { path: '/realizar-alerta', name: 'Contactanos' },
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{background:'#FFFFFF'}}>
      <Container maxWidth="x1">
        <Toolbar disableGutters>
          <Box sx={{display: { xs: 'none', md: 'flex' }, ml:10}}><Logo/></Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton 
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon className='dark-theme' />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => (
                //Corregir enrutamiento(No funciona)
                <Link key={index} to={page.path} style={{ textDecoration: 'none' }}>
                  <MenuItem>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
                
          <Box sx={{flexGrow: 1, display: { xs: 'flex', md: 'none' }}}><Logo/></Box>
  
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
                <Link key={index} to={page.path} style={{ textDecoration: 'none' }}>
                  <Button
                    sx={{ my: 2, mr: 3, color: '#212429', display: 'block', fontWeight: 'bold' }}
                  >
                    {page.name}
                  </Button>
                </Link>
              ))}
          </Box>
          <Box sx={{ flexGrow: 0, backgroundColor: '#3AB795', borderRadius: '10px' }}>
            <Link to="/iniciar-sesion" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" sx={{ color: '#FFFFFF', border: 'none' }}>
              Iniciar Sesión
            </Button>
          </Link>
          </Box>  
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
