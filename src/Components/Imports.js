// Importuri React
import React from 'react';
import { useState,useEffect,useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// Importuri Material-UI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import  List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Importuri pentru imagini
import iconHome from '../Styles/Icons/home.png';
import iconListaFilme from '../Styles/Icons/clipboard.png';
import iconAplicari from '../Styles/Icons/resume.png';
import iconPlanner from '../Styles/Icons/planner1.png';
import iconProfile from '../Styles/Icons/user.png';
import iconLogout from '../Styles/Icons/logout.png';
import iconLogin from '../Styles/Icons/log-in.png';
import iconSignup from '../Styles/Icons/signup.png';
import loadingGif from '../Styles/Gifs/loading.gif';
import slide3 from '../Styles/Backgrounds/learners-lesson.jpg'
import slide4 from '../Styles/Backgrounds/online-communication.jpg'
import slide6 from '../Styles/Backgrounds/young-creative-people-with-laptop-working-new-project-together-group-smiling-guys-spending-time-modern-office.jpg'
import slide5 from '../Styles/Backgrounds/young-man-shirt-woman-striped-tshirt-eyeglasses-working-together-with-laptop-group-cool-guys-spending-time-modern-office.jpg'
import slide1 from '../Styles/Backgrounds/college-friends-teamworking.jpg'
import slide2 from '../Styles/Backgrounds/brainstorm-meeting.jpg'
import  iconPreferences from '../Styles/Icons/settings.png'
import iconResurse from '../Styles/Icons/support.png';
import iconDashboard from '../Styles/Icons/dashboard.png';
//Importuri pentru token
import { jwtDecode } from "jwt-decode";

//Importuri pentru socket
import { io } from "socket.io-client";


// Exporturi
export { React, AppBar, Box, Toolbar, IconButton, MenuIcon, Container, Button,iconHome, iconListaFilme, iconAplicari, iconPlanner, iconProfile,useEffect,
    useState,Drawer,ListItemButton,ListItemIcon,ListItemText,List,iconLogout,jwtDecode,io,Badge,Menu,MenuItem,NotificationsIcon,Link,
    useNavigate,useRef,iconLogin,iconSignup,loadingGif,slide1,slide2,slide3,slide4,slide5,slide6,iconPreferences,iconResurse,iconDashboard};