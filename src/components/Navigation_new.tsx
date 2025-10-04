import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Calculate as CalculateIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  AccountBalance as CoinsIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

interface NavigationProps {
  currentUser?: { id: string; email: string; name: string; role: string };
}

const Navigation = ({ currentUser }: NavigationProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = currentUser?.role === 'representative' ? [
    { path: '/representative-dashboard', icon: PeopleIcon, label: 'Representative Dashboard' },
    { path: '/settings', icon: SettingsIcon, label: t('nav.settings') },
    { path: '/help', icon: HelpIcon, label: t('nav.help') },
  ] : [
    { path: '/', icon: DashboardIcon, label: t('nav.dashboard') },
    { path: '/transactions', icon: ReceiptIcon, label: t('nav.transactions') },
    { path: '/calculator', icon: CalculateIcon, label: t('nav.calculator') },
    { path: '/payments', icon: CreditCardIcon, label: t('nav.payments') },
    { path: '/planning', icon: CalendarIcon, label: t('nav.planning') },
    { path: '/settings', icon: SettingsIcon, label: t('nav.settings') },
    { path: '/help', icon: HelpIcon, label: t('nav.help') },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Ḥuqúqu’lláh
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive(item.path)}
                onClick={handleDrawerToggle}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)' }}>
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(45deg, #ffeb3b 30%, #ffc107 90%)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <CoinsIcon sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  Ḥuqúqu’lláh
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Assistant
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <IconButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.7)',
                      backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                    }}
                  >
                    <Icon sx={{ mr: 1 }} />
                    <Typography variant="body2">{item.label}</Typography>
                  </IconButton>
                );
              })}
            </Box>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
