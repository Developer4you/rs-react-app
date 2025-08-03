import styles from './results.module.css';
import { Card } from '../Card/Card';
import type { ResultsProps } from '../../interfaces/interfaces';
import { Spinner } from '../Spinner/Spinner';

export const Results = ({
  items,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  onCharacterClick,
}: ResultsProps) => {
  if (error) {
    if (error.includes('Critical API error')) {
      throw new Error(error);
    }

    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <p>API Error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Spinner />
        <div>Loading...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <div className={styles.results}>
      <div>
        <div className={styles.cardsBox}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onCharacterClick(item.id)}
              style={{ cursor: 'pointer' }}
              data-testid={`character-${item.id}`}
            >
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
};
