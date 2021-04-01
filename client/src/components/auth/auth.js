import React, { useState } from 'react';
import { useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'
import { Helmet } from "react-helmet";

import { register, login } from '../../actions/userActions'
import TopNav from '../navbar/TopNav';

import './style.css'

const initialData = {name: 'name', email: '', password: '', confirmPassword: 'confirm'};

const Auth = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const [userData, setUserData] = useState(initialData);
	const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

		if(isRegister){
			dispatch(register(userData, history));
			
		}else{	
			dispatch(login(userData, history));
		}
    }

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value});
	}

	const switchMode = () => {
		clear();
		setIsRegister((prevIsRegister) => !prevIsRegister);
	} 
	
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-left',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
		  toast.addEventListener('mouseenter', Swal.stopTimer)
		  toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	  })

    const clear = () => {
		document.getElementById("myForm").reset();
        setUserData({name: 'name', email: '', password: '', confirmPassword: 'confirm'});
	}
	
	localStorage.getItem('profile') && history.push('/');

    return (
		<>
			<Helmet>
				<title>Quizzy - Auth</title>
			</Helmet>
			
			<TopNav />
			<div className="div-centered mt-4">
				<div className="card text-center min-width-350">
					<div className="card-header">
						<h3>{isRegister ? "Register" : "Login"}</h3>
					</div>
					<div className="card-body">
						<form id="myForm" autoComplete="off" noValidate className="form list-group list-group list-group-flush" onSubmit={handleSubmit}>
						{isRegister && (
							<>	
								<input type="text" className="form-control" placeholder="Full Name" name="name" onChange={handleChange}/>
							</>
							)
						}
						<input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange}/>
						<input type="text" name="password" className="form-control" placeholder="Password" onChange={handleChange}/>
						{isRegister && (
							<>	
								<input type="text" name="confirmPassword" className="form-control" placeholder="Confirm Password" onChange={handleChange}/>
							</>
							)
						}
						<input type="submit" className="btn btn-primary mt-3" />
					</form>
					</div>
					<div className="card-footer text-muted">
						<button className="btn btn-info mt-1" onClick={switchMode}>{isRegister ? "Already have an account?" : "Don't have an account?"}</button>
					</div>
				</div>
			</div>
		</>
    );
}

export default Auth;