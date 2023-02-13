
const CardsDefault = []


const Cards = (state = CardsDefault, action) => {
    switch (action.type) {
        case 'CLEAR_CARDS':
            return CardsDefault
        case 'ADD_CATEGORY':
            return state.concat(action.Category)
        case 'SET_CARDS':
            return action.Cards
        default:
            return state
    }
}

export default Cards
