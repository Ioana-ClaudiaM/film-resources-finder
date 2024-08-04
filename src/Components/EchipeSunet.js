import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResultEchipaSunet from './SearchResultEchipeSunet';

function EchipeSunet({ userId, onImageClick }) {
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
          const response = await fetch(`http://localhost:8080/soundteam/searchEchipaSunet?term=${term}`);
          const echipeSunet = await response.json();
          echipeSunet.forEach(echipaSunet => {
            if (!matches[echipaSunet.nume]) {
              matches[echipaSunet.nume] = {
                matches: 0,
                description: echipaSunet.descriere,
                matchesByTerm: {},
                id: echipaSunet.id
              };
            }
            matches[echipaSunet.nume].description = echipaSunet.descriere;
            matches[echipaSunet.nume].matchesByTerm[term] = (matches[echipaSunet.nume].matchesByTerm[term] || 0) + 1;
          });
        } catch (error) {
          console.error('Eroare la căutare:', error);
        }
      }));

      const sortedEchipeSunet = Object.keys(matches).sort((a, b) => {
        const totalMatchesA = Object.values(matches[a].matchesByTerm).reduce((acc, val) => acc + val, 0);
        const totalMatchesB = Object.values(matches[b].matchesByTerm).reduce((acc, val) => acc + val, 0);
        return totalMatchesB - totalMatchesA;
      });

      setSearchResults(sortedEchipeSunet.filter(echipaSunet => {
        return Object.values(matches[echipaSunet].matchesByTerm).some(matchCount => matchCount > 0);
      }).map(echipaSunet => ({ nume: echipaSunet, id: matches[echipaSunet].id })));

      setDescriptions(Object.fromEntries(sortedEchipeSunet.map(echipaSunet => [echipaSunet, matches[echipaSunet].description])));
    } catch (error) {
      console.error('Eroare la căutare:', error);
      setError('Eroare la căutare. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='header-echipe-sunet'>Echipe de sunet</h1>
      <h1 className='paragraf-echipe-sunet'>Introduceți în bara de căutare o descriere succintă în ceea ce privește preferințele dumneavoastră pentru echipele de sunet, iar ulterior vă va fi generată o listă cu echipe de sunet în concordanță cu criteriile introduse.</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResultEchipaSunet results={searchResults} descriptions={descriptions} onImageClick={onImageClick} />
    </div>
  );
}

export default EchipeSunet;
