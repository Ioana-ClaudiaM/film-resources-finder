import React, { useState, useEffect } from 'react';
import ProducatorAppBar from '../Components/ProducatorAppBar';
import '../Styles/PostareFilme.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {jwtDecode} from 'jwt-decode';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function PostareFilm() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filmDescription, setFilmDescription] = useState('');
  const [roles, setRoles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    title: '',
    sex: '',
    age: '',
    experience: '',
    ethnicity: '',
    descriere: '',
  });
  const [filmTitle, setFilmTitle] = useState('');
  const [filme, setFilme] = useState([]);
  const [currentFilmIndex, setCurrentFilmIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  const handleFilmTitleChange = (event) => {
    setFilmTitle(event.target.value);
  };

  const handleGenreChange = (event) => {
    const value = event.target.value;
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(value)
        ? prevSelectedGenres.filter((genre) => genre !== value)
        : [...prevSelectedGenres, value]
    );
  };

  const handleFilmDescriptionChange = (event) => {
    setFilmDescription(event.target.value);
  };

  const handleAddRole = () => {
    setDialogOpen(true);
  };

  const handleSaveRole = () => {
    setRoles([...roles, newRole]);
    setNewRole({
      title: '',
      sex: '',
      age: '',
      experience: '',
      ethnicity: '',
      descriere: '',
    });
    setDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRoleChange = (event) => {
    const { name, value } = event.target;
    setNewRole({ ...newRole, [name]: value });
  };

  const getUserId = () => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const { id } = decodedToken;
        resolve(id);
      } else {
        reject(new Error('Tokenul lipsește'));
      }
    });
  };

  const handleSuccessMessageOpen = () => {
    setSuccessMessageOpen(true);
  };

  const handleSuccessMessageClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessageOpen(false);
  };

  const handlePostFilm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userId = await getUserId();
      if (!token || !userId) {
        console.error('Tokenul sau ID-ul utilizatorului lipsește.');
        return;
      }

      const response = await fetch('http://localhost:8080/movies/postare-film', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          titlu: filmTitle,
          descriere: filmDescription,
          gen: selectedGenres.join(', '), 
          roluri: roles,
          userId: userId,
        }),
      });

      if (response.ok) {
        handleSuccessMessageOpen(); 
        const data = await response.json();
        const { filmId } = data;
      } else {
        console.error('Eroare la salvarea filmului în baza de date');
      }
    } catch (error) {
      console.error('Eroare la comunicarea cu serverul:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextFilm = () => {
    setCurrentFilmIndex((prevIndex) => (prevIndex + 1) % filme.length);
  };

  const handlePrevFilm = () => {
    setCurrentFilmIndex((prevIndex) => (prevIndex - 1 + filme.length) % filme.length);
  };

  useEffect(() => {
    async function fetchFilme() {
      try {
        const userId = await getUserId();
        const response = await fetch(`http://localhost:8080/movies/get-filme/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFilme(data);
        } else {
          console.error('Eroare la obținerea listei de filme');
        }
      } catch (error) {
        console.error('Eroare la comunicarea cu serverul:', error);
      }
    }

    fetchFilme();
  }, []);

  return (
    <div className='postare-filme'>
      <div className="container-formular">
        <ProducatorAppBar />
        <div className="header-post-film">
          <p className="paragraph-post-film">Postează un film completând formularul de mai jos:</p>
          <div className="content-post-film">
            <div className="formular-adaugare-film">
              <TextField
                id="titlu-film"
                label="Titlul filmului"
                className="titlu-film"
                variant="outlined"
                value={filmTitle}
                onChange={handleFilmTitleChange}
                InputLabelProps={{
                  style: { color: '#e1c84a' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ccc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e1c84a',
                    },
                  },
                }}
              />
              <TextField
                id="descriere-film"
                label="Descrierea filmului"
                className="descriere-film"
                variant="outlined"
                multiline
                rows={4}
                value={filmDescription}
                onChange={handleFilmDescriptionChange}
                InputLabelProps={{
                  style: { color: '#e1c84a' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ccc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e1c84a',
                    },
                  },
                }}
              />
              <div className="genuri-film">
                {['Actiune', 'Comedie', 'Dramă', 'Sf', 'Horror', 'Romantic', 'Aventura', 'Fantasy', 'Thriller', 'Animație', 'Documentar', 'Mister', 
              'Western', 'Biografic', 'Crimă', 'Familie', 'Istoric', 'Muzical', 'Sport', 'Supranatural', 'Război', 'Politic', 'Educațional', 'Experimental', 
              'Neconvențional'].map((genre) => (
                  <FormControlLabel
                    key={genre}
                    control={
                      <Checkbox
                        checked={selectedGenres.includes(genre)}
                        onChange={handleGenreChange}
                        value={genre}
                      />
                    }
                    label={genre}
                  />
                ))}
              </div>
              <p className="paragraph-add-film">Pentru a adăuga un nou rol, apasă butonul de mai jos:</p>
              <button className="adauga-rol-button" onClick={handleAddRole}>Adaugă rol</button>
            </div>
          </div>
          <button className="button-post-film" onClick={handlePostFilm} disabled={isSubmitting}>
            {isSubmitting ? 'Postează...' : 'Postează film'}
          </button>
        </div>
        <Dialog open={dialogOpen} onClose={handleCloseDialog} classes={{ paper: 'custom-dialog-paper' }}>
          <DialogTitle className="titlu-dialog">Adaugă rol</DialogTitle>
          <DialogContent>
            <div className="role-container">
              <TextField
                id="titlu-rol"
                label="Titlu rol"
                variant="outlined"
                value={newRole.title}
                onChange={handleRoleChange}
                name="title"
                InputLabelProps={{
                  style: { color: '#e1c84a' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ccc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e1c84a',
                    },
                  },
                }}
              />
              <TextField
                id="sex-rol"
                label="Sex"
                variant="outlined"
                value={newRole.sex}
                onChange={handleRoleChange}
                name="sex"
                InputLabelProps={{
                  style: { color: '#e1c84a' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ccc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e1c84a',
                    },
                  },
                }}
              />
              <TextField
                id="varsta-rol"
                label="Vârstă"
                variant="outlined"
                value={newRole.age}
                onChange={handleRoleChange}
                name="age"
                InputLabelProps={{
                  style: { color: '#e1c84a' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ccc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e1c84a',
                    },
                  },
                }}
              />
              <TextField
                id="experienta-rol"
                label="Experiență"
                variant="outlined"
                value={newRole.experience}
                onChange={handleRoleChange}
                name="experience"
                InputLabelProps={{
                  style: { color: '#e1c84a' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ccc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e1c84a',
                    },
                  },
                }}
              />
              <TextField
                id="etnie-rol"
                label="Etnie"
                variant="outlined"
                value={newRole.ethnicity}
                onChange={handleRoleChange}
                name="ethnicity"
                InputLabelProps={{
                  style: { color: '#e1c84a' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ccc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e1c84a',
                    },
                  },
                }}
              />
              <TextField
                id="descriere-rol"
                label="Descriere"
                variant="outlined"
                value={newRole.descriere}
                onChange={handleRoleChange}
                name="descriere"
                InputLabelProps={{
                  style: { color: '#e1c84a' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ccc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e1c84a',
                    },
                  },
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button sx={{ color: "#e1c84a", backgroundColor: 'black' }} onClick={handleCloseDialog}>Anulează</Button>
            <Button sx={{ color: "#e1c84a", backgroundColor: 'black' }} onClick={handleSaveRole}>Salvează</Button>
          </DialogActions>
        </Dialog>
        <div className="lista-filme">
  <h1 className='paragraph-post'>Lista filme postate</h1>
  <div className='filme-postate'>
    {filme.length > 0 && (
      <div className="film-navigation">
        <ArrowBackIosIcon className="arrow-icon left-arrow" onClick={handlePrevFilm} />
        <div key={filme[currentFilmIndex].id_film} className="film-card">
          <CardContent>
            <h2>{filme[currentFilmIndex].titlu}</h2>
            <p><strong>Genuri:</strong> {filme[currentFilmIndex].gen.split(', ').join(', ')}</p>
            <p><strong>Descriere:</strong> {filme[currentFilmIndex].descriere}</p>
            <div className='roluri-postate'>
              <h2>Roluri:</h2>
              <ul className='lista-roluri-postate'>
                {filme[currentFilmIndex].roluri.map((rol) => (
                  <li key={rol.id_rol}>
                    <p><strong>Titlu:</strong> {rol.titlu}</p>
                    <p><strong>Sex:</strong> {rol.sex}</p>
                    <p><strong>Varsta:</strong> {rol.varsta} ani</p>
                    <p><strong>Experienta:</strong> {rol.experienta} ani</p>
                    <p><strong>Etnie:</strong> {rol.etnie}</p>
                    <p><strong>Descriere:</strong> {rol.descriere}</p>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </div>
        <ArrowForwardIosIcon className="arrow-icon right-arrow" onClick={handleNextFilm} />
      </div>
    )}
  </div>
</div>

      </div>
      <Snackbar open={successMessageOpen} autoHideDuration={6000} onClose={handleSuccessMessageClose}>
        <Alert onClose={handleSuccessMessageClose} severity="success" sx={{ width: '100%' }}>
          Filmul a fost postat cu succes!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PostareFilm;
