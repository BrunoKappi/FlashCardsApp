
const UserDefault = {
    Name: '', 
    Email: '',
    Function: 'No'

}

const User = (state = UserDefault, action) => {
    switch (action.type) {
        case 'CLEAR_USER':
            return {
                Name: '',
                Email: '',
                Function: 'No'
            }
        case 'SET_FUNCTION':
            return {
                ...state,
                Function: action.Function
            }
        case 'RESET_FUNCTION':
            return {
                ...state,
                Function: 'No'
            }
        case 'SET_USER':
            return action.user
        default:
            return state
    }
}

export default User
