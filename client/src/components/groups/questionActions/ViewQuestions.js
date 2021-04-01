import React, { useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { getQuiz, getQuizzes } from '../../../actions/quizActions';
import { deleteQuestion } from '../../../actions/questionActions';

import TopNav from '../../navbar/TopNav'
import '../../../App.scss';
import './style.scss';

const ViewQuestions = (params) =>{
    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector((state) => state.user);
    const group = useSelector((state) => state.quizzes.quizData?.result)
    const quiz = useSelector((state) => state.quiz.quizData?.result?.quizzes[0]);
    const usersAttempted = quiz?.usersAttempted;
    const groupId = params.match.url.split("/")[1].substring(7);
    const quizId = params.match.url.split("/")[2].substring(5) ;
    let hasGroup = false;
    let isLeader = false;

    useEffect(() => {
        dispatch(getQuizzes(params.match.url.split("/")[1].substring(7)))
        dispatch(getQuiz(groupId, quizId));
        checkUserGroups()
    },[user]);

    const deleteQuestionHandler = (e) => {
        const questionId = e.target.value;
        dispatch(deleteQuestion(user?._id, groupId, quizId, questionId, history))
    }

    const goBack = () => {
        history.push(`/groups:${groupId}`)
    }

    const checkUserGroups = () => {
        console.log(user)
        if(user && group){
            user.groups.map((userGroup) => userGroup.name === group.name && (hasGroup = true))
            if((user._id === group.groupTeacher) || user.type === "Admin") isLeader = true
            
            !hasGroup || !isLeader && history.push('/')
        }
    }

    let modal = document.getElementById("myModal");
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }
    
    const modalOpenHandler = (e) => {
        if(modal){
            modal.style.display = "block";
        }
    }

    const modalCloseHandler = () => {
        if(modal){
            modal.style.display = "none";
        }
    }

    !localStorage.getItem('profile') && history.push('/');

    return (
        <>
            <TopNav where={"Questions"}/>
            <div className="container mt-4">
                <div className="rounded bg-colour col-lg-8 col-sm-12 mx-auto p-4 max-height-400" align="center">
                    <div className="container">
                        <div className="row">
                            <div className="col-1">
                                <button className="mt-2 backBtn" onClick={goBack}>&#8249;</button>
                            </div>
                            <div className="col-10">
                                <h2>{quiz?.name}</h2>
                            </div>  
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <Link to={`/groups:${groupId}/quiz:${quizId}/questions/create`}>
                                    <button className="btn btn-primary m-1 floatRight">Create Question</button>
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-250 height-auto">
                            {quiz?.questions ? (
                                quiz?.questions.map((question, i) => {
                                    return (
                                        <div key={i} className="card group-hover bg-info mb-1">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="card-body">
                                                        <div className="floatLeft">{question?.title}</div>
                                                        <button className="btn btn-primary m-1 floatRight" value={question?._id} onClick={deleteQuestionHandler}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <h4>No questions found...</h4>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-4">
                <div className="rounded bg-colour col-lg-8 col-sm-12 mx-auto p-4 min-height-200" align="center">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2>Users Attempted</h2>
                            </div>
                        </div>
                        <div className="overflow-100 height-auto">
                            <div className="row">
                            {usersAttempted?.map((userAttempted, i) => {
                                return(
                                    <>
                                        
                                        <div className="ml-4 col-5 m-1 rounded">
                                            <Link className="button" to={{
                                                pathname:`/groups:${group?._id}/quiz:${quiz?._id}/question/user:${userAttempted?.userEmail}`,
                                                param1: userAttempted
                                            }}>
                                                {userAttempted?.userEmail}
                                            </Link>
                                        </div>
                                        
                                    </>
                                )
                            })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewQuestions;