import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResultMakeupArtists from './SearchResultMakeupArtists';

function MakeupArtists({ userId, onImageClick }) {
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
          const response = await fetch(`http://localhost:8080/makeupartists/searchMakeupArtist?term=${term}`);
          const makeupArtists = await response.json();
          makeupArtists.forEach(makeupArtist => {
            if (!matches[makeupArtist.nume]) {
              matches[makeupArtist.nume] = {
                matches: 0,
                description: makeupArtist.descriere,
                matchesByTerm: {},
                id: makeupArtist.id
              };
            }
            matches[makeupArtist.nume].description = makeupArtist.descriere;
            matches[makeupArtist.nume].matchesByTerm[term] = (matches[makeupArtist.nume].matchesByTerm[term] || 0) + 1;
          });
        } catch (error) {
          console.error('Eroare la căutare:', error);
        }
      }));

      const sortedMakeupArtists = Object.keys(matches).sort((a, b) => {
        const totalMatchesA = Object.values(matches[a].matchesByTerm).reduce((acc, val) => acc + val, 0);
        const totalMatchesB = Object.values(matches[b].matchesByTerm).reduce((acc, val) => acc + val, 0);
        return totalMatchesB - totalMatchesA;
      });

      setSearchResults(sortedMakeupArtists.filter(makeupArtist => {
        return Object.values(matches[makeupArtist].matchesByTerm).some(matchCount => matchCount > 0);
      }).map(makeupArtist => ({ nume: makeupArtist, id: matches[makeupArtist].id })));

      setDescriptions(Object.fromEntries(sortedMakeupArtists.map(makeupArtist => [makeupArtist, matches[makeupArtist].description])));
    } catch (error) {
      console.error('Eroare la căutare:', error);
      setError('Eroare la căutare. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='header-makeup-artists'>Makeup Artiști</h1>
      <h1 className='paragraf-makeup-artists'>Introduceți în bara de căutare o descriere succintă în ceea ce privește preferințele dumneavoastră pentru makeup artiști, iar ulterior vă va fi generată o listă cu artiști în concordanță cu criteriile introduse.</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResultMakeupArtists results={searchResults} descriptions={descriptions} onImageClick={onImageClick} />
    </div>
  );
}

export default MakeupArtists;
