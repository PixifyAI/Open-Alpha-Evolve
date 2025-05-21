import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import EvolutionLab from './pages/EvolutionLab';
import Settings from './pages/Settings';
import ImportProject from './pages/ImportProject';
import NotFound from './pages/NotFound';
import { EvolutionProvider } from './context/EvolutionContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <EvolutionProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Problems />} />
              <Route path="/lab/:projectId?" element={<EvolutionLab />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/import" element={<ImportProject />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </EvolutionProvider>
    </ThemeProvider>
  );
}

export default App;