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
    localStorage.setItem("FlashCardsCategories", JSON.stringify(store.getState().Cards))
    localStorage.setItem("FlashCardsUserInfo", JSON.stringify(store.getState().User))
    console.log("User", store.getState())    
})

export default store



