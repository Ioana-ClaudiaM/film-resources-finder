import React, { useState, useEffect } from 'react';
import '../Styles/Actor.css';
import {jwtDecode} from 'jwt-decode';
import SectionButtons from '../Components/SectionButtons';
import DescriptionSection from '../Components/DescriptionSection';
import SkillsSection from '../Components/SkillsSection';
import ExperienceSection from '../Components/ExperienceSection';
import EducationSection from '../Components/EducationSection';
import LanguagesSection from '../Components/LanguagesSection';
import ProducatorAppBar from '../Components/ProducatorAppBar';

const Producator = () => {
  const [username, setUsername] = useState('');
  const [id, setIdUtilizator] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducation] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState({
    description: false,
    skills: false,
    experiences: false,
    education: false,
    languages: false,
  });

  const handleRememberMe = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const { nume, id } = decodedToken;
      setUsername(nume);
      setIdUtilizator(id);
    }
  };

  useEffect(() => {
    handleRememberMe();
  }, []);

  useEffect(() => {
    const fetchDataFromServer = async (userId) => {
      if (!userId) return;

      try {
        const responses = await Promise.all([
          fetch(`http://localhost:8080/description/get-description/${userId}`),
          fetch(`http://localhost:8080/skills/get-skills/${userId}`),
          fetch(`http://localhost:8080/experiences/get-experiences/${userId}`),
          fetch(`http://localhost:8080/education/get-education/${userId}`),
          fetch(`http://localhost:8080/languages/get-languages/${userId}`)
        ]);

        const [descriptionData, skillsData, experiencesData, educationData, languagesData] = await Promise.all(responses.map(res => res.json()));

        setDescription(descriptionData.description);
        setSkills(skillsData.skills);
        setExperiences(experiencesData.experiences);
        setEducation(educationData.educations);
        setLanguages(languagesData.languages);

        setIsDataFetched({
          description: true,
          skills: true,
          experiences: true,
          education: true,
          languages: true,
        });
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    if (id) {
      fetchDataFromServer(id);
    }
  }, [id]);

  const [currentSection, setCurrentSection] = useState('1');

  const handleSectionChange = (sectionName) => setCurrentSection(sectionName);

  return (
    <div>
      <ProducatorAppBar />
      <div className='actor-page'>
        <div className='header-actor'>
        <p className='welcome-paragraph'><span className='welcome'>Bun venit, {username}!</span><br></br> De la <span className='word-paragraph'>idee</span>, la <span className='word-paragraph'>realizare</span>. <br></br>Transformă viziunile tale în producții de succes și adu poveștile tale pe marele ecran.</p>
        </div>
        <div className='cv'>
          Introdu informații despre tine în secțiunile de mai jos!
        </div>
        <div className='container-cv'>
          <SectionButtons currentSection={currentSection} handleSectionChange={handleSectionChange} />

          {currentSection === '1' && (
            <DescriptionSection description={description} setDescription={setDescription} id={id} />
          )}

          {currentSection === '2' && (
            <SkillsSection skills={skills} setSkills={setSkills} id={id} />
          )}

          {currentSection === '3' && (
            <ExperienceSection experiences={experiences} setExperiences={setExperiences} id={id} />
          )}

          {currentSection === '4' && (
            <EducationSection educations={educations} setEducation={setEducation} id={id} />
          )}

          {currentSection === '5' && (
            <LanguagesSection languages={languages} setLanguages={setLanguages} id={id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Producator;
