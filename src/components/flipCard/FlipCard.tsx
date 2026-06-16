import React, { useState } from 'react';
import { MdModeEditOutline as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md';
import { v4 as uuid_v4 } from 'uuid'; 
import EditCardModal from '../editCardModal/EditCardModal';
import DeleteCardModal from '../deleteCardModal/DeleteCardModal';
import { Card } from '../../store/types';

interface FlipCardProps {
    Card: Card;
    CategoryId: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ Card, CategoryId }) => {

    const [flip, setFlip] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const [showEditCardModal, setShowEditCardModal] = useState(false);    
    const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);  

    return (
        <div className="flex flex-col group">
            <EditCardModal Card={Card} ShowEditCardModal={showEditCardModal} CloseEditCardModal={() => setShowEditCardModal(false)} CategoryId={CategoryId} />
            <DeleteCardModal Card={Card} ShowDelete={showDeleteCardModal} CloseDeleteModal={() => setShowDeleteCardModal(false)} CategoryId={CategoryId} />

            <div 
                className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer select-none min-h-[160px]"
                onClick={() => setFlip(!flip)} 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ 
                    transformStyle: 'preserve-3d',
                    transform: `perspective(1000px) rotateY(${flip ? 180 : 0}deg) translateY(${isHovered ? -4 : 0}px)`,
                    boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)'
                }}
            >
                <div 
                    className="w-full min-h-[160px] p-6 flex flex-col justify-between text-slate-900 dark:text-slate-100 rounded-2xl relative" 
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    <div className="text-base font-bold text-center flex-grow flex items-center justify-center mb-4">
                        {Card.Question}
                    </div>
                    {Card.Options && Card.Options.length > 0 && (
                        <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                            {Card.Options.map(Option => (
                                <p key={uuid_v4()} className="text-xs m-0 flex flex-row items-center justify-start gap-2 text-slate-500 dark:text-slate-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="truncate">{Option.Option}</span>
                                </p>
                            ))}
                        </div>
                    )}
                </div>
                <div 
                    className="absolute inset-0 p-6 flex items-center justify-center text-white font-bold text-lg text-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl" 
                    style={{ 
                        backfaceVisibility: 'hidden', 
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    {Card.Answer.Option}
                </div>
            </div>
            
            <div className="flex flex-row justify-end items-center mt-2 gap-2">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowEditCardModal(true);
                    }}
                    className="p-2 text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                    <EditIcon className="text-base" />
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteCardModal(true);
                    }}
                    className="p-2 text-muted-foreground hover:text-red-500 bg-secondary hover:bg-secondary/80 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                    <DeleteIcon className="text-base" />
                </button>
            </div>
        </div>
    );
};

export default FlipCard;
