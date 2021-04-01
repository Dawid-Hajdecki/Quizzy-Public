import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { getQuizzes } from '../../../actions/quizActions';

import TopNav from '../../navbar/TopNav'
import '../../../App.scss';
import './style.scss';

const UserAttempted = (params) =>{
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const Attempted = params.location.param1;
    const groupId = params.match.url.split("/")[1].substring(7);
    const quizId = params.match.url.split("/")[2].substring(5) ;
    const user = useSelector((state) => state.user);
    const group = useSelector((state) => state.quizzes.quizData?.result)
    let hasGroup = false;
    let isLeader = false;
    
    useEffect(() => {
        dispatch(getQuizzes(params.match.url.split("/")[1].substring(7)));
        checkUserGroups();
    },[location]);
    
    const checkUserGroups = () => {
        if(user && group){
            user.groups.map((userGroup) => userGroup.name === group.name && (hasGroup = true))
            if((user._id === group.groupTeacher) || user.type === "Admin") isLeader = true

            !hasGroup || !isLeader && history.push('/')
        }
    }

    const goBack = () => {
        history.push(`/groups:${groupId}/quiz:${quizId}/questions`)
    }

    !Attempted && history.push(`/groups:${groupId}/quiz:${quizId}/questions`);
    !localStorage.getItem('profile') && history.push('/');
    return (
        <>
            <TopNav where={"Questions"}/>
            <div className="container mt-4">
                <div className="rounded bg-colour col-lg-8 col-sm-12 mx-auto p-4" align="center">
                    <div className="container">
                        <div className="row">
                            <div className="col-1">
                                <button className="mt-2 backBtn" onClick={goBack}>&#8249;</button>
                            </div>
                            <div className="col-10">
                                <h2>{Attempted?.userEmail}</h2>
                            </div>  
                            <div className="col-12 mb-1">
                                <p id="Answer">Correct Answers: {Attempted?.correctAnswers}</p>
                                <p id="Answer">Wrong Answers: {Attempted?.wrongAnswers}</p>
                            </div>
                        </div>
                        <div className="overflow-500 height-auto">
                            {Attempted?.answers.map((answer, i) => {
                                return(
                                    <>
                                        <div key={i} className="modal-body mb-1 rounded">
                                            <strong>Title: {answer?.questionTitle}</strong><br/>
                                            Correct Answer: {answer?.correctAnswer} .
                                            Users Answer: {answer?.usersAnswer}
                                            <br/>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserAttempted;