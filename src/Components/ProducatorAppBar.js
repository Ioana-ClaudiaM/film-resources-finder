import { React, AppBar, Box, Toolbar, IconButton, Container, MenuIcon,jwtDecode, iconAplicari, iconHome, iconListaFilme, iconLogout,
useState, iconPlanner, iconProfile, useEffect, io ,useNavigate,Button,
iconPreferences,iconDashboard,iconResurse} 
from './Imports';
import NotificationsMenu from './NotificationsMenu';
import AppBarButton from './AppBarButton';
import '../Styles/Notificare.css';
import '../Styles/ProducatorAppBar.css';
import DrawerMenu from './DrawerMenu'; 

export default function ProducatorAppBar() {
  const [notifications, setNotifications] = useState(loadNotificationsFromStorage());
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [producerId, setProducerId] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

  const navigate = useNavigate();

  const handleRememberMe = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const { id } = decodedToken;
      setProducerId(id);
    } else {
      const sessionToken = sessionStorage.getItem('token');
      if (sessionToken) {
        const decodedSessionToken = jwtDecode(sessionToken);
        const { id } = decodedSessionToken;
        setProducerId(id);
      }
    }
  };

  useEffect(() => {
    handleRememberMe();
  }, []);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const updateScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 600);
  };

  useEffect(() => {
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/';
  };

  const pages = [
    { label: 'Acasă', path: '/' },
    { label: 'Postare Film', path: '/postarefilm' },
    { label: 'Aplicări Actori', path: '/aplicăriactori' },
    { label: 'Programări', path: '/programariProducatori' },
    {label: 'Preferințe', path:'/preferințe'},
    {label: 'Ofertare resurse', path:'/ofertareresurse'},
    {label:'Dashboard', path:'/dashboard'},
    { label: 'Profil', path: '/Producator' }
  ];

  useEffect(() => {
    saveNotificationsToStorage(notifications);
  }, [notifications]);


  useEffect(() => {
    if (producerId) {
      const newSocket = io('http://localhost:8080');
      newSocket.emit('authenticateProducer', producerId);
      newSocket.on('notification', (notification) => {
        setNotifications(prevNotifications => [...prevNotifications, { content: notification, viewed: false }]);
      });
      return () => {
        newSocket.disconnect();
      };
    }
  }, [producerId]);

  const handleNotificationClick = (clickedNotification) => {
    const updatedNotifications = notifications.map(notification =>
      notification === clickedNotification ? { ...notification, viewed: true } : notification
    );
    setNotifications(updatedNotifications);
    handleCloseNotifMenu();
  };

  const handleOpenNotifMenu = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleCloseNotifMenu = () => {
    setAnchorElNotif(null);
  };

 

  return (
    <>
      <AppBar color="primary" sx={{ backgroundColor: 'white', height: '70px', width: '100%', position: 'relative' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
          <NotificationsMenu
          notifications={notifications}
          handleNotificationClick={handleNotificationClick}
          anchorElNotif={anchorElNotif}
          handleOpenNotifMenu={handleOpenNotifMenu}
          handleCloseNotifMenu={handleCloseNotifMenu} 

        />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 1 }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleDrawerToggle}
                color="#000000"
                sx={{ display: isSmallScreen ? 'block' : 'none' }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', display: isSmallScreen ? 'none' : 'flex' }}>
                {pages.map((page, index) => (
                  <AppBarButton
                    key={index}
                    to={page.path}
                    navigate={navigate}
                    label={page.label}
                    component="a"
                    icon={getIcon(page.label)}
                  />
                ))}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mx: 1,
                    my: 0.5,
                    color: 'black',
                    fontSize: '12px',
                    fontFamily: 'Poppins',
                    backgroundColor: '#7fb0e4',
                    '&:hover': {
                      fontSize: '16px',
                    },
                    border:'1px solid black',
                    height:'40px'
                  }}
                  onClick={handleLogout}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={iconLogout} alt="logout-icon" style={{ width: '22px', height: '22px' }} />
                    <span style={{ marginLeft: '5px' }}>Deconectare</span>
                  </Box>
                </Button>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <DrawerMenu
        isDrawerOpen={isDrawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        pages={pages}
        handleLogout={handleLogout}
        iconLogout={iconLogout}
        getIcon={getIcon}
        handleCloseNotifMenu={handleCloseNotifMenu}
      />
    </>
  );
};

const getIcon = (page) => {
  switch (page) {
    case 'Acasă':
      return iconHome;
    case 'Postare Film':
      return iconListaFilme;
    case 'Aplicări Actori':
      return iconAplicari;
    case 'Programări':
      return iconPlanner;
    case 'Profil':
      return iconProfile;
    case 'Deconectare':
      return iconLogout;
    case 'Preferințe':
      return iconPreferences;
    case 'Ofertare resurse':
      return iconResurse;
    case 'Dashboard':
      return iconDashboard;
    default:
      return null;
  }
};

const loadNotificationsFromStorage = () => {
  const storedNotifications = localStorage.getItem('notifications');
  return storedNotifications ? JSON.parse(storedNotifications) : [];
};

const saveNotificationsToStorage = (notifications) => {
  localStorage.setItem('notifications', JSON.stringify(notifications));
};