import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { createGroup } from '../../../actions/groupActions';

import TopNav from '../../navbar/TopNav'
import '../../../App.scss'

const CreateGroups = () => {
    const dispatch = useDispatch();
	const history = useHistory();

    const user = useSelector((state) => state.user);

    const initialData = {userId: user?._id, name: '', description: '', password: '', confirmPassword: ''};
    const [groupData, setGroupData] = useState(initialData);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(groupData);
        
        dispatch(createGroup(groupData, history));
    }
	
    const handleChange = (e) => {
        setGroupData({...groupData, [e.target.name]: e.target.value});
	}

    const goBack = () => {
        history.push('/groups')
    }
    
    !localStorage.getItem('profile') && history.push('/auth');

    return (
        <>
            <TopNav />
            <div className="div-centered mt-4">
                <div className="card text-center min-width-350">
                    <div className="card-header">
                        <button className="mt-2 backBtn floatLeft" onClick={goBack}>&#8249;</button>
                        <h3>Create Group</h3>
                    </div>
                    <div className="card-body">
                        <form noValidate className="form list-group list-group list-group-flush" onSubmit={handleSubmit}>
                            <input type="text" name="name" className="form-control" placeholder="Name" onChange={handleChange}/>
                            <input type="text" name="description" className="form-control" placeholder="Description" onChange={handleChange}/>
                            <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange}/>
                            <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" onChange={handleChange}/>
                            <input type="submit" className="btn btn-primary mt-3" />
                        </form>
				    </div>
			    </div>
		    </div>
		</>
	);
}

export default CreateGroups;