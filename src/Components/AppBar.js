import { React, AppBar, Box, Toolbar, IconButton, Container, MenuIcon, useState, iconHome, iconLogin,iconLogout, iconSignup,useEffect } from './Imports';
import AppBarButton from './AppBarButton';
import DrawerMenu from './DrawerMenu';

const pages = [
  { label: 'Acasă', path: '/' },
  { label: 'SignUp', path: '/SignUp' },
  { label: 'LogIn', path: '/LogIn' },
];

const ResponsiveAppBar = ({ navigate }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

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

  return (
    <>
      <AppBar color="primary" sx={{ backgroundColor: 'transparent', height: '70px', width: '100%', position: 'relative'}}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexGrow: 1 }}>
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
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <DrawerMenu
        isDrawerOpen={isDrawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        pages={pages}
        iconLogout={iconLogout} 
        getIcon={getIcon}
      />
    </>
  );
};
export default ResponsiveAppBar;

const getIcon = (page) => {
  switch (page) {
    case 'Acasă':
      return iconHome;
    case 'SignUp':
      return iconSignup;
    case 'LogIn':
      return iconLogin;
    default:
      return null;
  }
};