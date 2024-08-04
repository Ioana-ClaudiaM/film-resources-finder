import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResultEchipaFilmare from './SearchResultEchipeFilmare';

function EchipeFilmare({ userId, onImageClick }) {
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
          const response = await fetch(`http://localhost:8080/filmingteam/searchEchipaFilmare?term=${term}`);
          const echipeFilmare = await response.json();
          echipeFilmare.forEach(echipaFilmare => {
            if (!matches[echipaFilmare.nume]) {
              matches[echipaFilmare.nume] = {
                matches: 0,
                description: echipaFilmare.descriere,
                matchesByTerm: {},
                id: echipaFilmare.id
              };
            }
            matches[echipaFilmare.nume].description = echipaFilmare.descriere;
            matches[echipaFilmare.nume].matchesByTerm[term] = (matches[echipaFilmare.nume].matchesByTerm[term] || 0) + 1;
          });
        } catch (error) {
          console.error('Eroare la căutare:', error);
        }
      }));

      const sortedEchipeFilmare = Object.keys(matches).sort((a, b) => {
        const totalMatchesA = Object.values(matches[a].matchesByTerm).reduce((acc, val) => acc + val, 0);
        const totalMatchesB = Object.values(matches[b].matchesByTerm).reduce((acc, val) => acc + val, 0);
        return totalMatchesB - totalMatchesA;
      });

      setSearchResults(sortedEchipeFilmare.filter(echipaFilmare => {
        return Object.values(matches[echipaFilmare].matchesByTerm).some(matchCount => matchCount > 0);
      }).map(echipaFilmare => ({ nume: echipaFilmare, id: matches[echipaFilmare].id })));

      setDescriptions(Object.fromEntries(sortedEchipeFilmare.map(echipaFilmare => [echipaFilmare, matches[echipaFilmare].description])));
    } catch (error) {
      console.error('Eroare la căutare:', error);
      setError('Eroare la căutare. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='header-echipe-filmare'>Echipe de filmare</h1>
      <h1 className='paragraf-echipe-filmare'>Introduceți în bara de căutare o descriere succintă în ceea ce privește preferințele dumneavoastră pentru echipele de filmare, iar ulterior vă va fi generată o listă cu echipe de filmare în concordanță cu criteriile introduse.</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResultEchipaFilmare results={searchResults} descriptions={descriptions} onImageClick={onImageClick} />
    </div>
  );
}

export default EchipeFilmare;
