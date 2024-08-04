import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/Actor.css';
import DescriptionSection from '../Components/DescriptionSection';
import SkillsSection from '../Components/SkillsSection';
import ExperienceSection from '../Components/ExperienceSection';
import EducationSection from '../Components/EducationSection';
import LanguagesSection from '../Components/LanguagesSection';
import ProducatorAppBar from '../Components/ProducatorAppBar';

const ProducatorProfile = () => {
  const { userId } = useParams(); 
  console.log("buna"+userId);
  const [username, setUsername] = useState('');
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

        setUsername(descriptionData.nume_producator); 
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

    fetchDataFromServer(userId);
  }, [userId]);

  return (
    <div>
      <ProducatorAppBar />
      <div className='actor-page'>
        <div className='header-actor'>
          <p className='welcome-paragraph'><span className='welcome'>Profilul producătorului: {username}</span></p>
        </div>
        <div className='container-cv'>
          {isDataFetched.description && (
            <DescriptionSection description={description} readOnly={true} />
          )}

          {isDataFetched.skills && (
            <SkillsSection skills={skills} readOnly={true} />
          )}

          {isDataFetched.experiences && (
            <ExperienceSection experiences={experiences} readOnly={true} />
          )}

          {isDataFetched.education && (
            <EducationSection educations={educations} readOnly={true} />
          )}

          {isDataFetched.languages && (
            <LanguagesSection languages={languages} readOnly={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducatorProfile;
