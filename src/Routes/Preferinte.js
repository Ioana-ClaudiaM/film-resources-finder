import React, { useState, useEffect } from 'react';
import ProducatorAppBar from '../Components/ProducatorAppBar';
import FullScreenImageViewer from '../Components/FullScreenImageViewer';
import {jwtDecode} from 'jwt-decode';
import Locatii from '../Components/Locatii';
import Designeri from '../Components/Designeri';
import MakeupArtists from '../Components/MakeupArtists';
import EchipeFilmare from '../Components/EchipeFilmare';
import EchipeSunet from '../Components/EchipeSunet';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StyleIcon from '@mui/icons-material/Style';
import FaceIcon from '@mui/icons-material/Face';
import VideocamIcon from '@mui/icons-material/Videocam';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import '../Styles/Preferinte.css';

function Preferences() {
  const [currentSection, setCurrentSection] = useState('1');
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImageSrc, setViewerImageSrc] = useState('');
  const [viewerAltText, setViewerAltText] = useState('');
  const [userId, setProducerId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setProducerId(decodedToken.id);
    }
  }, []);

  const handleImageClick = (src, alt) => {
    setViewerImageSrc(src);
    setViewerAltText(alt);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  return (
    <div>
      <ProducatorAppBar />
      <div className='sectiune-butoane'>
        <Tooltip title="Locații filmare">
          <IconButton
            className={currentSection === '1' ? 'active' : ''}
            onClick={() => setCurrentSection('1')}
          >
            <LocationOnIcon />
          </IconButton>
        </Tooltip>
        <span>-</span>
        <Tooltip title="Designeri costume">
          <IconButton
            className={currentSection === '2' ? 'active' : ''}
            onClick={() => setCurrentSection('2')}
          >
            <StyleIcon />
          </IconButton>
        </Tooltip>
        <span>-</span>
        <Tooltip title="Makeup artiști">
          <IconButton
            className={currentSection === '3' ? 'active' : ''}
            onClick={() => setCurrentSection('3')}
          >
            <FaceIcon />
          </IconButton>
        </Tooltip>
        <span>-</span>
        <Tooltip title="Echipe de filmare">
          <IconButton
            className={currentSection === '4' ? 'active' : ''}
            onClick={() => setCurrentSection('4')}
          >
            <VideocamIcon />
          </IconButton>
        </Tooltip>
        <span>-</span>
        <Tooltip title="Echipe de sunet">
          <IconButton
            className={currentSection === '5' ? 'active' : ''}
            onClick={() => setCurrentSection('5')}
          >
            <VolumeUpIcon />
          </IconButton>
        </Tooltip>
      </div>

      {currentSection === '1' && (
        <Locatii userId={userId} onImageClick={handleImageClick} />
      )}

      {currentSection === '2' && (
        <Designeri userId={userId} onImageClick={handleImageClick} />
      )}

      {currentSection === '3' && (
        <MakeupArtists userId={userId} onImageClick={handleImageClick} />
      )}

      {currentSection === '4' && (
        <EchipeFilmare userId={userId} onImageClick={handleImageClick} />
      )}

      {currentSection === '5' && (
        <EchipeSunet userId={userId} onImageClick={handleImageClick} />
      )}

      <FullScreenImageViewer
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
        imageSrc={viewerImageSrc}
        altText={viewerAltText}
      />
    </div>
  );
}

export default Preferences;
