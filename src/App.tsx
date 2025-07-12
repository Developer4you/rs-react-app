import './App.css';
import SearchApp from './components/SearchApp/SearchApp';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <>
      <ErrorBoundary>
        <SearchApp />
      </ErrorBoundary>
    </>
  );
}

export default App;
