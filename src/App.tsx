import { useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Automatic from './Automatic';
import Manual from './Manual';
import Layout from './Layout';
import { AppProvider } from './contexts/AppContext';
import { useStore } from './store/useStore';
import Dashboard from './features/dashboard/components/Dashboard';

// Legal Pages
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimer from './pages/Disclaimer';
import AboutDeveloper from './pages/AboutDeveloper';

function App() {
  const syncFromDB = useStore((state) => state.syncFromDB);

  useEffect(() => {
    // Sincroniza dados do IndexedDB na inicialização
    syncFromDB();
  }, [syncFromDB]);

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Página Principal agora é o Dashboard de Estudos */}
            <Route index element={<Dashboard />} />
            
            {/* Outras rotas */}
            <Route path="Trivia" element={<Automatic />} />
            <Route path="FlashCards/:ID" element={<Manual />} />
            <Route path="FlashCards" element={<Manual />} />
            <Route path="termos-de-uso" element={<TermsOfUse />} />
            <Route path="politica-de-privacidade" element={<PrivacyPolicy />} />
            <Route path="politica-de-cookies" element={<CookiePolicy />} />
            <Route path="termos-de-responsabilidade" element={<Disclaimer />} />
            <Route path="sobre-o-desenvolvedor" element={<AboutDeveloper />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
