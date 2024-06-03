import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
//import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import {ReactComponent as Logo} from '../logoprincipal.svg';
import { Link } from "react-router-dom";
//new
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const pages = [
  { path: '/', name: 'Inicio' },
  { path: '/realizar-alerta', name: 'Reportar' },
  { path: '/ver-alerta', name: 'Ver Alertas' },
  { path: '/realizar-alerta', name: 'Eventos' },
  { path: '/realizar-alerta', name: 'Sobre Nosotros' },
  { path: '/realizar-alerta', name: 'Contactanos' },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {pages.map((page, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" sx={{background:'#FFFFFF'}}>
      <Container maxWidth="x1" >
        <Toolbar disableGutters sx={{height:'70px'}}>
          <Box sx={{display: { xs: 'none', md: 'flex' }, ml:10}}><Logo/></Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton 
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon className='dark-theme' />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
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
