import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import store from './store/store';
import { setCards } from './store/actions/CardsActions';
import { DragDropContext } from 'react-beautiful-dnd';

const localCategories = localStorage.getItem('FlashCardsCategories');
if (localCategories) {
  try {
    const parsed = JSON.parse(localCategories);
    if (Array.isArray(parsed) && parsed.length > 0) {
      store.dispatch(setCards(parsed));
    } else {
      store.dispatch(setCards([]));
    }
  } catch (e) {
    store.dispatch(setCards([]));
  }
} else {
  store.dispatch(setCards([]));
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <DragDropContext onDragEnd={(result: any) => { console.log(result); }}>
      <App />
    </DragDropContext>
  );
}
