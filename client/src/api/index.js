import axios from 'axios';

const API = axios.create({baseURL: 'https://afternoon-mesa-24850.herokuapp.com:5000'})

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
  
    return req;
});

export const getUser = () => API.get('/user/');
export const getAllUsers = () => API.get('/user/all');
export const login = (userData) => API.post('/user/login', userData); 
export const register = (userData) => API.post('/user/register', userData); 
export const changeProfileData = (profileData) => API.put('/user', profileData);
export const checkIfBanned = (user) => API.post('/user/ban/check', user);
export const changeBanStatus = (userEmail) => API.post('/user/ban/changeStatus', userEmail);

export const getAllGroups = () => API.get('/group/');
export const getUserGroups = (group) => API.post('/group/getUserGroups', group);
export const createGroup = (groupData) => API.post('/group', groupData); 
export const editGroup = (groupData) => API.put('/group', groupData); 
export const deleteGroup = (groupData) => API.delete('/group', { data: {groupData} });
export const joinGroup = (groupData) => API.post('/group/joinGroup', groupData);
export const adminJoinGroup = (adminGroup) => API.post('/group/joinGroup/admin', adminGroup);
export const leaveGroup = (data) => API.post('/group/leaveGroup', data);

export const getQuiz = (quizData) => API.post('/group/quiz/get', quizData);
export const getQuizzes = (id) => API.post('/group/quiz/getAll', id);
export const createQuiz = (data) => API.put('/group/quiz', data);
export const editQuiz = (quizData) => API.post('/group/quiz', quizData);
export const deleteQuiz = (groupData) => API.delete('/group/quiz', { data: {groupData} });
export const finishQuiz = (quizData) => API.post('/group/quiz/finished', quizData);

export const createQuestion = (questionData) => API.put('/group/quiz/question', questionData);
export const deleteQuestion = (groupData) => API.delete('/group/quiz/question', { data: {groupData} });