import React from 'react';
import { Link } from 'react-router'
import Header from './Header';

const Register = React.createClass({

  render() {
    
    return (
        <div className="single-photo">
            <div className="col-md-6 col-md-offset-3">
                <h2>Register</h2>
                <form name="form" onSubmit="">
                	<div className="form-group">
                		<label htmlFor="username">Username</label>
                		<input type="text" className="form-control" name="username" value="" onChange="" />
                	</div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" name="email" value="" onChange="" />
                    </div>
                	<div className="form-group">
                		<label htmlFor="password">Password</label>
                		<input type="password" className="form-control" name="password" value="" onChange="" />
                	</div>
                	<div className="form-group">
                		<button className="btn btn-primary">Register</button>
                		<Link to="/login" className="btn btn-link">Login</Link>
                	</div>
                </form>
            </div>
        </div>
    );
  }

});

export default Register;
