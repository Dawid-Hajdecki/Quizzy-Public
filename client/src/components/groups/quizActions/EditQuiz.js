import React, { useState, useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { getQuiz, editquiz } from '../../../actions/quizActions';

import TopNav from '../../navbar/TopNav'
import '../../../App.scss'

const EditQuizzes = (params) =>{
    const dispatch = useDispatch();
	const history = useHistory();
    const location = useLocation();
    
    const user = useSelector((state) => state.user);
    const quiz = params.location.param1;
    if(!quiz){history.push('/')};

    const groupId = params.match.url.split("/")[1].substring(7);
    const quizId = params.match.url.split("/")[2].substring(5) ;

    useEffect(() => {
        dispatch(getQuiz(groupId, quizId))
    },[location]);

    const initialData = {userId:user?._id, id: quizId, groupId, name: quiz?.name, tier: quiz?.tier, category: quiz?.category, multiple: quiz?.multiple};
    const [quizData, setQuizData] = useState(initialData);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(editquiz(quizData, history));
    }
	
    const handleChange = (e) => {
        if(e.target.type === "checkbox"){
            setQuizData({...quizData, [e.target.name]: e.target.checked})
        }else{
            setQuizData({...quizData, [e.target.name]: e.target.value});
        }
	}

    const goBack = () => {
        history.push(`/groups:${params.match.url.split("/")[1].substring(7)}`)
    }

    !localStorage.getItem('profile') && history.push('/');

    return (
        <>
            <TopNav />
            <div className="div-centered mt-4">
                <div className="card text-center min-width-350">
                    <div className="card-header">
                        <button className="mt-2 backBtn floatLeft" onClick={goBack}>&#8249;</button>
                        <h3>Edit quiz</h3>
                    </div>
                    <div className="card-body">
                        <form noValidate className="form list-group list-group list-group-flush" onSubmit={handleSubmit}>
                            <input type="text" name="name" className="form-control" placeholder="Name" value={quizData?.name} onChange={handleChange}/>
                            <input type="number" min="1" max="10" name="tier" className="form-control" placeholder="Tier" value={quizData?.tier} onChange={handleChange}/>
                            <input type="text" name="category" className="form-control" placeholder="Category" value={quizData?.category} onChange={handleChange}/>
                            <label for="multiple">Should multiple user attempts be saved?</label>
                            <input type="checkBox" name="multiple" className="form-control" defaultChecked={quizData?.multiple} onChange={handleChange}/>
                            <input type="submit" className="btn btn-primary mt-3" />
                        </form>
				    </div>
			    </div>
		    </div>
		</>
	);
}

export default EditQuizzes;