import React from 'react';
import Button from '@mui/material/Button';

const AppBarButton = ({ label, icon, to, navigate }) => (
    <Button
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
      onClick={() => navigate(to)} 
    >
      <img
        src={icon}
        alt={`${label} Icon`}
        style={{ width: '22px', height: '22px', marginRight: '5px' ,marginLeft:'5px'}}
      />
      {label}
    </Button>
  );
  
  export default AppBarButton;
  
  