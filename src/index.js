import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store/store';
import { setCards } from './store/actions/CardsActions';


if (localStorage.getItem('FlashCardsCategories')) {
  if (JSON.parse(localStorage.getItem('FlashCardsCategories')).length > 0) {
    const CardsFromLocalstorage = JSON.parse(localStorage.getItem('FlashCardsCategories'))
    //console.log(CardsFromLocalstorage)
    store.dispatch(setCards(CardsFromLocalstorage))
  } else {
    store.dispatch(setCards([]))
  }

} else {
  store.dispatch(setCards([]))
}


//const UserFromLocalstorage = JSON.parse(localStorage.getItem('FlashCardsCategories'))



const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


