

export const clearUser = () => {
    return ({
        type: 'CLEAR_CARDS'
    })
}

export const setCards = (Cards) => {
    return ({
        type: 'SET_CARDS',
        Cards
    })
}

export const addCategory = (Category) => {    
    return ({
        type: 'ADD_CATEGORY',
        Category
    })
}

export const addCard = (Card) => {
    return ({
        type: 'ADD_CARD',
        Card
    })
}



