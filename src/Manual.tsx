import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { v4 as uuid_v4 } from 'uuid';
import { MdModeEditOutline as EditIcon, MdDelete as DeleteIcon, MdAddCircle as AddIcon } from 'react-icons/md';
import { addCategory } from './store/actions/CardsActions';
import { setCurrentCategory, setPlaying } from './store/actions/UserActions';
import CategoryComponent from './components/category/Category';
import EditModal from './components/editModal/EditModal';
import DeleteModal from './components/deleteModal/DeleteModal';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { RootState } from './store/store';
import { Category } from './store/types';

const Manual: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.User);
  const cards = useSelector((state: RootState) => state.Cards);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryIdEdit, setCategoryIdEdit] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryIdDelete, setCategoryIdDelete] = useState('');

  const { ID } = useParams<{ ID?: string }>();

  const handleSetCurrentCategory = (category: { Name: string; Id: string }) => {
    dispatch(setCurrentCategory(category));
  };

  useEffect(() => {
    if (ID && user.CurrentCategory === 'No') {
      const cat = cards.find((c: Category) => c.Name === ID);
      if (cat) {
        handleSetCurrentCategory(cat);
      } else {
        handleSetCurrentCategory({ Name: 'No', Id: '' });
        dispatch(setPlaying(false));
      }
    } else if (!ID && user.CurrentCategory !== 'No') {
      handleSetCurrentCategory({ Name: 'No', Id: '' });
      dispatch(setPlaying(false));
    }
  }, [ID]);

  const handleShowEditModal = (id: string) => {
    setCategoryIdEdit(id);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (id: string) => {
    setCategoryIdDelete(id);
    setShowDeleteModal(true);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCategory();
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    setShowAddModal(false);
    const index = cards.length + 2;
    const newCat: Category = {
      Index: index,
      Id: uuid_v4(),
      Name: newCategoryName.trim(),
      Cards: []
    };
    
    dispatch(addCategory(newCat));
    setNewCategoryName('');
  };

  const compareCategories = (a: Category, b: Category) => {
    return b.Index - a.Index;
  };

  return (
    <div className="p-8 sm:p-2">
      {user.CurrentCategory === 'No' && (
        <div className="w-full">
          <div className="flex flex-row justify-end mb-8 sm:fixed sm:bottom-4 sm:right-4 sm:z-10">
            <button 
              onClick={() => setShowAddModal(true)}
              className="cursor-pointer border-none bg-yellow hover:bg-yellow-brighter text-white font-bold rounded-full py-3 px-6 flex flex-row items-center gap-1.5 shadow-lg transition-transform hover:scale-105 sm:text-xs"
            >
              <AddIcon className="text-xl" />
              <span>Add Category</span>
            </button>
          </div>

          {/* Add Category Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300">
              <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                  <h3 className="text-lg font-bold font-sans">Add Category</h3>
                  <button 
                    onClick={() => { setShowAddModal(false); setNewCategoryName(''); }} 
                    className="text-slate-400 hover:text-white transition-colors text-2xl font-bold border-none bg-transparent cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleAddCategorySubmit} className="p-6 space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Name</label>
                    <input 
                      type="text" 
                      placeholder="Category name" 
                      value={newCategoryName} 
                      onChange={e => setNewCategoryName(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow/50"
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => { setShowAddModal(false); setNewCategoryName(''); }} 
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-yellow hover:bg-yellow-brighter text-white font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer shadow-md"
                    >
                      Add
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
                className="space-y-4 max-w-3xl mx-auto pb-24"
              >
                {[...cards].sort(compareCategories).map((category, index) => (
                  <Draggable key={category.Id} draggableId={category.Id} index={index}>
                    {(providedDraggable: any) => (
                      <div 
                        ref={providedDraggable.innerRef} 
                        {...providedDraggable.draggableProps} 
                        {...providedDraggable.dragHandleProps}
                        className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-slate-700/80 rounded-2xl flex flex-row items-stretch overflow-hidden shadow-lg hover:scale-[1.01] transition-transform duration-200"
                      >
                        <div 
                          className="flex justify-center items-center bg-yellow text-white text-xl font-bold w-14 shrink-0 cursor-pointer"
                          onClick={() => handleSetCurrentCategory(category)}
                        >
                          {index + 1}
                        </div>
                        <div className="flex flex-row items-center justify-between flex-grow bg-slate-900/40 p-5 gap-4">
                          <Link 
                            className="text-white text-lg font-bold hover:text-yellow transition-colors truncate flex-grow pr-4 max-w-md select-none" 
                            to={"/FlashCards/" + category.Name}
                            onClick={() => handleSetCurrentCategory(category)}
                          >
                            {category.Name}
                          </Link>
                          <div className="flex flex-row items-center gap-3 shrink-0">
                            <EditIcon 
                              onClick={() => handleShowEditModal(category.Id)} 
                              className="text-slate-400 hover:text-yellow cursor-pointer text-xl transition-colors"
                            />
                            <DeleteIcon 
                              onClick={() => handleShowDeleteModal(category.Id)} 
                              className="text-slate-400 hover:text-red-500 cursor-pointer text-xl transition-colors"
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

          {cards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-2 max-w-md mx-auto">
              <p className="text-white text-xl sm:text-base font-bold">You don't have any category added</p>
              <p className="text-slate-350 text-sm">Add a category to start building your flashcards deck.</p>
            </div>
          )}
        </div>
      )}

      {user.CurrentCategory !== 'No' && (
        <div className="w-full">
          <CategoryComponent />
        </div>
      )}
    </div>
  );
};

export default Manual;
