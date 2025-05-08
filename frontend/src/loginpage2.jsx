import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './login.css';
import { useUser } from './context/UserContext';
import { FaUserGraduate, FaLock, FaUserShield, FaSignInAlt } from 'react-icons/fa';

const LoginPage2 = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { setUserType, setUserRoll } = useUser();

    const onSubmit = (data) => {
        axios.post('http://localhost:3000/login', data, {
            withCredentials: true
        })
            .then((result) => {
                console.log(result.data);
                setUserType(result.data.userType);
                setUserRoll(result.data.roll);
                navigate('/');
            })
            .catch((err) => alert(err.response.data));
    };
    
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Please sign in to your account</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="form-group">
                        <div className="input-group">
                           
                            <input
                                type="text"
                                placeholder="Roll Number"
                                {...register('Roll', {
                                    required: true,
                                    pattern: /^[0-9]{4}[a-zA-Z]{3}[0-9]{4}$/,
                                })}
                            />
                        </div>
                        {errors.Roll && <span className="error-message">Enter a valid Roll number</span>}
                    </div>
                    
                    <div className="form-group">
                        <div className="input-group">
                           
                            <input
                                type="password"
                                placeholder="Password"
                                {...register('password', { required: true })}
                            />
                        </div>
                        {errors.password && <span className="error-message">Password is required</span>}
                    </div>
                    
                    <div className="form-group">
                        <div className="input-group">
                            <FaUserShield className="input-icon" />
                            <select {...register('type', { required: true })}>
                                <option value="">Select User Type</option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>
                        </div>
                        {errors.type && <span className="error-message">Please select a user type</span>}
                        <div className="guest">
                            <button onClick={() => navigate('/')}>Continue As Guest</button>
                        </div>
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="submit-button">
                        <FaSignInAlt className="button-icon" />
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage2;
