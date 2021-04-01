import { GET_QUIZZES, CLEAR_QUIZZES } from '../constants/actionTypes';

const quizReducer = (quizzes = { quizData: null}, action) => {
    switch (action.type) {
        case GET_QUIZZES:
            return { ...quizzes, quizData:action?.payload }
        case CLEAR_QUIZZES:
            return {...quizzes, quizData: null}
        default:
            return quizzes;
    }
}

export default quizReducer;