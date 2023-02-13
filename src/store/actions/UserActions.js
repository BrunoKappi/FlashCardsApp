

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
        type: 'SET_User',
        user
    })
}


