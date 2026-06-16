import { useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Automatic from './Automatic';
import store from './store/store';
import Manual from './Manual';
import Layout from './Layout';
import { setFunction } from './store/actions/UserActions';
import { AppProvider } from './contexts/AppContext';

// Legal Pages
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimer from './pages/Disclaimer';
import AboutDeveloper from './pages/AboutDeveloper';

function App() {
  useEffect(() => {
    const currentFunction = store.getState().User.Function;

    if (window.location.pathname.includes('Trivia') && currentFunction === 'No') {
      store.dispatch(setFunction('Trivia'));
    }
    if (window.location.pathname.includes('FlashCards') && currentFunction === 'No') {
      store.dispatch(setFunction('FlashCards'));
    }
  }, []);

  return (
    <Provider store={store}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
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
    </Provider>
  );
}

export default App;
