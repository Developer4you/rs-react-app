import React from 'react';
import styles from './searchApp.module.css';
import Controls from '../controls/Controls';
import Results from '../results/Results';
import { Button } from '../Button/Button';
import type { ApiResponse, SearchAppState } from '../../interfaces/interfaces';

class Main extends React.Component<object, SearchAppState> {
  constructor(props: object) {
    super(props);
    const savedQuery = localStorage.getItem('rickAndMortySearchQuery') || '';

    this.state = {
      searchQuery: savedQuery,
      results: [],
      loading: Boolean(savedQuery),
      error: null,
      currentPage: 1,
      totalPages: 1,
      hasError: false,
      shouldThrowError: false,
      renderError: null,
    };
  }

  componentDidMount() {
    this.fetchCharacters(1, this.state.searchQuery);
  }

  fetchCharacters = async (page: number = 1, name: string = '') => {
    this.setState({ loading: true, error: null });

    try {
      let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
      if (name) {
        url += `&name=${encodeURIComponent(name)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return this.setState({
            results: [],
            loading: false,
            totalPages: 0,
          });
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      this.setState({
        results: data.results,
        currentPage: page,
        totalPages: data.info.pages,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
    }
  };

  handleSearch = (query: string) => {
    const cleanedQuery = query.trim();

    localStorage.setItem('rickAndMortySearchQuery', cleanedQuery);

    this.setState(
      {
        searchQuery: cleanedQuery,
        currentPage: 1,
      },
      () => {
        if (this.state.searchQuery) {
          this.fetchCharacters(1, this.state.searchQuery);
        } else {
          this.fetchCharacters(1, this.state.searchQuery);
          localStorage.removeItem('rickAndMortySearchQuery');
        }
      }
    );
  };

  handlePageChange = (newPage: number) => {
    this.fetchCharacters(newPage, this.state.searchQuery);
  };

  simulateError = (): void => {
    const errorTypes: Array<() => Error> = [
      () => new Error('Test error from button click!'),
      () => new TypeError('nonExistentMethod is not a function'),
      () => new SyntaxError('Invalid JSON'),
    ];

    const error = errorTypes[Math.floor(Math.random() * errorTypes.length)]();
    this.setState({
      shouldThrowError: true,
      renderError: error,
    });
  };

  render() {
    const { results, loading, error, currentPage, totalPages } = this.state;
    const { shouldThrowError, renderError } = this.state;

    if (shouldThrowError && renderError) {
      throw renderError;
    }

    return (
      <div className={styles.searchApp}>
        <Controls
          onSearch={this.handleSearch}
          loading={loading}
          initialValue={this.state.searchQuery}
        />
        <Results
          items={results}
          loading={loading}
          error={error}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={this.handlePageChange}
        />
        <div
          style={{ display: 'flex', justifyContent: 'end', padding: '20px 0' }}
        >
          <Button
            label="Error Button"
            maxWith="200px"
            onClick={this.simulateError}
          />
        </div>
      </div>
    );
  }
}

export default Main;
