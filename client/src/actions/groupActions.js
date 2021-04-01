import * as api from '../api';
import { GET_ALL_GROUPS, GET_USER_GROUPS, CLEAR_QUIZZES } from '../constants/actionTypes';
import Swal from 'sweetalert2';

export const getAllGroups = () => async (dispatch) => {
    const { data } = await api.getAllGroups();
    dispatch({ type: GET_ALL_GROUPS, payload: data})
}
export const getUserGroups = (group) => async (dispatch) => {
    if(!group?.length) dispatch({ type: GET_USER_GROUPS, payload: null})

    const { data } = await api.getUserGroups(group);
    dispatch({ type: GET_USER_GROUPS, payload: data})
}

export const joinGroup = (history) => async () => {
    try {
        const formValue = {name: '', password: '' }
        await Swal.fire({
            title: 'Join Group',
            showCloseButton: true,
            confirmButtonText: 'Join!',
            html:
                '<input id="swal-input1" placeholder="name" class="swal2-input">' +
                '<input id="swal-input2" placeholder="password" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    formValue.name = document.getElementById('swal-input1').value,
                    formValue.password = document.getElementById('swal-input2').value
                ]
            }
        }) 
        if(formValue.name) {
            await api.joinGroup(formValue);

            history.push('/groups');
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
export const adminJoinGroup = (groupName, history) => async () => {
    try {
        const adminGroup = {groupName}
        const check = await Swal.fire({
            title: groupName,
            text: 'Do you want to join this group?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: `Join`,
            confirmButtonColor: '#3085d6',
        })
        if (check.isConfirmed) {
            await api.adminJoinGroup(adminGroup);
            history.push('/groups');
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

export const createGroup = (group, history) => async () =>{
    try {
        await api.createGroup(group);
        await api.joinGroup(group);

        history.push('/groups');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            //footer: '<a href>Why do I have this issue?</a>'
          });
    }
}

export const editGroup = (group, history) => async () => {
    try {
        await api.editGroup(group);
        
        history.push('/groups');
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

export const deleteGroup = (userId, groupId, history) => async () => {
    const groupData = {userId, groupId}
    try {
        const check = await Swal.fire({
            title: 'Are you sure you want to delete this?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: `Delete`,
            confirmButtonColor: '#cf0404',
        })
        if (check.isConfirmed) {
            await api.deleteGroup(groupData);
            Swal.fire('Deleted!', '', 'success')
            history.push('/groups');
        }else{
            Swal.fire('Cancelled!', '', 'error');
        }
    } catch (error) {
        console.log("hey")
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            //footer: '<a href>Why do I have this issue?</a>'
          });
    }
}

export const leaveGroup = (userId, groupName, history) => async (dispatch) => {
    const formValue = { userId, groupName }

    const check = await Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'I want to leave this group.'
    })
    if (check.isConfirmed) {
        try {
            await api.leaveGroup(formValue);
            Swal.fire(
                'Left!',
                'You left this group.',
                'success'
            )
            dispatch({type: CLEAR_QUIZZES })
            history.push('/groups')
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
                //footer: '<a href>Why do I have this issue?</a>'
            });
        }
    }
}