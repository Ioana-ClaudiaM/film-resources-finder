import React from 'react';
import '../Styles/HomePage.css';

const FunctionalCard = ({ icon, title, description }) => (
  <div className='functionality'>
    <div className='titlu-functionalitate'>
      {title}
    </div>
    <div className='icon-functionalitate'>
      <img className='img-icon-functionalitate' src={icon} alt={title} />
    </div>
    <div className='description-functionalitate'>
      {description}
    </div>
  </div>
);

export default FunctionalCard;
