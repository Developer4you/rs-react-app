import React from 'react';
import styles from './main.module.css';
import Controls from '../controls/Controls';
import Results from '../results/Results';
import { Button } from '../Button/Button';
import type { ApiResponse, MainState } from '../../interfaces/interfaces';

class Main extends React.Component<object, MainState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchQuery: '',
      results: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
    };
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
        // Если персонажи не найдены, API возвращает 404
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
    this.setState({ searchQuery: query, currentPage: 1 }, () =>
      this.fetchCharacters(1, query.trim())
    );
  };

  handlePageChange = (newPage: number) => {
    this.fetchCharacters(newPage, this.state.searchQuery);
  };

  simulateError = () => {
    this.setState({
      error: 'Simulated error: Something went wrong!',
    });
  };

  render() {
    const { results, loading, error, currentPage, totalPages } = this.state;

    return (
      <div className={styles.main}>
        <Controls onSearch={this.handleSearch} loading={loading} />
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
