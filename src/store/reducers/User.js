
const UserDefault = {
    Name: '',
    Email: '',
    Function: 'No',
    CurrentTab: 'Home',
    CurrentCategory: 'No',
    CurrentCategoryId: '',
}

const User = (state = UserDefault, action) => {
    switch (action.type) {
        case 'CLEAR_USER':
            return {
                Name: '',
                Email: '',
                Function: 'No',
                CurrentTab: 'Home'
            }
        case 'SET_FUNCTION':
            return {
                ...state,
                Function: action.Function
            }
        case 'SET_CURRENT_CATEGORY':
            return {
                ...state,
                CurrentCategory: action.CurrentCategory.Name,
                CurrentCategoryId: action.CurrentCategory.Id,
                CurrentTab: 'Category'
            }
        case 'RESET_FUNCTION':
            return {
                ...state,
                Function: 'No',
                CurrentCategory: 'No',
                CurrentCategoryId: 'No',
                CurrentTab: 'Home'
            }
        case 'SET_USER':
            return action.user
        default:
            return state
    }
}

export default User
