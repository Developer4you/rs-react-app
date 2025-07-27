import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { SearchApp } from './components/SearchApp/SearchApp';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { About } from './components/About/About';
import { NotFound } from './components/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<SearchApp />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
