import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResultLocatii from './SearchResultLocatii';

function Locatii({ userId, onImageClick }) {
  const [searchResults, setSearchResults] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (description) => {
    setLoading(true);
    setError(null);
    try {
      const searchTerms = description.split(' ');
      const matches = {};
      await Promise.all(searchTerms.map(async (term) => {
        try {
          const response = await fetch(`http://localhost:8080/locations/searchLocatie?term=${term}`);
          const locations = await response.json();
          locations.forEach(location => {
            if (!matches[location.nume]) {
              matches[location.nume] = {
                matches: 0,
                description: location.descriere,
                matchesByTerm: {},
                id: location.id
              };
            }
            matches[location.nume].description = location.descriere;
            matches[location.nume].matchesByTerm[term] = (matches[location.nume].matchesByTerm[term] || 0) + 1;
          });
        } catch (error) {
          console.error('Eroare la căutare:', error);
        }
      }));
      const sortedLocations = Object.keys(matches).sort((a, b) => {
        const totalMatchesA = Object.values(matches[a].matchesByTerm).reduce((acc, val) => acc + val, 0);
        const totalMatchesB = Object.values(matches[b].matchesByTerm).reduce((acc, val) => acc + val, 0);
        return totalMatchesB - totalMatchesA;
      });
      setSearchResults(sortedLocations.filter(location => {
        return Object.values(matches[location].matchesByTerm).some(matchCount => matchCount > 0);
      }).map(location => ({ nume: location, id: matches[location].id })));
      setDescriptions(Object.fromEntries(sortedLocations.map(location => [location, matches[location].description])));
    } catch (error) {
      console.error('Eroare la căutare:', error);
      setError('Eroare la căutare. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  const getPopularLocations = async () => {
    try {
      const response = await fetch('http://localhost:8080/locations/getPopularLocations');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Eroare la obținerea locațiilor populare:', error);
    }
  };

  const saveLocation = async (userId, locationId) => {
    console.log(`Saving location with ID: ${locationId} for user ID: ${userId}`);
    try {
      const response = await fetch('http://localhost:8080/locations/saveLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, locationId }),
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Eroare la salvarea locației:', error);
    }
  };

  return (
    <div>
      <h1 className='header-locatii'>Locații de filmare</h1>
      <h1 className='paragraf-locatii'>Introduceți în bara de căutare o descriere succintă în ceea ce privește preferințele dumneavoastră pentru
        locațiile de filmare, iar ulterior vă va fi generată o listă cu locuri în concordanță cu criteriile introduse.
      </h1>
      <SearchBar onSearch={handleSearch} />
      <div className='butoane-actiuni'>
        <button className='buton-cautare-locatii' onClick={getPopularLocations}>Sortare după popularitate</button>
      </div>
      <SearchResultLocatii results={searchResults} descriptions={descriptions} onImageClick={onImageClick} saveLocation={saveLocation} userId={userId} />
    </div>
  );
}

export default Locatii;
