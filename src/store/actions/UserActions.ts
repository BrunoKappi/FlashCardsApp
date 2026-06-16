import { UserState } from '../types';

export const clearUser = () => {
    return {
        type: 'CLEAR_USER' as const
    };
};

export const setFunction = (Function: 'No' | 'Trivia' | 'FlashCards') => {
    return {
        type: 'SET_FUNCTION' as const,
        Function
    };
};

export const resetFunction = () => {
    return {
        type: 'RESET_FUNCTION' as const
    };
};

export const setUser = (user: UserState) => {
    return {
        type: 'SET_USER' as const,
        user
    };
};

export const setPlaying = (Playing: boolean) => {
    return {
        type: 'SET_PLAYING' as const,
        Playing
    };
};

export const setCurrentCategory = (CurrentCategory: { Name: string; Id: string }) => {
    return {
        type: 'SET_CURRENT_CATEGORY' as const,
        CurrentCategory
    };
};

export type UserAction =
    | ReturnType<typeof clearUser>
    | ReturnType<typeof setFunction>
    | ReturnType<typeof resetFunction>
    | ReturnType<typeof setUser>
    | ReturnType<typeof setPlaying>
    | ReturnType<typeof setCurrentCategory>;
