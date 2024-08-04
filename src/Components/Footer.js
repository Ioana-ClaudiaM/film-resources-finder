import React from 'react';

const Footer = ({ handleClick }) => (
  <div className='footer' onClick={handleClick}>
    <div>
      <h3>Informații utile</h3>
      <ul>
        <li><a href='#cineSuntemNoi'>Despre noi</a></li>
        <li><a href='#'>Contact</a></li>
        <li><a href='#'>Termeni și condiții</a></li>
      </ul>
    </div>
    <div>
      <h3>Conectează-te cu noi</h3>
      <ul>
        <li><a href='#'>Facebook</a></li>
        <li><a href='#'>Twitter</a></li>
        <li><a href='#'>LinkedIn</a></li>
      </ul>
    </div>
    <div>
      <h3>Platforma noastră</h3>
      <ul>
        <li><a href='#cumFunctioneaza'>Cum funcționează</a></li>
      </ul>
    </div>
    <div>
      <h3>Abonează-te la newsletter</h3>
      <p>Primește cele mai recente știri și actualizări direct în caseta ta de e-mail.</p>
      <form>
        <input type='email' placeholder='Introdu adresa de e-mail' />
        <button type='submit'>Abonează-te</button>
      </form>
    </div>
  </div>
);

export default Footer;
