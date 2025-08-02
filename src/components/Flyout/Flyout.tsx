import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import { Button } from '../Button/Button';
import styles from './flyout.module.css';

export const Flyout = () => {
  const { selectedItems, clearAll } = useSelectedItemsStore();
  const count = selectedItems.length;

  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Location', 'Gender', 'Details URL'];
    const csvContent = [
      headers.join(','),
      ...selectedItems.map((item) =>
        [
          item.id,
          `"${item.name.replace(/"/g, '""')}"`,
          `"${item.locationName.replace(/"/g, '""')}"`,
          `"${item.gender}"`,
          `"${item.detailsUrl}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${count}_items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (count === 0) return null;

  return (
    <div className={styles.flyout}>
      <div className={styles.flyoutContent}>
        <span>
          {count} item{count > 1 ? 's' : ''} selected
        </span>
        <div className={styles.buttons}>
          <Button label="Unselect all" onClick={clearAll} maxWith="150px" />
          <Button label="Download" onClick={downloadCSV} maxWith="150px" />
        </div>
      </div>
    </div>
  );
};
