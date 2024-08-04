import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Routes/HomePage';
import Functionalitati from './Routes/Functionalitati';
import LogIn from './Routes/LogIn';
import SignUp from './Routes/SignUp';
import Producator from './Routes/Producator';
import Actor from './Routes/Actor';
import './Styles/App.css';
import PostareFilm from './Routes/PostareFilm';
import ListaFilme from './Routes/ListaFilme';
import AplicaRol from './Routes/AplicaRol';
import DetaliiRoluri from './Routes/DetaliiRoluri';
import ListaAplicari from './Routes/ListaAplicari';
import AplicăriActori from './Routes/AplicăriActori';
import ProducatorProfile from './Routes/ProducatorProfile';
import ActorProfile from './Routes/ActorProfile';
import Preferinte from './Routes/Preferinte';
import ForgotPasswordForm from './Components/ForgotPasswordForm';
import ResetPasswordPage from './Routes/ResetPasswordPage';
import ProgramariActori from './Routes/ProgramariActori';
import ProgramariProducatori from './Routes/ProgramariProducatori';
import OfertareResurse from './Routes/OfertareResurse';
import Dashboard from './Components/Dashboard';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Functionalitati" element={<Functionalitati />} />
        <Route path='/LogIn' element={<LogIn/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/Actor' element={<Actor/>}></Route>
        <Route path='/Producator' element={<Producator/>}></Route>
        <Route path='/ProducatorProfile/:userId' element={<ProducatorProfile />} />
        <Route path='/ActorProfile/:userId' element={<ActorProfile />} />
        <Route path='/postarefilm' element={<PostareFilm/>}></Route>
        <Route path='/listafilme' element={<ListaFilme/>}></Route>
        <Route path='/aplicarol/:titlu' element={<AplicaRol/>}></Route>
        <Route path="/detalii-roluri/:filmId" element={<DetaliiRoluri/>} />
        <Route path="/aplicări" element={<ListaAplicari/>}></Route>
        <Route path='/aplicăriactori' element={<AplicăriActori/>}></Route>
        <Route path='/preferințe' element={<Preferinte/>}></Route>
        <Route path='/ForgotPassword' element={<ForgotPasswordForm/>}></Route>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path='/programariActori' element={<ProgramariActori/>}></Route>
        <Route path='/programariProducatori' element={<ProgramariProducatori/>}></Route>
        <Route path='/ofertareresurse' element={<OfertareResurse/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
