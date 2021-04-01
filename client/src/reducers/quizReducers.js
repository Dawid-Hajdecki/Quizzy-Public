import { GET_QUIZ} from '../constants/actionTypes';

const quizReducer = (quiz = { quizData: null}, action) => {
    switch (action.type) {
        case GET_QUIZ:
            return { ...quiz, quizData:action?.payload }
        default:
            return quiz;
    }
}

export default quizReducer;