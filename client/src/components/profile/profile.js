import React, { useEffect, useState }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from "react-helmet";
import Moment from 'moment';

import { getUser, getAllUsers, banUsers, changeProfileData } from '../../actions/userActions';

import TopNav from '../navbar/TopNav'
import '../../App.scss';
import './style.css';

const Profile = (params) => {
    const dispatch = useDispatch();
    const history = useHistory();
 
    const userId = params.match.params.id.substring(1);
    const user = useSelector((state) => state.user)
    const users = useSelector((state) => state.users)
    const [profileName, setProfileName] = useState({userId, name: '', password: '', type: 'name'});
    const [profileEmail, setProfileEmail] = useState({userId, email: '', password: '', type: 'email'});
    const [profilePassword, setProfilePassword] = useState({userId, oldPassword: '', password: '', type: 'password'});

    useEffect(() => {
        dispatch(getUser);
        if(user?.type === "Admin"){
            dispatch(getAllUsers());
        }
    }, [user])

    const handleNameChange = (e) => {
        setProfileName({...profileName, [e.target.name]: e.target.value});

    }

    const handleEmailChange = (e) => {
        setProfileEmail({...profileEmail, [e.target.name]: e.target.value});

    }

    const handlePasswordChange = (e) => {
        setProfilePassword({...profilePassword, [e.target.name]: e.target.value});

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.id)
        switch(e.target.id){
            case "name": 
                dispatch(changeProfileData(profileName, history))
                return
            case "email": 
                dispatch(changeProfileData(profileEmail, history))
                return
            case "password": 
                dispatch(changeProfileData(profilePassword, history))
                return
            default: console.log("hey4")
        }
    }
    
    const goBack = () => {
        history.push('/')
    }

    const banUser = async (e) => {
        await dispatch(banUsers(e.target.value, history))
        history.push(`/profile:${user?._id}`)
    }

    return (
        <>
            <Helmet>
                <title>Quizzy - Profile</title>
            </Helmet>
            <TopNav where={"Profile"}/>
            <div className="container mt-4">
                <div className="rounded bg-colour col-sm-8 mx-auto px-4 pb-4 pt-2" align="center">
                    <div className="container">
                        <div className="row">
                            <button className="mt-3 backBtn" onClick={goBack}>&#8249;</button>
                            <div className="col mt-3">
                                <h3>Profile</h3>
                                <hr/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-5 mt-1">
                                <div className="row">Name: {user?.name}<br/></div>
                            </div>
                            <div className="col-7 mt-1">
                                <form noValidate className="form list-group list-group list-group-flush" id="name" onSubmit={handleSubmit}>
                                    <input type="text" name="name" className="form-control" placeholder="New Name" onChange={handleNameChange}/>
                                    <button type="submit" className="btn btn-primary m-1 floatRight">Change name</button>
                                </form>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-5 mt-1">
                                <div className="row">Email: {user?.email}<br/></div>
                            </div>
                            <div className="col-7 mt-1">
                                <form noValidate className="form list-group list-group list-group-flush" id="email" onSubmit={handleSubmit}>
                                    <input type="text" name="email" className="form-control" placeholder="New Email" onChange={handleEmailChange}/>
                                    <button type="submit" className="btn btn-primary m-1 floatRight">Change Email</button>
                                </form>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-5 mt-1">
                                <div className="row">Creation Date: {Moment(user?.creationDate?.substring(0,10)).format('D MMM yy')}<br/></div>
                                <div className="row">Score: {user?.score}<br/></div>
                            </div>
                            <div className="col-7 mt-1">
                                <form noValidate className="form list-group list-group list-group-flush" id="password" onSubmit={handleSubmit}>
                                    <input type="text" name="oldPassword" className="form-control" placeholder="New Password" onChange={handlePasswordChange}/>
                                    <button type="submit" className="btn btn-primary m-1 floatRight">Change Password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
            {(users.usersData !== null && user?.type === "Admin") &&
            <div className="container mt-4">
                {console.log(users)}
                <div className="rounded bg-colour col-lg-8 col-sm-12 mx-auto p-4 min-height-200" align="center">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2>Users</h2>
                            </div>
                        </div>
                        <div className="overflow-100 height-auto">
                            <div className="row">
                                {users.map((oneUser, i) => {
                                    return(
                                        <>
                                            <button value={oneUser.email} key={i} className={oneUser.banned.isBanned ? "modal-body m-1 rounded bannedUser" : "modal-body m-1 rounded "} onClick={banUser}>
                                                {oneUser.email}
                                            </button>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );
}

export default Profile;