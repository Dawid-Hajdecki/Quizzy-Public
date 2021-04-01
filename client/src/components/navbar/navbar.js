import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

import './style.scss';

const Navbar = () => {
	const user = useSelector((state) => state.user)

  	return (
    	<>
			<div id="nav" className="container">
				<div className="row justify-content-md-center">
					<div className="col center">
						<Link to={{pathname:`/profile:${user?._id}`}}>
							<div className="nav-box">
								<div className="center">
									<h1 className="text">Profile</h1>
								</div>
							</div>
						</Link>
					</div>
					<div className="col center">
						<Link to="/groups">
							<div className="nav-box">
								<div className="center">
									<h1 className="text">Groups</h1>
								</div>
							</div>
						</Link>
					</div>
					<div className="col center">
						<div className="nav-box">
							<div className="center">
								<h1 className="text">In Progress</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;