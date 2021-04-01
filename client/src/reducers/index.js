import  { combineReducers } from 'redux';

import user from './userReducers';
import users from './usersReducers';
import groups from './groupsReducers';
import allGroups from './allGroupsReducers';
import quiz from './quizReducers';
import quizzes from './quizzesReducers';
/* import questions from './questionsReducers'; */
export default combineReducers({
    user,
    users,
    groups,
    allGroups,
    quiz,
    quizzes,
    /* questions, */
});