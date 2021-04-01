import React, { useEffect }  from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { leaveGroup } from '../../../actions/groupActions';
import { deleteQuiz } from '../../../actions/quizActions';

import { getQuizzes } from '../../../actions/quizActions';

import TopNav from '../../navbar/TopNav'
import '../../../App.scss';
import './style.css';

const ViewGroup = (params) => {
    const dispatch = useDispatch();
    const history = useHistory();
    
    const user = useSelector((state) => state.user);
    const group = useSelector((state) => state.quizzes.quizData?.result)
    let hasGroup = false

    useEffect(() => {
        dispatch(getQuizzes(params.match.url.split("/")[1].substring(7)))
        checkUserGroups(user?.groups)
    },[user]);

    const leaveQuizHandler = () => {
        dispatch(leaveGroup(user?._id, group.name, history));
    }

    const deleteQuizHandler = (e) => {
        const id = e.target.value;
        dispatch(deleteQuiz(user?._id, id, group?._id, history))
    }

    const goBack = () => {
        history.push('/groups')
    }

    const checkUserGroups = (userGroups) => {
        if(user && group){
            userGroups.map((userGroup) => userGroup.name === group.name && (hasGroup = true))
            
            !hasGroup && history.push('/')
        }
    }

    !localStorage.getItem('profile') && history.push('/');

    return (
        <>
            <TopNav where={"Quizzes"}/>
            <div className="container mt-4">
                <div className="rounded bg-colour col-lg-8 col-md-12 col-sm-12 mx-auto p-4" align="center">
                    <div className="container">
                        <div className="row">
                            <div className="col-1">
                                <button className="mt-2 backBtn" onClick={goBack}>&#8249;</button>
                            </div>
                            <div className="col-6">
                                <h1>{group?.name}</h1>
                            </div>
                            <div className="col-5">
                            {user?.type === "Admin" && (
                                <button className="btn btn-primary mx-1 my-1 floatRight"onClick={leaveQuizHandler}>Leave Group</button>
                            )}
                            {(user?._id === group?.groupTeacher || user?.type === "Admin") ? (
                                <Link to={`/groups:${group?._id}/quiz/create`}>
                                    <button className="btn btn-primary mx-1 my-1 floatRight">Create Quiz</button>
                                </Link>
                            ) : (
                                <button className="btn btn-primary mx-1 my-1 floatRight"onClick={leaveQuizHandler}>Leave Group</button>
                            )}
                            </div>
                        </div>
                        <div className="overflow-500">
                            {!group?.quizzes ? "No Quizzes Found" : (
                                group?.quizzes.map((quiz, i) => {
                                    return(
                                        <div key={i} className="container border m-2 group-hover bg-info">
                                            <div className="row">
                                                <div className="col">
                                                    {quiz.questions.length >0 ? (
                                                        <Link className="colour-black" to={{
                                                            pathname:`/groups:${group?._id}/quiz:${quiz?._id}`
                                                        }}> 
                                                            <div className="card-body">
                                                                <h5 className="card-title">{quiz?.name}</h5>
                                                                <p className="card-text">{quiz?.category}</p>
                                                                <small>Tier:{quiz?.tier}</small>
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <div className="card-body">
                                                            <h5 className="card-title">{quiz?.name}</h5>
                                                            <p className="card-text">{quiz?.category}</p>
                                                            <small>Tier:{quiz?.tier}</small>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col">
                                                    <div className="card-body">
                                                        {(user?._id === group?.groupTeacher || user?.type === "Admin") && (
                                                            <>
                                                                <Link to={{
                                                                    pathname:`/groups:${group?._id}/quiz:${quiz?._id}/edit`,
                                                                    param1: quiz
                                                                }}>
                                                                    <button className="btn btn-primary m-1 floatRight">Edit Quiz</button>
                                                                </Link>
                                                                <button className="btn btn-primary m-1 floatRight" value={quiz?._id} onClick={deleteQuizHandler}>Delete Quiz</button>
                                                                <Link to={{
                                                                    pathname:`/groups:${group?._id}/quiz:${quiz?._id}/questions`,
                                                                    param1: quiz
                                                                }}>
                                                                    <button className="btn btn-primary m-1 floatRight">Questions</button>
                                                                </Link>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>  
        </>
        );
}

export default ViewGroup;