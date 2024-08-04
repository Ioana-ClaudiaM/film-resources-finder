import React from 'react';
import '../Styles/SectionButtons.css'; 

const SectionButtons = ({ currentSection, handleSectionChange }) => {
  return (
    <div className='buttons-section'>
      <button className={currentSection === '1' ? 'active' : ''} onClick={() => handleSectionChange('1')} data-tooltip="Despre mine">1</button>
      <span>-</span>
      <button className={currentSection === '2' ? 'active' : ''} onClick={() => handleSectionChange('2')} data-tooltip="Abilități">2</button>
      <span>-</span>
      <button className={currentSection === '3' ? 'active' : ''} onClick={() => handleSectionChange('3')} data-tooltip="Experiență">3</button>
      <span>-</span>
      <button className={currentSection === '4' ? 'active' : ''} onClick={() => handleSectionChange('4')} data-tooltip="Educație">4</button>
      <span>-</span>
      <button className={currentSection === '5' ? 'active' : ''} onClick={() => handleSectionChange('5')} data-tooltip="Limbi străine">5</button>
    </div>
  );
};

export default SectionButtons;
