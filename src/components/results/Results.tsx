import React from 'react';
import styles from './results.module.css';
import { Card } from '../Card/Card';
import Spinner from '../Spinner/Spinner';

interface ResultsProps {
  items: any[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

class Results extends React.Component<ResultsProps> {
  render() {
    const { items, loading, error, page, totalPages, onPageChange } =
      this.props;

    if (loading) {
      return (
        <div>
          <Spinner />
          <div>Loading...</div>
        </div>
      );
    }

    if (error) {
      return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (items.length === 0) {
      return <div>No results found</div>;
    }

    return (
      <div className={styles.results}>
        <div>
          <div className={styles.cardsBox}>
            {items.map((item, index) => (
              <div key={index}>
                <Card
                  image={item.image}
                  name={item.name}
                  locationName={item.location.name}
                  gender={item.gender}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div>
              <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
              >
                Previous
              </button>
              <span>
                {' '}
                Page {page} of {totalPages}{' '}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Results;
