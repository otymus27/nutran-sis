import React from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const SidebarMenuItem = ({
  menu,
  openMenus,
  handleToggleMenu,
  handleNavigate,
  currentPath,
}) => {
  const isOpen = openMenus[menu.key];

  return (
    <>
      <ListItemButton onClick={() => handleToggleMenu(menu.key)}>
        <ListItemIcon>{menu.icon}</ListItemIcon>
        <ListItemText primary={menu.text} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menu.children.map((child) => (
            <ListItemButton
              key={child.text}
              sx={{ pl: 4 }}
              selected={currentPath === child.path}
              onClick={() => handleNavigate(child.path)}
            >
              <ListItemIcon>{child.icon}</ListItemIcon>
              <ListItemText primary={child.text} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default SidebarMenuItem;
