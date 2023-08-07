import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupsIcon from '@mui/icons-material/Groups';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import EventIcon from '@mui/icons-material/Event';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Avatar, Fab, Menu, MenuItem, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright Un_Knwn © '}
      <Link color="inherit" href="https://mui.com/">
        Event Management For Zen Class
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


const { palette } = createTheme();
const { augmentColor } = palette;
  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const defaultTheme = createTheme({
  palette: {
    tang: createColor('#222831'),
    orange: createColor('#00ADB5'),
    darkblue: createColor('#282C34'),
    tertiary: createColor('#7C735F')
  }
});

export default function Base({title, description, children}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userName, setUserName] = useState('');

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = ()=>{
    sessionStorage.clear();
    navigate('/')
    toast.done('Logged out')
  }

  const handleBackButtonClick = () => {
    navigate(-1); 
  };

      // Fetching user name
      const getUser = async() => {
        const token = sessionStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const { firstName, lastName } = decodedToken;
          const fullName = `${firstName} ${lastName}`;
          setUserName(fullName);
        }
      };

      useEffect(() => {
        getUser();
      }, [])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" style={{background:"#222831"}} open={open}>
          <Toolbar
            sx={{
              pr: '24px', 
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {title}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color='orange'>
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Box sx={{ flexGrow: 0, ml: 4 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userName} src='' />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
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
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{userName}</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={()=>logout()}>Logout</Typography>
                </MenuItem>
              
            </Menu>
          </Box>

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            {/* <h3 style={{alignItems:"flex-start"}}>Zen Event</h3> */}
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
  
          <ListItemButton onClick={()=>navigate('/dashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary= "Dashboard" />
      </ListItemButton>

            <Divider sx={{ my: 1 }} />
            
            <ListItemButton onClick={()=>navigate('/event')}>
        <ListItemIcon>
          <EventIcon />
        </ListItemIcon>
        <ListItemText primary="Events" />
      </ListItemButton>
      <ListItemButton onClick={()=>navigate('/batch')}>
        <ListItemIcon>
          <GroupsIcon />
        </ListItemIcon>
        <ListItemText primary="Batches" />
      </ListItemButton>
      <ListItemButton onClick={()=>navigate('/student')}>
        <ListItemIcon>
          <PermContactCalendarIcon />
        </ListItemIcon>
        <ListItemText primary="Students" />
      </ListItemButton>
      <ListItemButton onClick={()=>navigate('/mentors')}>
        <ListItemIcon>
          <AdminPanelSettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Mentors" />
      </ListItemButton>

          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Fab color="tang" size="small" onClick={handleBackButtonClick} aria-label="add" sx={{m: 2}}>
        <ArrowBackIcon />
          </Fab>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
         
              <div>
        <main>
            <h2>{description}</h2>
            <div>{children}</div>
        </main>
                </div>            
          </Container>
          <footer>
          <Copyright sx={{ pt: 4 }} />
          </footer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

