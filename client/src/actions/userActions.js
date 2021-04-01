import { GET_USER, GET_ALL_USERS, AUTH} from '../constants/actionTypes';
import * as api from '../api';
import Swal from 'sweetalert2';
import jwt from 'jsonwebtoken';
import { check } from 'express-validator';

export const getUser = () => async (dispatch) => {

    try {
        const { data } = await api.getUser();
        
        dispatch({ type: GET_USER, payload: data});
    } catch (error) {
        console.log(error);
    }
}

export const getAllUsers = () => async (dispatch) => {
    try {
        const { data } = await api.getAllUsers();
        dispatch({ type: GET_ALL_USERS, payload: data});
    } catch (error) {
        console.log(error);
    }
}

export const banUsers = (email, history) => async (dispatch) => {
    let user = { email }
    let banned;
    let check;
    try {
        const {data} = await api.checkIfBanned(user);
        console.log(data)
        banned = data[0].banned.isBanned;
        if(banned){
            check = await Swal.fire({
                title: 'Are you sure you want to unban this user?',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: `Unban`,
                confirmButtonColor: '#cf0404',
            })
        }else {
            check = await Swal.fire({
                title: 'Are you sure you want to ban this user?',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: `Ban`,
                confirmButtonColor: '#cf0404',
            })
        }
        
        if(check.isConfirmed){
            user = { email, banned }
            console.log(user)
            await api.changeBanStatus(user);
        }
    } catch (error) {
        console.log(error);
    }
}

export const login = (user, history) => async (dispatch) => {
    try {
        const { data } = await api.login(user);
        dispatch({ type: AUTH, payload:data});
        history.push('/');
        
        Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
          });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            //footer: '<a href>Why do I have this issue?</a>'
          });
    }
}

export const register = (user, history) => async (dispatch) => {
    try {
        const { data } = await api.register(user);

        dispatch({ type: AUTH, payload:data});
        history.push('/');
        Toast.fire({
            icon: 'success',
            title: 'Registered successfully'
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            //footer: '<a href>Why do I have this issue?</a>'
        });
    }
}

export const changeProfileData = (profileData, history) => async () => {
    try {
        const { value: password } = await Swal.fire({
            title: 'Enter your password',
            input: 'text',
            inputPlaceholder: 'Password',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            }
        })
        
        if (password) {
            profileData.password = password
            await api.changeProfileData(profileData);
            history.push(`/profile:${profileData.userId}`)
        }else{
            Swal.fire('Cancelled!', '', 'error');
        }
    } catch (error) {
        console.log(error)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            //footer: '<a href>Why do I have this issue?</a>'
        });
    }
}

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-right',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });