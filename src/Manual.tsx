import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MdModeEditOutline as EditIcon, MdDelete as DeleteIcon, MdAddCircle as AddIcon, MdFolder, MdArrowBack } from 'react-icons/md';
import { useStore } from './store/useStore';
import CategoryComponent from './components/category/Category';
import EditModal from './components/editModal/EditModal';
import DeleteModal from './components/deleteModal/DeleteModal';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useApp } from './contexts/AppContext';

const Manual: React.FC = () => {
  const navigate = useNavigate();
  const { decks, currentDeckId, setCurrentDeckId, addDeck } = useStore();
  const { t } = useApp();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryIdEdit, setCategoryIdEdit] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryIdDelete, setCategoryIdDelete] = useState('');

  const { ID } = useParams<{ ID?: string }>();

  useEffect(() => {
    if (ID) {
      const cat = decks.find((c) => c.Name === ID);
      if (cat) {
        setCurrentDeckId(cat.Id);
      } else {
        setCurrentDeckId(null);
      }
    } else {
      setCurrentDeckId(null);
    }
  }, [ID, decks, setCurrentDeckId]);

  const handleShowEditModal = (id: string) => {
    setCategoryIdEdit(id);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (id: string) => {
    setCategoryIdDelete(id);
    setShowDeleteModal(true);
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    await addDeck(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddModal(false);
  };

  const compareCategories = (a: any, b: any) => {
    return b.Index - a.Index;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {currentDeckId === null && (
        <div className="w-full space-y-6">
          {/* Header com botão de voltar para Dashboard */}
          <div className="flex flex-row justify-between items-center bg-card p-5 border border-border rounded-2xl shadow-premium">
            <div className="flex items-center gap-3">
              <Link to="/" className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <MdArrowBack className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {t('categories')}
                </h1>
                <p className="text-xs text-muted-foreground font-semibold">
                  {decks.length} {t('categories').toLowerCase()}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="cursor-pointer border-none bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-lg py-2.5 px-4 flex flex-row items-center gap-1.5 shadow transition-all duration-200"
            >
              <AddIcon className="text-lg" />
              <span>{t('addCategory')}</span>
            </button>
          </div>

          {/* Add Category Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity duration-300">
              <div className="bg-card border border-border text-foreground rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/40">
                  <h3 className="text-lg font-bold font-sans">{t('addCategory')}</h3>
                  <button 
                    onClick={() => { setShowAddModal(false); setNewCategoryName(''); }} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-2xl font-bold border-none bg-transparent cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleAddCategorySubmit} className="p-6 space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('categoryName')}</label>
                    <input 
                      type="text" 
                      placeholder={t('enterCategoryName')} 
                      value={newCategoryName} 
                      onChange={e => setNewCategoryName(e.target.value)}
                      className="bg-background border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => { setShowAddModal(false); setNewCategoryName(''); }} 
                      className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer"
                    >
                      {t('cancel')}
                    </button>
                    <button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer shadow-md"
                    >
                      {t('save')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <EditModal ShowEdit={showEditModal} CloseEditModal={() => setShowEditModal(false)} CategoryId={categoryIdEdit} />
          <DeleteModal ShowDelete={showDeleteModal} CloseDeleteModal={() => setShowDeleteModal(false)} CategoryId={categoryIdDelete} />

          <Droppable droppableId="ListaCategorias" key="ListaCategorias">
            {(provided: any) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="space-y-3 pb-24"
              >
                {[...decks].sort(compareCategories).map((category, index) => (
                  <Draggable key={category.Id} draggableId={category.Id} index={index}>
                    {(providedDraggable: any) => (
                      <div 
                        ref={providedDraggable.innerRef} 
                        {...providedDraggable.draggableProps} 
                        {...providedDraggable.dragHandleProps}
                        className="bg-card border border-border rounded-xl flex flex-row items-stretch overflow-hidden shadow-premium hover:border-primary/50 transition-all duration-200"
                      >
                        <div 
                          className="flex justify-center items-center bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground text-sm font-bold w-12 shrink-0 cursor-pointer border-r border-border"
                          onClick={() => navigate("/FlashCards/" + category.Name)}
                        >
                          <MdFolder className="text-lg" />
                        </div>
                        <div className="flex flex-row items-center justify-between flex-grow p-4 gap-4 bg-card">
                          <Link 
                            className="text-foreground font-bold hover:text-primary transition-colors truncate flex-grow pr-4 text-base select-none" 
                            to={"/FlashCards/" + category.Name}
                          >
                            {category.Name}
                          </Link>
                          <div className="flex flex-row items-center gap-3 shrink-0">
                            <EditIcon 
                              onClick={() => handleShowEditModal(category.Id)} 
                              className="text-muted-foreground hover:text-primary cursor-pointer text-lg transition-colors"
                            />
                            <DeleteIcon 
                              onClick={() => handleShowDeleteModal(category.Id)} 
                              className="text-muted-foreground hover:text-red-500 cursor-pointer text-lg transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {decks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-2 border border-dashed border-border rounded-2xl bg-card">
              <p className="text-foreground text-lg font-bold">{t('noCategories')}</p>
            </div>
          )}
        </div>
      )}

      {currentDeckId !== null && (
        <div className="w-full">
          <CategoryComponent />
        </div>
      )}
    </div>
  );
};

export default Manual;
