import React, { useEffect, useRef } from 'react';
import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationsMenu = ({ notifications, handleNotificationClick, anchorElNotif, handleCloseNotifMenu, handleOpenNotifMenu }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleCloseNotifMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleCloseNotifMenu]);

  return (
    <>
      <IconButton
        color="default"
        aria-label="notificări"
        aria-controls="menu-notif"
        aria-haspopup="true"
        onClick={handleOpenNotifMenu}
        sx={{ marginLeft: 'auto' }}
      >
        <Badge badgeContent={notifications.filter(notification => !notification.viewed).length} color="primary" style={{ marginRight: '20px' }}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        id="menu-notif"
        anchorEl={anchorElNotif}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(anchorElNotif)}
        onClose={handleCloseNotifMenu}
        ref={menuRef}
      >
        {notifications.map((notification, index) => (
          <MenuItem
            key={index}
            onClick={() => handleNotificationClick(notification)}
            style={{ backgroundColor: notification.viewed ? '#e1c84a' : 'white' }}
          >
            {notification.content}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationsMenu;
