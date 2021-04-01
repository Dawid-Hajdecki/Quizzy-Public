import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { createQuiz } from '../../../actions/quizActions';

import TopNav from '../../navbar/TopNav'
import '../../../App.scss'

const CreateQuiz = (params) => {
    const dispatch = useDispatch();
	const history = useHistory();

    const user = useSelector((state) => state.user);

    const initialData = {userId: user?._id, groupId: params.match.params.id.substring(1), name: '', tier: '', category: '', multiple: false};
    const [quizData, setQuizData] = useState(initialData);
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(quizData)
        dispatch(createQuiz(quizData, history));
    }
	
    const handleChange = (e) => {
        if(e.target.type === "checkbox"){
            setQuizData({...quizData, [e.target.name]: e.target.checked})
        }else{
            setQuizData({...quizData, [e.target.name]: e.target.value});
        }
	}

    const goBack = () => {
        console.log(params.match.params.id.substring(1))
        history.push(`/groups:${params.match.params.id.substring(1)}`)
    }

    !localStorage.getItem('profile') && history.push('/');

    return (
        <>
            <TopNav />
            <div className="div-centered mt-4">
                <div className="card text-center min-width-350">
                    <div className="card-header">
                        <button className="mt-2 backBtn floatLeft" onClick={goBack}>&#8249;</button>
                        <h3>Create Quiz</h3>
                    </div>
                    <div className="card-body">
                        <form noValidate className="form list-group list-group list-group-flush" onSubmit={handleSubmit}>
                            <input type="text" name="name" className="form-control" placeholder="Name" onChange={handleChange}/>
                            <input type="number" min="1" max="10" name="tier" className="form-control" placeholder="Tier" onChange={handleChange}/>
                            <input type="text" name="category" className="form-control" placeholder="Category" onChange={handleChange}/>
                            <label for="multiple">Should multiple user attempts be saved?</label>
                            <input type="checkBox" name="multiple" className="form-control" onChange={handleChange}/>
                            <input type="submit" className="btn btn-primary mt-3" />
                        </form>
				    </div>
			    </div>
		    </div>
		</>
	);
}

export default CreateQuiz;