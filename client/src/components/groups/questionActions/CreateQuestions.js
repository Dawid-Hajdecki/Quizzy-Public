import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { createQuestion } from '../../../actions/questionActions';

import TopNav from '../../navbar/TopNav'
import '../../../App.scss'

const CreateQuiz = (params) => {
    const dispatch = useDispatch();
	const history = useHistory();
    
    const user = useSelector((state) => state.user);
    const groupId = params.match.url.split("/")[1].substring(7);
    const quizId = params.match.url.split("/")[2].substring(5);
    
    const initialData = {userId: '', groupId, quizId, title: '',question: '', correctAnswer: '', wrongAnswer1: '', wrongAnswer2: '', wrongAnswer3: ''};
    const [questionData, setQuestionData] = useState(initialData);
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        setQuestionData({...questionData, userId: user?._id})
        sendSubmit();
    }
    const sendSubmit = () =>{
        console.log(questionData)
        dispatch(createQuestion(questionData, history));
    }
	
    const handleChange = (e) => {
        setQuestionData({...questionData, [e.target.name]: e.target.value});
	}

    const goBack = () => {
        history.push(`/groups:${groupId}/quiz:${quizId}/questions`);
    }

    !localStorage.getItem('profile') && history.push('/auth');

    return (
        <>
            <TopNav />
            <div className="div-centered mt-4">
                <div className="card text-center min-width-350">
                    <div className="card-header">
                        <button className="mt-2 backBtn floatLeft" onClick={goBack}>&#8249;</button>
                        <h3>Create Question</h3>
                    </div>
                    <div className="card-body">
                        <form noValidate className="form list-group list-group list-group-flush" onSubmit={handleSubmit}>
                            <input type="text" name="title" className="form-control" placeholder="Title" onChange={handleChange}/>
                            <input type="text" name="question" className="form-control" placeholder="Question" onChange={handleChange}/>
                            <input type="text" name="correctAnswer" className="form-control" placeholder="Correct Answer" onChange={handleChange}/>
                            <input type="text" name="wrongAnswer1" className="form-control" placeholder="1st Wrong Answer" onChange={handleChange}/>
                            <input type="text" name="wrongAnswer2" className="form-control" placeholder="2nd Wrong Answer" onChange={handleChange}/>
                            <input type="text" name="wrongAnswer3" className="form-control" placeholder="3rd Wrong Answer" onChange={handleChange}/>
                            <input type="submit" className="btn btn-primary mt-3" />
                        </form>
				    </div>
                    <div className="card-footer">Title allows easier access to question.</div>
                    <small>It can be anything. <br/>Even 'Q1'.</small>
			    </div>
		    </div>
		</>
	);
}

export default CreateQuiz;