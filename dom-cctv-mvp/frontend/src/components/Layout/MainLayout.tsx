// src/components/Layout/MainLayout.tsx
// Layout principal de la aplicación

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  VideoLibrary,
  ExitToApp,
  Videocam,
  Assignment,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const drawerWidth = 240;

/**
 * Layout principal con sidebar y header
 */
const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, logout, getInitials } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  // Elementos de navegación
  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
    },
    {
      text: 'Eventos',
      icon: <VideoLibrary />,
      path: '/events',
    },
    {
      text: 'Documentar',
      icon: <Assignment />,
      path: '/undocumented-events',
    },
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%',
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRight: '1px solid #e2e8f0',
    }}>
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        mb: 2,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '12px',
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            mr: 1.5,
          }}>
            <Videocam sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography variant="h6" noWrap component="div" color="white" fontWeight="bold">
            DOM CCTV
          </Typography>
        </Box>
      </Toolbar>
      
      <List sx={{ px: 2 }}>
        {navigationItems.map((item) => {
          const isSelected = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
              sx={{
                borderRadius: '12px',
                py: 1.5,
                px: 2,
                transition: 'all 0.2s ease-in-out',
                '&.Mui-selected': {
                  bgcolor: 'rgba(37, 99, 235, 0.12)',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  '&:hover': {
                    bgcolor: 'rgba(37, 99, 235, 0.16)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(37, 99, 235, 0.06)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: '40px',
                transition: 'color 0.2s ease-in-out',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }}
              />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {/* Decorative gradient at bottom */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(0deg, rgba(37, 99, 235, 0.05) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Videovigilancia
          </Typography>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 500 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Tooltip title="Cuenta">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Avatar sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'secondary.main',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                }}>
                  {getInitials()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <AccountCircle sx={{ mr: 1 }} />
                Mi Perfil
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation folders"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;