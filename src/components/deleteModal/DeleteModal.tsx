import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCategory } from '../../store/actions/CardsActions';
import { setCurrentCategory as SetCurrentCategoryRedux } from '../../store/actions/UserActions';
import { RootState } from '../../store/store';
import { Category } from '../../store/types';
import { useApp } from '../../contexts/AppContext';

interface DeleteModalProps {
    ShowDelete: boolean;
    CloseDeleteModal: () => void;
    CategoryId: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ ShowDelete, CloseDeleteModal, CategoryId }) => {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.Cards);
    const user = useSelector((state: RootState) => state.User);
    const { t } = useApp();
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

    useEffect(() => {
        if (CategoryId) {
            const found = categories.find((c: Category) => c.Id.trim() === CategoryId);
            if (found) {
                setCurrentCategory(found);
            }
        }
    }, [CategoryId, categories]);

    if (!ShowDelete) return null;

    const handleClose = () => {
        CloseDeleteModal();
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!currentCategory) return;
        
        dispatch(deleteCategory(currentCategory));
        
        if (user.CurrentCategory === currentCategory.Name) {
            dispatch(SetCurrentCategoryRedux({ Name: 'No', Id: '' }));
        }
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-card border border-border text-foreground rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 text-center space-y-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-foreground">{t('deleteCategory')}</h3>
                        <p className="text-sm text-muted-foreground">{t('confirmDeleteCategory')}</p>
                    </div>
                    <div className="flex justify-center gap-3">
                        <button 
                            onClick={handleClose} 
                            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer"
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            onClick={handleDelete} 
                            className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg px-5 py-2.5 text-sm transition-colors border-none cursor-pointer shadow-md"
                        >
                            {t('delete')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
