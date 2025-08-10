import { useState, useEffect, useRef } from 'react';
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

  const [isCached, setIsCached] = useState(false);
  const cacheTimerRef = useRef<number | null>(null);

  const {
    data: charactersData,
    isLoading: loadingCharacters,
    isError: charactersError,
    error: charactersErrorObj,
    isFetched: isCharactersFetched,
    isFetchedAfterMount: isCharactersFetchedAfterMount,
  } = useCharactersQuery(currentPage, searchQuery);

  const {
    data: characterDetails,
    isLoading: loadingDetails,
    isError: detailsError,
    error: detailsErrorObj,
    isFetched: isDetailsFetched,
    isFetchedAfterMount: isDetailsFetchedAfterMount,
  } = useCharacterDetailsQuery(characterId);

  const { mutate: saveSearch } = useSearchQueryMutation();

  useEffect(() => {
    if (cacheTimerRef.current !== null) {
      clearTimeout(cacheTimerRef.current);
    }

    if (isCharactersFetched && !isCharactersFetchedAfterMount) {
      setIsCached(true);

      cacheTimerRef.current = window.setTimeout(() => {
        setIsCached(false);
        cacheTimerRef.current = null;
      }, 60000);
    } else {
      setIsCached(false);
    }

    return () => {
      if (cacheTimerRef.current !== null) {
        clearTimeout(cacheTimerRef.current);
        cacheTimerRef.current = null;
      }
    };
  }, [charactersData, isCharactersFetched, isCharactersFetchedAfterMount]);

  useEffect(() => {
    if (isDetailsFetched && !isDetailsFetchedAfterMount && characterDetails) {
      console.log('Character details loaded from cache');
    }
  }, [characterDetails, isDetailsFetched, isDetailsFetchedAfterMount]);

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

    setIsCached(false);
    if (cacheTimerRef.current !== null) {
      clearTimeout(cacheTimerRef.current);
      cacheTimerRef.current = null;
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

        <div className={styles.cacheStatus}>
          {isCached ? (
            <span className={styles.cacheIndicator}>Data from cache</span>
          ) : (
            <span className={styles.noCacheIndicator}>Live data</span>
          )}
        </div>
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
            isCached={isCached}
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
