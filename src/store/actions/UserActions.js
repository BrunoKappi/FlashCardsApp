

export const clearUser = () => {
    return ({
        type: 'CLEAR_USER'
    })
}

export const setFunction = (Function) => {
    return ({
        type: 'SET_FUNCTION',
        Function
    })
}

export const resetFunction = () => {
    return ({
        type: 'RESET_FUNCTION'
    })
}

export const setUser = (user) => {
    return ({
        type: 'SET_USER',
        user
    })
}

export const setPlaying = (Playing) => {
    return ({
        type: 'SET_PLAYING',
        Playing
    })
}

export const setCurrentCategory = (CurrentCategory) => {
    return ({
        type: 'SET_CURRENT_CATEGORY',
        CurrentCategory
    })
}


