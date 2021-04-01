import React, { useState, useEffect }  from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

import { finishQuiz, getQuiz, getQuizzes } from '../../../actions/quizActions';

import TopNav from '../../navbar/TopNav'
import '../../../App.scss';
import './style.scss';

const ViewQuiz = (params) =>{
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const user = useSelector((state) => state.user);
    const quiz = useSelector((state) => state.quiz.quizData?.result?.quizzes[0]);
    const group = useSelector((state) => state.quizzes.quizData?.result);
    const groupId = params.match.url.split("/")[1].substring(7);
    const quizId = params.match.url.split("/")[2].substring(5) ;
    let hasGroup = false;

    let questions = {answer1: '', answer2: '', answer3: '', answer4: '', correctAnswer: '', question: '', title: '', _id: ''}
    quiz?.questions && (questions = quiz?.questions)

    useEffect(() => {
        dispatch(getQuizzes(params.match.url.split("/")[1].substring(7)));
        dispatch(getQuiz(groupId, quizId));
        checkUserGroups(user?.groups);
    },[location]);

    const initialData = {
        groupId,
        quizId,
        userId: user?._id,
        userEmail: user?.email,
        questionIndex: 0,
        questionsCorrect:0,
        questionsWrong:0,
        quizFinished: false
    };
    const [quizData, setQuizData] = useState(initialData);
    const [answers, setAnswers] = useState([]);

    const handleButtonClick = (e) => {
        handleAdd(questions[quizData?.questionIndex]?.title, questions[quizData?.questionIndex]?.correctAnswer, e.target.name)
        
        if(e.target.name === questions[quizData?.questionIndex]?.correctAnswer) {
            correctAnswer();
        }else{
            wrongAnswer();
        }
    }

    const handleAdd = (questionTitle, correctAnswer, usersAnswer) => {
        const newAnswers = answers.slice();
        newAnswers.push({questionTitle, correctAnswer, usersAnswer})
        setAnswers(newAnswers) 
    }

    const correctAnswer = () => {
        setQuizData({
            ...quizData, 
            questionsCorrect: quizData?.questionsCorrect+1 ,
            questionIndex: quizData?.questionIndex+1
        });
    }

    const wrongAnswer = () => {
        setQuizData({
            ...quizData, 
            questionsWrong: quizData?.questionsWrong+1 ,
            questionIndex: quizData?.questionIndex+1
        });
    }

    const quizFinished = () => {
        setQuizData({
            ...quizData, 
            questionIndex: quizData?.questionIndex+1,
            quizFinished: true
        });
        dispatch(finishQuiz(quizData, answers));
    }

    if(quizData?.questionIndex === questions?.length && questions?.length !== 0){
        quizFinished();
    }

    const goBack = () => {
        history.push(`/groups:${params.match.url.split("/")[1].substring(7)}`);
    }

    const checkUserGroups = (userGroups) => {
        if(user && group){
            userGroups.map((userGroup) => userGroup.name === group.name && (hasGroup = true));
            
            !hasGroup && history.push('/');
        }
    }

    !localStorage.getItem('profile') && history.push('/');

    return (
      <>
        <TopNav where={"Quiz"}/>
        <div className="container mt-4">
            <div className="rounded bg-colour col-sm-8 mx-auto p-4" align="center">
                 <div className="container">
                    <div className="row">
                        <div className="col-1">
                            <button className="mt-2 backBtn" onClick={goBack}>&#8249;</button>
                        </div>
                            <div className="col">
                                {!questions === [] ? <CircularProgress /> : (
                                    <> 
                                        {!quizData?.quizFinished ? (
                                            <>  
                                                <h3>{questions[quizData?.questionIndex]?.question}</h3>
                                                <div className="container">
                                                    <div className="row center">
                                                        <button className="btn btn-info px-5 m-2" name={questions[quizData?.questionIndex]?.answer2} onClick={handleButtonClick}>{questions[quizData?.questionIndex]?.answer2}</button>
                                                        <button className="btn btn-info px-5 m-2" name={questions[quizData?.questionIndex]?.answer3} onClick={handleButtonClick}>{questions[quizData?.questionIndex]?.answer3}</button>
                                                    </div>
                                                    <div className="row center mb-4">
                                                        <button className="btn btn-info px-5 m-2" name={questions[quizData?.questionIndex]?.answer1} onClick={handleButtonClick}>{questions[quizData?.questionIndex]?.answer1}</button>
                                                        <button className="btn btn-info px-5 m-2" name={questions[quizData?.questionIndex]?.answer4} onClick={handleButtonClick}>{questions[quizData?.questionIndex]?.answer4}</button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="row">
                                                    <div className="col-11">
                                                        <h5>Correct Answers:{quizData.questionsCorrect}</h5>
                                                        <h5>Wrong Answers:{quizData.questionsWrong}</h5>
                                                    </div>
                                                </div>
                                                <div className="w-100"></div>
                                                <div className="container overflow-500">
                                                    <div className="row">
                                                        {answers.map((answer,i)=> {
                                                            return( 
                                                                <div className="col-10 question rounded my-1 mx-1">
                                                                    <div className="card-body">
                                                                        {answer.questionTitle}
                                                                    </div>
                                                                    <div className="card-body">
                                                                        Correct Answer: {answer.correctAnswer}<br/>
                                                                        Your Answer: {answer.usersAnswer}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                        )}<small><strong>Remember - </strong>only your first attempt will be saved.</small>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </>
    );
}

export default ViewQuiz;