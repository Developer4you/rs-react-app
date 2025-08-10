import { useSearchParams, Outlet, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import styles from './searchApp.module.css';
import { CharacterDetails } from '../CharacterDetails/CharacterDetails';
import { Controls } from '../controls/Controls';
import { Results } from '../results/Results';
import { Spinner } from '../Spinner/Spinner';
import { Flyout } from '../Flyout/Flyout';
import { useTheme } from '../../context/useTheme';
import {
  useCharacterDetailsQuery,
  useCharactersQuery,
  useSearchQueryMutation,
} from '../../hooks/rickAndMortyQueries';

export const SearchApp = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();

  const searchQuery = searchParams.get('search') || '';
  const pageParam = searchParams.get('page');
  const detailsParam = searchParams.get('details');

  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const characterId = detailsParam ? parseInt(detailsParam) : undefined;

  const {
    data: charactersData,
    isLoading: loadingCharacters,
    isError: charactersError,
    error: charactersErrorObj,
  } = useCharactersQuery(currentPage, searchQuery);

  const {
    data: characterDetails,
    isLoading: loadingDetails,
    isError: detailsError,
    error: detailsErrorObj,
  } = useCharacterDetailsQuery(characterId);

  const { mutate: saveSearch } = useSearchQueryMutation();

  const handleSearch = (query: string) => {
    const cleanedQuery = query.trim();
    saveSearch(cleanedQuery);
    const newSearchParams: Record<string, string> = {
      search: cleanedQuery,
      page: '1',
    };
    if (characterId) {
      newSearchParams.details = characterId.toString();
    }
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage: number) => {
    const newSearchParams: Record<string, string> = {
      search: searchQuery,
      page: newPage.toString(),
    };
    if (characterId) {
      newSearchParams.details = characterId.toString();
    }
    setSearchParams(newSearchParams);
  };

  const handleCharacterClick = (characterId: number) => {
    setSearchParams({
      search: searchQuery,
      page: currentPage.toString(),
      details: characterId.toString(),
    });
  };

  const handleCloseDetails = () => {
    setSearchParams({ search: searchQuery, page: currentPage.toString() });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['characters', currentPage, searchQuery],
    });
    if (characterId) {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    }
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
        <button
          onClick={handleRefresh}
          className={styles.refreshButton}
          aria-label="Refresh data"
        >
          Refresh Data
        </button>
      </div>
      <Controls
        onSearch={handleSearch}
        loading={loadingCharacters}
        initialValue={searchQuery}
      />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {charactersError && (
            <div className={styles.errorMessage} data-testid="global-error">
              Error:{' '}
              {charactersErrorObj?.message || 'Failed to load characters'}
            </div>
          )}
          <Results
            items={charactersData?.results || []}
            loading={loadingCharacters}
            error={
              charactersError ? charactersErrorObj?.message || 'Error' : null
            }
            page={currentPage}
            totalPages={charactersData?.info.pages || 1}
            onPageChange={handlePageChange}
            onCharacterClick={handleCharacterClick}
          />
        </div>
        {loadingDetails ? (
          <div style={{ width: '300px', marginLeft: '20px' }}>
            <Spinner />
          </div>
        ) : detailsError ? (
          <div
            className={styles.errorMessage}
            style={{ width: '300px', marginLeft: '20px' }}
            data-testid="details-error"
          >
            Error:{' '}
            {detailsErrorObj?.message || 'Failed to load character details'}
          </div>
        ) : characterDetails ? (
          <div style={{ width: '300px', marginLeft: '20px' }}>
            <button onClick={handleCloseDetails}>Close</button>
            <CharacterDetails character={characterDetails} />
          </div>
        ) : null}
      </div>
      <Outlet />
      <Flyout />
    </div>
  );
};
