import { GET_ALL_GROUPS} from '../constants/actionTypes';

const groupsReducer = (allGroups = { groupData: [null] }, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS:
            return { groupData:action?.payload }
        default:
            return allGroups;
    }

}

export default groupsReducer;