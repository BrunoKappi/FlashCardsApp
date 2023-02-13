import { combineReducers, createStore } from 'redux'
import User from './reducers/User'
import Cards from './reducers/Cards'

const store = createStore(
    combineReducers({
        User, Cards
    }),

    //A linha abaixo é para habilitar o Rexux Store Extension
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(() => {
    localStorage.setItem("FlashCardsApp", JSON.stringify(store.getState()))
    console.log("Changed", store.getState())
})

export default store



