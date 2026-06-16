import React, { useState } from 'react';
import { MdArrowBackIos as BackIcon, MdModeEditOutline as EditIcon, MdDelete as DeleteIcon, MdPlayCircle as PlayIcon, MdAddCircle as AddIcon } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import EditModal from '../editModal/EditModal';
import DeleteModal from '../deleteModal/DeleteModal';
import AddCardModal from '../addCardModal/AddCardModal';
import FlipCard from '../flipCard/FlipCard';
import StudySession from '../../features/study/components/StudySession';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useApp } from '../../contexts/AppContext';

const Category: React.FC = () => {
    const navigate = useNavigate();
    const { 
        currentDeckId, decks, cards, playing, 
        setPlaying, setCurrentDeckId 
    } = useStore();
    const { t } = useApp();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddCardModal, setShowAddCardModal] = useState(false);

    // Obtém o deck atual
    const currentDeck = decks.find((d) => d.Id === currentDeckId);
    
    // Obtém os cards do deck atual
    const deckCards = cards.filter((c) => c.DeckId === currentDeckId);

    const BackToCategories = () => {
        setCurrentDeckId(null);
        navigate('/FlashCards');
    };

    const handleStartPlaying = () => {
        setPlaying(true);
    };

    if (playing) {
        return <StudySession />;
    }

    return (
        <div className="w-full flex flex-col space-y-6">
            {currentDeckId && (
                <>
                    <EditModal ShowEdit={showEditModal} CloseEditModal={() => setShowEditModal(false)} CategoryId={currentDeckId} />
                    <DeleteModal ShowDelete={showDeleteModal} CloseDeleteModal={() => setShowDeleteModal(false)} CategoryId={currentDeckId} />
                    <AddCardModal ShowAddCardModal={showAddCardModal} CloseAddCardModal={() => setShowAddCardModal(false)} CategoryId={currentDeckId} />
                </>
            )}

            {!playing && currentDeck && (
                <div className="w-full space-y-6">
                    {/* Header do Deck */}
                    <div className="flex flex-row items-center justify-between p-5 w-full bg-card rounded-2xl shadow-premium border border-border transition-colors duration-300">
                        <div className="flex items-center gap-3 min-w-0">
                            <button className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border-none bg-transparent cursor-pointer shrink-0" onClick={BackToCategories}>
                                <BackIcon className="text-base font-medium translate-x-[3px]" />
                            </button>
                            
                            <h1 className="text-xl font-bold tracking-tight text-foreground truncate max-w-[180px] sm:max-w-[300px]">
                                {currentDeck.Name}
                            </h1>
                        </div>

                        <div className="flex flex-row items-center gap-2 shrink-0">
                            {deckCards.length > 0 && (
                                <button 
                                    onClick={handleStartPlaying}
                                    className="cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-4 py-2 text-sm flex flex-row items-center gap-1.5 shadow transition-all duration-200"
                                >
                                    <PlayIcon className="text-base" />
                                    <span>{t('play')}</span>
                                </button>
                            )}
                            
                            <button 
                                onClick={() => setShowEditModal(true)} 
                                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border-none bg-transparent cursor-pointer"
                                title={t('editCategory')}
                            >
                                <EditIcon className="text-lg" />
                            </button>
                            
                            <button 
                                onClick={() => setShowDeleteModal(true)} 
                                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                                title={t('deleteCategory')}
                            >
                                <DeleteIcon className="text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Ações e Lista de Cards */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-foreground">{t('manageCards')}</h2>
                            <p className="text-xs text-muted-foreground">
                                {deckCards.length} {t('cardsCount')}
                            </p>
                        </div>
                        <button 
                            className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-4 py-2.5 flex flex-row items-center gap-2 text-sm shadow transition-all duration-200 border-none"
                            onClick={() => setShowAddCardModal(true)}
                        >
                            <AddIcon className="text-base" />
                            <span>{t('addCard')}</span>
                        </button>
                    </div>

                    {deckCards.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border rounded-2xl bg-card">
                            <p className="text-muted-foreground text-sm font-medium mb-4">{t('noCards')}</p>
                        </div>
                    ) : (
                        <Droppable droppableId="CardsDaCategoria" key="CardsDaCategoria">
                            {(provided: any) => (
                                <div 
                                    {...provided.droppableProps} 
                                    ref={provided.innerRef} 
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-24"
                                >
                                    {deckCards.map((card, index) => (
                                        <Draggable key={card.Id} draggableId={card.Id} index={index}>
                                            {(providedDraggable: any) => (
                                                <div 
                                                    ref={providedDraggable.innerRef} 
                                                    {...providedDraggable.draggableProps} 
                                                    {...providedDraggable.dragHandleProps}
                                                    className="transition-shadow duration-200"
                                                >
                                                    <FlipCard Card={card} />
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
        </div>
    );
};

export default Category;
