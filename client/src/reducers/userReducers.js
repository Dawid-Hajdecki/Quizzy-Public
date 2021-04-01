import { GET_USER, AUTH, LOGOUT} from '../constants/actionTypes';

const userReducer = (user = { authData: null}, action) => {
    switch (action.type) {
        case GET_USER:
            return action.payload;
        case AUTH:
            const token = action?.payload.token
            localStorage.setItem('profile', JSON.stringify({ token }));

            return {...user, authData: action?.payload};
        case LOGOUT:
            localStorage.clear();
            return {...user, authData: null};
        default:
            return user;
    }
}

export default userReducer;