import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Automatic from './Automatic';
import store from './store/store';
import Manual from './Manual';
import "./App.css"
import { BrowserRouter as Router } from "react-router-dom";
import Layout from './Layout';
import { Provider } from 'react-redux'
import { setFunction } from './store/actions/UserActions';

function App() {

  useEffect(() => {
    const CurrentFunction = store.getState().User.Function
    console.log(store.getState().User.Function)
    if (window.location.pathname.includes('Trivia') && CurrentFunction === 'No')
      store.dispatch(setFunction('Trivia'))
    if (window.location.pathname.includes('FlashCards') && CurrentFunction === 'No')
      store.dispatch(setFunction('FlashCards'))
  }, []);


  return (
    <>
      <Router>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<Layout />} >
              <Route path="/Trivia" element={<Automatic />} />
              <Route path="/FlashCards" element={<Manual />} />
            </Route>
          </Routes>
        </Provider>
      </Router>

    </>
  );
}

export default App;
