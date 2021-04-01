import * as api from '../api';
import { GET_QUIZ, GET_QUIZZES } from '../constants/actionTypes';
import Swal from 'sweetalert2';

export const getQuizzes = (groupId) => async (dispatch) => {
    const id = {groupId}

    try {
        const { data } = await api.getQuizzes(id)
        
        dispatch({type: GET_QUIZZES, payload:data})
    } catch (error) {
        console.log(error)
    }
}

export const getQuiz = (groupId, quizId) => async (dispatch) => {
    const quizData = {groupId, quizId}
    try {
        const { data } = await api.getQuiz(quizData);

        dispatch({ type: GET_QUIZ, payload:data})
    } catch (error) {
        console.log(error)
    }
}

export const createQuiz = (quizData, history) => async () => {
    try {
        await api.createQuiz(quizData);
        history.push(`/groups:${quizData.groupId}`)
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            //footer: '<a href>Why do I have this issue?</a>'
        });
    }
}

export const deleteQuiz = (userId, quizId, groupId, history) => async () => {
    const groupData = {userId, quizId, groupId}
    try {
        const check = await Swal.fire({
            title: 'Are you sure you want to delete this?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: `Delete`,
            confirmButtonColor: '#cf0404',
        })
        if (check.isConfirmed) {
            await api.deleteQuiz(groupData);
            Swal.fire('Deleted!', '', 'success')
            history.push(`/groups:${groupId}`);
        }else{
            Swal.fire('Cancelled!', '', 'error');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            //footer: '<a href>Why do I have this issue?</a>'
        });
    }
}

export const editquiz = (quizData, history) => async () => {
    try {
        await api.editQuiz(quizData);

        history.push(`/groups:${quizData.groupId}`)
    } catch (error) {
        console.log(error.response.data)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            //footer: '<a href>Why do I have this issue?</a>'
        });
    }
}

export const finishQuiz = (quizData, answers) => async () => {
    const data = {quizData, answers}
    try {
        await  api.finishQuiz(data);
    } catch (error) {
        console.log(error)
    }
}