import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import decode from 'jwt-decode';

import { getUser } from '../../actions/userActions';

import './style.scss';
import '../../App.scss'

const TopNav = ({where}) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
 
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
	
	const Toast = Swal.mixin({
		toast: true,
		position: 'bottom-right',
		showConfirmButton: false,
		timer: 4000,
		timerProgressBar: true,
		didOpen: (toast) => {
		  toast.addEventListener('mouseenter', Swal.stopTimer)
		  toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	  })

	const logout = () => {
		dispatch({ type: 'LOGOUT'});
		dispatch({ type: 'CLEAR_GROUPS'});
		
		history.push('/')
		Toast.fire({
            icon: 'success',
            title: 'Logout successful'
        })

		setUser(null);
	}

	useEffect(() => {
		const token = user?.token;
		if(token){
			const decodedToken = decode(token);
			if (decodedToken.exp * 1000 < new Date().getTime()) {
				logout();
			}else{
				dispatch(getUser())
			}
		}
		setUser(JSON.parse(localStorage.getItem('profile')));
	}, [location])

  	return (
    	<>
			<nav className="navbar background-colour navbar-expand-lg navbar-light">
				<Link className="navbar-brand nav-link" to="/"><h4>Home</h4></Link>
				{where && <h4>{where}</h4>}

					{user ? (
						<ul className="navbar-nav ml-auto">
							<li className="nav-item">
								<button className="btn btn-primary m-1" onClick={logout}>Logout</button>
							</li>
						</ul>
					) : (
						<ul className="navbar-nav ml-auto">
							<li className="nav-item">
								<Link to="/auth"><button className="btn btn-primary m-1">Log-in</button></Link>
							</li>
						</ul>
					)}

			</nav>
			
		</>
	);
}

export default TopNav;