import React from 'react';
import { Link } from 'react-router';

const Header = React.createClass({
	render(){
		return(
			<div className="header-bar">
				<div className="header-logo">
					<h1><Link to="/">My PortFolio</Link></h1>
				</div>
				<div className="login-part">
					<span><Link to="/login">Login</Link></span>
					<span><Link to="/Register">Register</Link></span>
				</div>
			</div>
		)
	}
});

export default Header;
