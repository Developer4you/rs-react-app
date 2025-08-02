import { useState, useEffect } from 'react';
import styles from './searchApp.module.css';
import { useSearchParams, Outlet, Link } from 'react-router-dom';
import {
  fetchCharacters,
  getSavedSearchQuery,
  saveSearchQuery,
  fetchCharacterDetails,
} from '../../api/rickAndMortyApi';
import { CharacterDetails } from '../CharacterDetails/CharacterDetails';
import type { ApiResponse, Character } from '../../interfaces/interfaces';
import { Controls } from '../controls/Controls';
import { Results } from '../results/Results';
import { Spinner } from '../Spinner/Spinner';
import { Flyout } from '../Flyout/Flyout';
import { useTheme } from '../../context/ThemeContext';

export const SearchApp = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const { theme, toggleTheme } = useTheme();

  const searchQuery = searchParams.get('search') || getSavedSearchQuery();
  const pageParam = searchParams.get('page');
  const detailsParam = searchParams.get('details');

  useEffect(() => {
    const page = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(page);

    if (detailsParam) {
      fetchCharacterDetails(parseInt(detailsParam))
        .then(setSelectedCharacter)
        .then(() => setLoadingDetails(false))
        .catch(handleApiError);
    }

    fetchCharacters(page, searchQuery)
      .then(handleApiResponse)
      .catch(handleApiError);
  }, [searchQuery, pageParam, detailsParam]);

  const handleApiResponse = (data: ApiResponse) => {
    setResults(data.results);
    setTotalPages(data.info.pages);
    setLoading(false);
  };

  const handleApiError = (error: Error) => {
    setError(error.message);
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    const cleanedQuery = query.trim();
    saveSearchQuery(cleanedQuery);
    const newSearchParams: Record<string, string> = {
      search: cleanedQuery,
      page: '1',
    };
    if (selectedCharacter?.id) {
      newSearchParams.details = selectedCharacter.id.toString();
    }
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage: number) => {
    const newSearchParams: Record<string, string> = {
      search: searchQuery,
      page: newPage.toString(),
    };
    if (selectedCharacter?.id) {
      newSearchParams.details = selectedCharacter.id.toString();
    }
    setSearchParams(newSearchParams);
  };

  const handleCharacterClick = (characterId: number) => {
    if (selectedCharacter?.id !== characterId) setLoadingDetails(true);
    setSearchParams({
      search: searchQuery,
      page: currentPage.toString(),
      details: characterId.toString(),
    });
  };

  const handleCloseDetails = () => {
    setSelectedCharacter(null);
    setSearchParams({ search: searchQuery, page: currentPage.toString() });
  };

  return (
    <div className={styles.searchApp}>
      <div className={styles.navContainer}>
        <Link to="/about" className={styles.navLink}>
          About application
        </Link>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
        </button>
      </div>
      <Controls
        onSearch={handleSearch}
        loading={loading}
        initialValue={searchQuery}
      />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Results
            items={results}
            loading={loading}
            error={error}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onCharacterClick={handleCharacterClick}
          />
        </div>
        {loadingDetails ? (
          <div style={{ width: '300px', marginLeft: '20px' }}>
            <Spinner />
          </div>
        ) : (
          selectedCharacter && (
            <div style={{ width: '300px', marginLeft: '20px' }}>
              <button onClick={handleCloseDetails}>Close</button>
              <CharacterDetails character={selectedCharacter} />
            </div>
          )
        )}
      </div>
      <Outlet />
      <Flyout />
    </div>
  );
};
