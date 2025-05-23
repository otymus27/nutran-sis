// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { ExpandLess, ExpandMore, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { menuStructure } from '../../components/Menu/Menu';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 260;

const Sidebar = () => {
  const { user, loading } = useAuth();
  const [openMenus, setOpenMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  if (loading) return <Typography>Carregando...</Typography>;
  if (!user) return <Typography>Acesso negado</Typography>;
  const role = user?.roles?.[0]?.nome?.toUpperCase() || '';

  const handleToggleMenu = (key) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  if (!menuStructure || !Array.isArray(menuStructure)) return null;

  const drawerContent = (
    <Box
      sx={{
        width: isMobile ? '75vw' : drawerWidth,
        backgroundColor: theme.palette.background.paper,
        height: '100%',
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ m: 'auto' }}>
          Gerenciador
        </Typography>
      </Toolbar>
      <List>
        {menuStructure.map((menu) => {
          const userCanSeeMenu = !menu.allowedRoles || menu.allowedRoles.map((r) => r.toUpperCase()).includes(role);
          if (!userCanSeeMenu) return null;

          const filteredChildren = (menu.children || []).filter(
            (child) => !child.allowedRoles || child.allowedRoles.map((r) => r.toUpperCase()).includes(role),
          );

          if (filteredChildren.length === 0) return null;

          return (
            <React.Fragment key={menu.key}>
              <ListItemButton onClick={() => handleToggleMenu(menu.key)}>
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.text} />
                {openMenus[menu.key] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMenus[menu.key]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {filteredChildren.map((child) => (
                    <ListItemButton
                      key={child.key || child.text}
                      sx={{ pl: 4 }}
                      onClick={() => handleNavigate(child.path)}
                    >
                      <ListItemIcon>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton onClick={() => setMobileOpen(true)} sx={{ position: 'fixed', top: 16, left: 16, zIndex: 2000 }}>
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? '75vw' : drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
