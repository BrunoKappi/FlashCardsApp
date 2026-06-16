import { combineReducers, createStore } from 'redux';
import User from './reducers/User';
import Cards from './reducers/Cards';

const rootReducer = combineReducers({
    User,
    Cards
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

store.subscribe(() => {
    localStorage.setItem("FlashCardsCategories", JSON.stringify(store.getState().Cards));
    localStorage.setItem("FlashCardsUserInfo", JSON.stringify(store.getState().User));
    console.log("User", store.getState());
});

export default store;
export type AppDispatch = typeof store.dispatch;
