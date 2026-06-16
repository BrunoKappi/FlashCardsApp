import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdArrowBackIos as BackIcon, MdModeEditOutline as EditIcon, MdDelete as DeleteIcon, MdPlayCircle as PlayIcon, MdAddCircle as AddIcon } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { setPlaying, setCurrentCategory as SetCurrentCategoryRedux } from '../../store/actions/UserActions';
import { editCategory } from '../../store/actions/CardsActions';
import EditModal from '../editModal/EditModal';
import DeleteModal from '../deleteModal/DeleteModal';
import AddCardModal from '../addCardModal/AddCardModal';
import FlipCard from '../flipCard/FlipCard';
import { v4 as uuid_v4 } from 'uuid';
import Playing from '../playing/Playing';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { RootState } from '../../store/store';
import { Category as CategoryType } from '../../store/types';
import { useApp } from '../../contexts/AppContext';

const Category: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User);
    const cards = useSelector((state: RootState) => state.Cards);
    const { t } = useApp();

    const [isPlayingState, setIsPlayingState] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<CategoryType>({ Index: 0, Id: '', Name: '', Cards: [] });
    
    const [showEditModal, setShowEditModal] = useState(false);
    const [categoryIdEdit, setCategoryIdEdit] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryIdDelete, setCategoryIdDelete] = useState('');
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [categoryIdAddCard, setCategoryIdAddCard] = useState('');

    useEffect(() => {
        if (!user.CurrentCategoryId) return;
        const found = cards.find((c: CategoryType) => c.Id.trim() === user.CurrentCategoryId);
        if (found) {
            setCurrentCategory(found);
        }
    }, [user.CurrentCategoryId, cards]);

    useEffect(() => {
        setIsPlayingState(user.Playing);
    }, [user.Playing]);

    const handleShowEditModal = (id: string) => {
        setShowEditModal(true);
        setCategoryIdEdit(id);
    };

    const handleShowDeleteModal = (id: string) => {
        setShowDeleteModal(true);
        setCategoryIdDelete(id);
    };

    const handleShowAddCardModal = (id: string) => {
        setShowAddCardModal(true);
        setCategoryIdAddCard(id);
    };

    const BackToCategories = () => {
        dispatch(SetCurrentCategoryRedux({ Name: 'No', Id: '' }));
    };

    const handleStartPlaying = () => {
        dispatch(setPlaying(true));
        setIsPlayingState(true);
    };

    const handleStopPlaying = () => {
        dispatch(setPlaying(false));
        setIsPlayingState(false);
    };

    const RecordPlay = (play: any) => {
        const edited = { ...currentCategory };
        const rounds = (edited as any).Rounds ? [...(edited as any).Rounds, play] : [play];
        const editedCategory = { ...edited, Rounds: rounds };
        dispatch(editCategory(editedCategory));
        dispatch(SetCurrentCategoryRedux(editedCategory));
    };

    const foundCategory = cards.find((cat) => cat.Id === user.CurrentCategoryId);
    const catCards = foundCategory ? foundCategory.Cards : [];

    return (
        <div className="w-full flex flex-col">
            <EditModal ShowEdit={showEditModal} CloseEditModal={() => setShowEditModal(false)} CategoryId={categoryIdEdit} />
            <DeleteModal ShowDelete={showDeleteModal} CloseDeleteModal={() => setShowDeleteModal(false)} CategoryId={categoryIdDelete} />
            <AddCardModal ShowAddCardModal={showAddCardModal} CloseAddCardModal={() => setShowAddCardModal(false)} CategoryId={categoryIdAddCard} />

            {!isPlayingState && (
                <div className="w-full flex flex-col">
                    <div className="flex flex-row items-center justify-between p-4 w-full bg-card rounded-2xl mb-6 shadow-sm border border-border transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <Link className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" onClick={BackToCategories} to="/FlashCards">
                                <BackIcon className="text-base font-medium translate-x-[3px]" />
                            </Link>
                            
                            <h1 className="text-xl font-bold tracking-tight text-foreground truncate max-w-[200px] sm:max-w-[350px]">
                                {user.CurrentCategory}
                            </h1>
                        </div>

                        <div className="flex flex-row items-center gap-3">
                            {catCards.length > 0 && (
                                <button 
                                    onClick={handleStartPlaying}
                                    className="cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-4 py-1.5 text-sm flex flex-row items-center gap-1.5 shadow-sm transition-all duration-200"
                                >
                                    <PlayIcon className="text-base" />
                                    <span>{t('play')}</span>
                                </button>
                            )}
                            
                            <button 
                                onClick={() => handleShowEditModal(user.CurrentCategoryId)} 
                                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <EditIcon className="text-lg" />
                            </button>
                            
                            <button 
                                onClick={() => handleShowDeleteModal(user.CurrentCategoryId)} 
                                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-red-500 transition-colors"
                            >
                                <DeleteIcon className="text-lg" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold tracking-tight text-foreground">{t('manageCards')}</h2>
                        <button 
                            className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-4 py-2 flex flex-row items-center gap-2 text-sm shadow transition-all duration-200"
                            onClick={() => handleShowAddCardModal(user.CurrentCategoryId)}
                        >
                            <AddIcon className="text-base" />
                            <span>{t('addCard')}</span>
                        </button>
                    </div>

                    {catCards.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border rounded-2xl bg-card/50">
                            <p className="text-muted-foreground text-sm mb-4">{t('noCards')}</p>
                        </div>
                    ) : (
                        <Droppable droppableId="CardsDaCategoria" key="CardsDaCategoria">
                            {(provided: any) => (
                                <div 
                                    {...provided.droppableProps} 
                                    ref={provided.innerRef} 
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-24"
                                >
                                    {catCards.map((card, index) => (
                                        <Draggable key={card.Id} draggableId={card.Id} index={index}>
                                            {(providedDraggable: any) => (
                                                <div 
                                                    ref={providedDraggable.innerRef} 
                                                    {...providedDraggable.draggableProps} 
                                                    {...providedDraggable.dragHandleProps}
                                                    className="transition-shadow duration-200"
                                                >
                                                    <FlipCard key={uuid_v4()} Card={card} CategoryId={user.CurrentCategoryId} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    )}
                </div>
            )}

            {isPlayingState && (
                <div className="w-full">
                    <Playing RecordPlay={RecordPlay} CurrentCategoryId={user.CurrentCategoryId} Categories={cards} StopPlaying={handleStopPlaying} />
                </div>
            )}
        </div>
    );
};

export default Category;
