import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { editGroup } from '../../../actions/groupActions';

import TopNav from '../../navbar/TopNav';
import '../../../App.scss';

const EditGroups = (params) => {
    const dispatch = useDispatch();
	const history = useHistory();

    const user = useSelector((state) => state.user);
    const group = params.location.param1
    if(!group){history.push('/')};

    const initialData = {userId: user?._id, groupId: group?._id, prevName: group?.name, name: group?.name, description: group?.description, password: '', confirmPassword: ''};
    const [groupData, setGroupData] = useState(initialData);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(editGroup(groupData, history));
    }
	
    const handleChange = (e) => {
        setGroupData({...groupData, [e.target.name]: e.target.value});
	}

    const goBack = () => {
        history.push('/groups')
    }

    !localStorage.getItem('profile') && history.push('/');

    return (
        <>
            <TopNav />
            <div className="div-centered mt-4">
                <div className="card text-center min-width-350">
                    <div className="card-header">
                        <button className="mt-2 backBtn floatLeft" onClick={goBack}>&#8249;</button>
                        <h3>Edit Group</h3>
                    </div>
                    <div className="card-body">
                        <form noValidate className="form list-group list-group list-group-flush" onSubmit={handleSubmit}>
                            <input type="text" name="name" className="form-control" placeholder="Name" value={groupData.name} onChange={handleChange}/>
                            <input type="text" name="description" className="form-control" placeholder="Description" value={groupData.description} onChange={handleChange}/>
                            <input type="password" name="password" className="form-control" placeholder="Password" value={groupData.password} onChange={handleChange}/>
                            <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" onChange={handleChange}/>
                            <input type="submit" className="btn btn-primary mt-3" />
                        </form>
				    </div>
                    <div className="card-footer">Please provide a Password </div>
                    <small>A new or an exiting one.</small>
			    </div>
		    </div>
		</>
	);
}

export default EditGroups;