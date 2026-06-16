import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { MdDelete as DeleteIcon } from 'react-icons/md';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Option } from '../../services/db';
import { useApp } from '../../contexts/AppContext';
import { v4 as uuid_v4 } from 'uuid';

interface AddCardModalProps {
    ShowAddCardModal: boolean;
    CloseAddCardModal: () => void;
    CategoryId: string;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ ShowAddCardModal, CloseAddCardModal, CategoryId }) => {
    const { addCard } = useStore();
    const { t } = useApp();

    const [cardType, setCardType] = useState<'Text' | 'MultipleChoice'>('Text');
    const [errorMessage, setErrorMessage] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [optionsSet, setOptionsSet] = useState<Option[]>([]);
    const [newOption, setNewOption] = useState('');
    const [correctIndex, setCorrectIndex] = useState<number>(-1);

    if (!ShowAddCardModal) return null;

    const handleClose = () => {
        CloseAddCardModal();
        handleClearAll();
    };

    const handleChangeTypeOption = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardType(event.target.value as 'Text' | 'MultipleChoice');
    };

    const handleChangeCorrectOption = (event: React.ChangeEvent<HTMLInputElement>) => {
        const optionId = event.target.value;
        const optionIndex = optionsSet.findIndex(op => op.Id.toString() === optionId.toString());
        
        const newOptions = optionsSet.map((op, idx) => ({
            ...op,
            IsAnswer: idx === optionIndex
        }));
        
        setCorrectIndex(optionIndex);
        setOptionsSet(newOptions);
    };

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleAddOption = (e: React.FormEvent) => {
        e.preventDefault();
        if (newOption.trim()) {
            const newOptionObject: Option = {
                Id: uuid_v4(),
                Option: capitalizeFirstLetter(newOption.trim()),
                IsAnswer: false
            };
            setOptionsSet([...optionsSet, newOptionObject]);
            setNewOption('');
        }
    };

    const handleDeleteOption = (optionId: number | string) => {
        const filtered = optionsSet.filter(op => op.Id !== optionId);
        setOptionsSet(filtered);
        setCorrectIndex(-1);
    };

    const handleClearAll = () => {
        setAnswer('');
        setQuestion('');
        setErrorMessage('');
        setOptionsSet([]);
        setCardType('Text');
        setNewOption('');
        setCorrectIndex(-1);
    };

    const handleAddCardSubmit = async () => {
        if (cardType === 'MultipleChoice') {
            if (optionsSet.length === 0) {
                setErrorMessage('You need at least one option');
                return;
            }
            if (correctIndex === -1) {
                setErrorMessage('You need to choose the correct option');
                return;
            }
        }
        if (!question.trim()) {
            setErrorMessage('You need to fill the question');
            return;
        }
        if (!answer.trim() && cardType === 'Text') {
            setErrorMessage('You need to fill the answer');
            return;
        }

        try {
            await addCard(
                CategoryId, 
                question.trim(), 
                cardType === 'Text' ? answer.trim() : optionsSet[correctIndex].Option, 
                cardType, 
                optionsSet
            );
            handleClose();
        } catch (err) {
            setErrorMessage('Failed to add card: ' + String(err));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-card border border-border text-foreground rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/40">
                    <h3 className="text-lg font-bold font-sans">{t('addCard')}</h3>
                    <button 
                        onClick={handleClose} 
                        className="text-muted-foreground hover:text-foreground transition-colors text-2xl font-bold border-none bg-transparent cursor-pointer"
                    >
                        &times;
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow space-y-6">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">{t('cardType')}</p>
                        <div className="flex flex-row gap-6">
                            <label className="flex items-center gap-2 cursor-pointer bg-secondary/50 hover:bg-secondary px-4 py-2.5 rounded-lg border border-border select-none">
                                <input 
                                    type="radio" 
                                    name="CardType" 
                                    value="Text" 
                                    checked={cardType === 'Text'} 
                                    onChange={handleChangeTypeOption}
                                    className="accent-primary h-4 w-4"
                                />
                                <span className="text-sm font-semibold">{t('textType')}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-secondary/50 hover:bg-secondary px-4 py-2.5 rounded-lg border border-border select-none">
                                <input 
                                    type="radio" 
                                    name="CardType" 
                                    value="MultipleChoice" 
                                    checked={cardType === 'MultipleChoice'} 
                                    onChange={handleChangeTypeOption}
                                    className="accent-primary h-4 w-4"
                                />
                                <span className="text-sm font-semibold">{t('mcType')}</span>
                            </label>
                        </div>
                    </div>

                    {cardType === 'Text' && (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('question')}</label>
                                <textarea 
                                    placeholder={t('enterQuestion')} 
                                    value={question} 
                                    onChange={e => setQuestion(e.target.value)}
                                    className="bg-background border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 h-24 resize-none"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('answer')}</label>
                                <textarea 
                                    placeholder={t('enterAnswer')} 
                                    value={answer} 
                                    onChange={e => setAnswer(e.target.value)}
                                    className="bg-background border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 h-24 resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {cardType === 'MultipleChoice' && (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('question')}</label>
                                <textarea 
                                    placeholder={t('enterQuestion')} 
                                    value={question} 
                                    onChange={e => setQuestion(e.target.value)}
                                    className="bg-background border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 h-20 resize-none"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">{t('options')}</label>
                                
                                <Droppable droppableId="AddCardModalDroppable" key="AddCardModalDroppable">
                                    {(provided: any) => (
                                        <div 
                                            {...provided.droppableProps} 
                                            ref={provided.innerRef} 
                                            className="space-y-2 max-h-48 overflow-y-auto pr-1"
                                        >
                                            {optionsSet.map((op, idx) => (
                                                <Draggable key={op.Id.toString()} draggableId={op.Id.toString()} index={idx}>
                                                    {(dragProvided: any) => (
                                                        <div 
                                                            ref={dragProvided.innerRef} 
                                                            {...dragProvided.draggableProps} 
                                                            {...dragProvided.dragHandleProps}
                                                            className="flex items-center justify-between bg-secondary border border-border rounded-lg p-2.5 gap-3"
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => handleDeleteOption(op.Id)}
                                                                    className="text-muted-foreground hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer shrink-0"
                                                                >
                                                                    <DeleteIcon className="text-lg" />
                                                                </button>
                                                                <span className="w-2 h-2 rounded-full bg-muted-foreground shrink-0" />
                                                                <p className="text-sm font-medium truncate m-0">{op.Option}</p>
                                                            </div>
                                                            <label className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors border select-none ${op.IsAnswer ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-background border-border text-muted-foreground'}`}>
                                                                <input 
                                                                    type="checkbox" 
                                                                    name="Correct" 
                                                                    value={op.Id.toString()} 
                                                                    checked={op.IsAnswer} 
                                                                    onChange={handleChangeCorrectOption}
                                                                    className="accent-green-500 h-3.5 w-3.5 rounded"
                                                                />
                                                                <span>{t('isCorrectAnswer')}</span>
                                                            </label>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                                {optionsSet.length < 10 && (
                                    <div className="flex gap-2 mt-2">
                                        <input 
                                            type="text" 
                                            value={newOption} 
                                            onChange={e => setNewOption(e.target.value)} 
                                            placeholder={t('enterOption')}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const mockFormEvent = { preventDefault: () => {} } as React.FormEvent;
                                                    handleAddOption(mockFormEvent);
                                                }
                                            }}
                                            className="flex-grow bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <button 
                                            type="button"
                                            onClick={(e) => handleAddOption(e as any)}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-lg px-4 py-2 transition-colors border-none cursor-pointer shrink-0"
                                        >
                                            {t('addCategory')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {errorMessage && (
                    <div className="px-6 py-2 bg-red-500/10 border-t border-b border-red-500/20 text-red-500 text-xs font-semibold">
                        {errorMessage}
                    </div>
                )}

                <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
                    <button 
                        onClick={handleClose} 
                        className="bg-secondary hover:bg-secondary/85 text-secondary-foreground font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer"
                    >
                        {t('cancel')}
                    </button>
                    <button 
                        onClick={handleAddCardSubmit} 
                        className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer shadow-md"
                    >
                        {t('addCard')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCardModal;
