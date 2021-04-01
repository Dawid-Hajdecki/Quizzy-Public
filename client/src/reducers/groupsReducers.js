import { GET_USER_GROUPS, CLEAR_GROUPS} from '../constants/actionTypes';

const groupsReducer = (groups = { groupData: [null] }, action) => {
    switch (action.type) {
        case GET_USER_GROUPS:
            return { groupData:action?.payload }
        case CLEAR_GROUPS:
            return { groupData: null };
        default:
            return groups;
    }

}

export default groupsReducer;