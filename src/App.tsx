import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { SearchApp } from './components/SearchApp/SearchApp';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { About } from './components/About/About';
import { NotFound } from './components/NotFound/NotFound';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<SearchApp />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
