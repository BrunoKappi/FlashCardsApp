import { Category, Card } from '../types';

export const clearUser = () => {
    return {
        type: 'CLEAR_CARDS' as const
    };
};

export const setCards = (Cards: Category[]) => {
    return {
        type: 'SET_CARDS' as const,
        Cards
    };
};

export const addCategory = (Category: Category) => {
    return {
        type: 'ADD_CATEGORY' as const,
        Category
    };
};

export const editCategory = (Category: Category) => {
    return {
        type: 'EDIT_CATEGORY' as const,
        Category
    };
};

export const deleteCategory = (Category: Category) => {
    return {
        type: 'DELETE_CATEGORY' as const,
        Category
    };
};

export const addCard = (Card: Card) => {
    return {
        type: 'ADD_CARD' as const,
        Card
    };
};

export type CardsAction =
    | ReturnType<typeof clearUser>
    | ReturnType<typeof setCards>
    | ReturnType<typeof addCategory>
    | ReturnType<typeof editCategory>
    | ReturnType<typeof deleteCategory>
    | ReturnType<typeof addCard>;
