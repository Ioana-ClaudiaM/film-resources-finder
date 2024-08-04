import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

function DrawerMenu({ pages, handleDrawerToggle, handleLogout, isDrawerOpen, iconLogout,getIcon }) {
  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
      <List sx={{ width: 250 }}>
        {pages.map((page, index) => (
         <ListItemButton
         key={index}
         component="a"
         href={page.path}
         onClick={page.onClick || handleDrawerToggle}
         sx={{
           justifyContent: 'flex-end',
           textTransform: 'none',
           color: 'inherit',
           paddingLeft: '20px',
           '&:hover': {
             backgroundColor: '#e1c84a',
             color:'black'
           },
         }}
       >
         <img src={getIcon(page.label)} alt={page.label} style={{ width: '24px', height: '24px',marginRight:'30px' }} />
         <ListItemText primary={page.label} />
       </ListItemButton>
       
        ))}
        {handleLogout && (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              justifyContent: 'flex-end',
              textTransform: 'none',
              color: 'inherit',
              paddingLeft: '20px',
              '&:hover': {
                backgroundColor: '#e1c84a',
              },
            }}
          >
            <ListItemIcon>
              <img src={iconLogout} alt="logout-icon" style={{ width: '24px', height: '24px' }} />
            </ListItemIcon>
            <ListItemText primary="Deconectare" />
          </ListItemButton>
        )}
      </List>
    </Drawer>
  );
}

export default DrawerMenu;
