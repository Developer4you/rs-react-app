import React, { useState, useEffect } from 'react';
import styles from './controls.module.css';
import { SearchInput } from '../SearchInput/SearchInput';
import { Button } from '../Button/Button';

interface ControlsProps {
  onSearch: (query: string) => void;
  loading: boolean;
  initialValue: string;
}

export const Controls = ({
  onSearch,
  loading,
  initialValue,
}: ControlsProps) => {
  const [inputValue, setInputValue] = useState(initialValue || '');

  useEffect(() => {
    if (!initialValue) {
      const savedQuery = localStorage.getItem('rickAndMortySearchQuery') || '';
      setInputValue(savedQuery.trim());
    }
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    const trimmed = inputValue.trim();
    setInputValue(trimmed);
    onSearch(trimmed);
  };

  return (
    <div className={styles.controls}>
      <SearchInput
        inputValue={inputValue}
        handleInputChange={handleInputChange}
      />
      <Button
        label={loading ? 'Searching...' : 'Search'}
        onClick={handleSearchClick}
        disabled={loading}
      />
    </div>
  );
};
