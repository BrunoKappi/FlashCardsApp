import React, { useState, useEffect } from 'react';
import { DefaultCard } from '../../Default/DefaultObjects';
import { v4 as uuid_v4 } from 'uuid';
import { MdClear as ClearIcon, MdCheck as CheckIcon, MdNavigateNext as NextIcon } from 'react-icons/md';
import { RiCheckboxBlankCircleFill as BlankCircleIcon } from 'react-icons/ri';
import { FaCheckCircle as CheckCircleIcon } from 'react-icons/fa';
import { Card, Option } from '../../services/db';
import { useApp } from '../../contexts/AppContext';

interface FlipCardProps {
    CardToPlay?: Partial<Card>;
    StopPlaying: () => void;
    ToNextCard: () => void;
    Automatic: boolean;
    Jogada: (hit: string) => void;
}

const FlipCard: React.FC<FlipCardProps> = ({ 
    CardToPlay = {}, 
    ToNextCard, 
    Automatic, 
    Jogada 
}) => {
    const { t } = useApp();
    const [card, setCard] = useState<Card>({ ...DefaultCard });
    const [optionsSet, setOptionsSet] = useState<Option[]>([]);
    const [textAnswer, setTextAnswer] = useState('');
    const [correctIndex, setCorrectIndex] = useState(-1);
    const [played, setPlayed] = useState(false);
    const [round, setRound] = useState<'No' | 'Right' | 'Wrong'>('No');
    const [filled, setFilled] = useState(false);
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        if (CardToPlay && Object.keys(CardToPlay).length > 0) {
            setCard({ ...DefaultCard, ...CardToPlay } as Card);
            const ops = CardToPlay.Options ? CardToPlay.Options.map(o => ({ ...o, IsAnswer: false })) : [];
            setOptionsSet(ops);
            setRound('No');
            setPlayed(false);
            setTextAnswer('');
            setCorrectIndex(-1);
            setFlip(false);
        }
    }, [CardToPlay]);

    useEffect(() => {
        if (card.Type === 'Text' && textAnswer.trim()) {
            setFilled(true);
        } else if (card.Type === 'MultipleChoice' && correctIndex !== -1) {
            setFilled(true);
        } else {
            setFilled(false);
        }
    }, [textAnswer, correctIndex, card.Type]);

    const handleChangeCorrectOption = (optionId: number | string) => {
        if (played) return;
        const optionIndex = optionsSet.findIndex(op => op.Id === optionId);
        const newOptions = optionsSet.map((op, idx) => ({
            ...op,
            IsAnswer: idx === optionIndex
        }));
        setCorrectIndex(optionIndex);
        setOptionsSet(newOptions);
    };

    const FlipTheCard = () => {
        if (!Automatic) {
            setFlip(!flip);
        } else if (Automatic && played) {
            setFlip(!flip);
        }
    };

    const handleCheckQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        if (played) return;

        if (card.Type === 'Text') {
            if (textAnswer.trim().toLowerCase() === card.Answer.Option.trim().toLowerCase()) {
                setPlayed(true);
                setRound('Right');
                Jogada('Certo');
            } else {
                setPlayed(true);
                setRound('Wrong');
                Jogada('Errado');
            }
        } else {
            if (correctIndex !== -1) {
                if (optionsSet[correctIndex].Option.trim().toLowerCase() === card.Answer.Option.trim().toLowerCase()) {
                    setPlayed(true);
                    setRound('Right');
                    Jogada('Certo');
                } else {
                    setPlayed(true);
                    setRound('Wrong');
                    Jogada('Errado');
                }
            }
        }
        setFlip(true);
    };

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center space-y-6">
            {played && (
                <span className="bg-secondary text-secondary-foreground font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full border border-border shadow-sm">
                    {flip ? t('answer') : t('question')}
                </span>
            )}
            
            <div 
                className="w-full relative rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md cursor-pointer transition-all duration-300 bg-white dark:bg-slate-900 select-none min-h-[190px]"
                onClick={FlipTheCard} 
                style={{ 
                    transformStyle: 'preserve-3d',
                    transform: `perspective(1000px) rotateY(${flip ? 180 : 0}deg)`,
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                {/* Visual correct/wrong overlays */}
                {round === 'Right' && (
                    <div className={`absolute top-4 right-4 z-30 flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-base shadow-md ${flip ? '[transform:rotateY(180deg)]' : ''}`}>
                        <CheckIcon />
                    </div>
                )}
                {round === 'Wrong' && (
                    <div className={`absolute top-4 right-4 z-30 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white text-base shadow-md ${flip ? '[transform:rotateY(180deg)]' : ''}`}>
                        <ClearIcon />
                    </div>
                )}

                <div 
                    className="w-full min-h-[190px] p-8 flex flex-col justify-center items-center text-slate-900 dark:text-slate-100 rounded-3xl relative" 
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    <p className="text-lg font-bold text-center leading-relaxed">
                        {card.Question}
                    </p>
                    {Automatic && !played && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-4 uppercase font-bold tracking-wider">
                            {t('selectAnswer')}
                        </span>
                    )}
                    {played && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-4 uppercase font-bold tracking-wider">
                            {t('flipCardTip')}
                        </span>
                    )}
                </div>
                
                <div 
                    className="absolute inset-0 p-8 flex items-center justify-center text-white font-bold text-xl text-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl" 
                    style={{ 
                        backfaceVisibility: 'hidden', 
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    {card.Answer?.Option}
                </div>
            </div>

            {card.Type === 'MultipleChoice' && (
                <form className="w-full space-y-3" onSubmit={handleCheckQuestion}>
                    {optionsSet.map(op => {
                        const isSelected = op.IsAnswer;
                        const isCorrect = op.Option.trim().toLowerCase() === card.Answer?.Option.trim().toLowerCase();
                        
                        let cardStyle = "bg-card border-border text-foreground hover:bg-secondary/80";
                        if (played) {
                            if (isCorrect) {
                                cardStyle = "bg-green-500/15 border-green-500 text-green-600 dark:text-green-400";
                            } else if (isSelected && !isCorrect) {
                                cardStyle = "bg-red-500/15 border-red-500 text-red-600 dark:text-red-400";
                            } else {
                                cardStyle = "bg-card/45 border-border/40 text-muted-foreground/60";
                            }
                        } else if (isSelected) {
                            cardStyle = "bg-primary/10 border-primary text-primary";
                        }

                        return (
                            <div 
                                key={uuid_v4()} 
                                className={`flex items-center gap-3 p-4 rounded-xl border font-semibold cursor-pointer transition-all duration-200 ${cardStyle}`}
                                onClick={() => handleChangeCorrectOption(op.Id)}
                            >
                                <span className="shrink-0 text-base">
                                    {isSelected ? <CheckCircleIcon className="text-primary" /> : <BlankCircleIcon className="text-muted/60" />}
                                </span>
                                <p className="m-0 text-sm">{op.Option}</p>
                            </div>
                        );
                    })}

                    <div className="flex flex-row justify-center items-center gap-4 pt-4">
                        {!played && (
                            <button 
                                type="submit"
                                disabled={!filled}
                                className="w-full bg-primary hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-bold rounded-lg py-3 px-8 transition-all duration-200 cursor-pointer shadow disabled:cursor-not-allowed border-none text-sm"
                            >
                                Check
                            </button>
                        )}
                        {played && (
                            <button 
                                type="button"
                                onClick={ToNextCard}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg py-3 px-8 transition-colors flex items-center justify-center gap-1.5 border-none cursor-pointer shadow text-sm"
                            >
                                Next <NextIcon className="text-xl" />
                            </button>
                        )}
                    </div>
                </form>
            )}

            {card.Type === 'Text' && (
                <form className="w-full space-y-4" onSubmit={handleCheckQuestion}>
                    {!played ? (
                        <textarea 
                            placeholder="Type your answer here..." 
                            value={textAnswer} 
                            onChange={e => setTextAnswer(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl p-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 h-28 resize-none shadow-sm text-sm"
                        />
                    ) : (
                        <div className={`p-4 rounded-xl border ${round === 'Right' ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'}`}>
                            <p className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Your Answer:</p>
                            <p className="font-semibold text-sm mb-3">{textAnswer}</p>
                            <p className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70 text-muted-foreground">Correct Answer:</p>
                            <p className="font-bold text-sm text-foreground">{card.Answer?.Option}</p>
                        </div>
                    )}
                    
                    <div className="flex flex-row justify-center items-center gap-4">
                        {!played && (
                            <button 
                                type="submit"
                                disabled={!filled}
                                className="w-full bg-primary hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-bold rounded-lg py-3 px-8 transition-all duration-200 cursor-pointer shadow disabled:cursor-not-allowed border-none text-sm"
                            >
                                Check
                            </button>
                        )}
                        {played && (
                            <button 
                                type="button"
                                onClick={ToNextCard}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg py-3 px-8 transition-colors flex items-center justify-center gap-1.5 border-none cursor-pointer shadow text-sm"
                            >
                                Next <NextIcon className="text-xl" />
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default FlipCard;
