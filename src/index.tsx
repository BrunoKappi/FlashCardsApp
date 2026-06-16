import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { DragDropContext } from 'react-beautiful-dnd';
import { migrateLocalStorageToDexie } from './services/migrate';
import { useStore } from './store/useStore';

// Inicia migração local
migrateLocalStorageToDexie().then(() => {
  useStore.getState().syncFromDB();
});

const handleDragEnd = (result: any) => {
  const { destination, source } = result;
  if (!destination) return;
  if (destination.index === source.index) return;

  const state = useStore.getState();

  // Reordenação de decks (categorias) na tela principal
  if (source.droppableId === 'ListaCategorias') {
    const items = [...state.decks];
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    state.reorderDecks(items);
  }
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <DragDropContext onDragEnd={handleDragEnd}>
      <App />
    </DragDropContext>
  );
}
