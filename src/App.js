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
import 'bootstrap/dist/css/bootstrap.min.css'
import { DragDropContext } from "react-beautiful-dnd"; 

function App() {

  useEffect(() => {
    const CurrentFunction = store.getState().User.Function

    if (window.location.pathname.includes('Trivia') && CurrentFunction === 'No')
      store.dispatch(setFunction('Trivia'))
    if (window.location.pathname.includes('FlashCards') && CurrentFunction === 'No')
      store.dispatch(setFunction('FlashCards'))
  }, []);


  return (
    <DragDropContext onDragEnd={(result) => { console.log(result) }}> 
      <Router>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<Layout />} >
              <Route path="/Trivia" element={<Automatic />} />
              <Route path="/FlashCards/:ID" element={<Manual />} />
              <Route path="/FlashCards" element={<Manual />} />
            </Route>
          </Routes>
        </Provider>
      </Router>

    </DragDropContext>
  );
}

export default App;
