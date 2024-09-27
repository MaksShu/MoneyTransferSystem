import { React, useState, useEffect } from 'react';
import axios from "axios";
import './login.scss';
import './loginResponsive.scss';
import { Link } from 'react-router-dom';
import LoginImg from '../../images/login_image.png';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const baseURL = "http://localhost:5000/user/login";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('JWT') != null) {
            navigate("../users");
        }
    });

    const submit = e => {
        e.preventDefault()
        axios.post(baseURL, { email, password }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            sessionStorage.setItem('JWT', response.data.access_token);
            toast.success('Successful login!', {
                position: toast.POSITION.TOP_CENTER
            });
            navigate("../users");
        }).catch((response) => {
            toast.error(response.response.data.error.message, {
                position: toast.POSITION.TOP_CENTER
            });
        });
    }

    return (
        <div className="login-container">
            <div className="form-container">
                <h2>Login</h2>
                <form className="form" id="form" onSubmit={submit}>
                    <label className="label" htmlFor="login">Username:</label>
                    <input id="login" className="input" type="email" name="login" placeholder="t5@gmail.com" required onChange={e => setEmail(e.target.value)} />
                    <label className="label" htmlFor="password">Password:</label>
                    <input id="password" className="input pass" type="password" minLength="8" name="password" placeholder="12345678" required onChange={e => setPassword(e.target.value)} />
                    <div className="button-container">
                        <Link className="button" to="../register">Register</Link>
                        <button id="login-button" className="button" type="submit">Sign in</button>
                    </div>
                </form>
            </div>
            <div className="image-container">
                <img className="login-img" src={LoginImg} alt="Login image" />
            </div>
        </div>

    )
}
