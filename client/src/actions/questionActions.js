 import * as api from '../api';
import Swal from 'sweetalert2';

export const deleteQuestion = (userId, groupId, quizId, questionId, history) => async () => {
    const groupData = {userId, groupId, quizId, questionId}
    try {
        const check = await Swal.fire({
            title: 'Are you sure you want to delete this?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: `Delete`,
            confirmButtonColor: '#cf0404',
        })
        if (check.isConfirmed) {
            await api.deleteQuestion(groupData);
            Swal.fire('Deleted!', '', 'success');
            history.push(`/groups:${groupId}/quiz:${quizId}/questions`)
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
export const createQuestion = (questionData, history) => async () => {
    console.log(questionData)
    try {
        await api.createQuestion(questionData);
        history.push(`/groups:${questionData?.groupId}/quiz:${questionData?.quizId}/questions`)
    } catch (error) {
        console.log(error.response)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            //footer: '<a href>Why do I have this issue?</a>'
        });
    }
} 