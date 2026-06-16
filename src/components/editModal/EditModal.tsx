import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useApp } from '../../contexts/AppContext';

interface EditModalProps {
    ShowEdit: boolean;
    CloseEditModal: () => void;
    CategoryId: string;
}

const EditModal: React.FC<EditModalProps> = ({ ShowEdit, CloseEditModal, CategoryId }) => {
    const { decks, editDeck } = useStore();
    const { t } = useApp();

    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        if (CategoryId) {
            const found = decks.find((c) => c.Id === CategoryId);
            if (found) {
                setCategoryName(found.Name);
            }
        }
    }, [CategoryId, decks]);

    if (!ShowEdit) return null;

    const handleClose = () => {
        CloseEditModal();
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        await editDeck(CategoryId, categoryName.trim());
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-card border border-border text-foreground rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/40">
                    <h3 className="text-lg font-bold font-sans">{t('editCategory')}</h3>
                    <button 
                        onClick={handleClose} 
                        className="text-muted-foreground hover:text-foreground transition-colors text-2xl font-bold border-none bg-transparent cursor-pointer"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('categoryName')}</label>
                        <input 
                            type="text" 
                            placeholder={t('enterCategoryName')}
                            value={categoryName} 
                            onChange={e => setCategoryName(e.target.value)}
                            className="bg-background border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={handleClose} 
                            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer"
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            type="submit" 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer shadow-md"
                        >
                            {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
