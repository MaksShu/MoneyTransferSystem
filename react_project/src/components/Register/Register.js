import { React, useEffect, useState } from 'react';
import './register.scss';
import './registerResponsive.scss';
import { Link, useNavigate } from 'react-router-dom';
import RegisterImg from '../../images/register_image.png';
import axios from "axios";
import { toast } from 'react-toastify';

const baseURL = "http://localhost:5000/user";

export default function Register() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('JWT') != null) {
            navigate("../users");
        }
    });

    const submit = e => {
        e.preventDefault()
        axios.post(baseURL, { email, password, first_name: name, last_name: surname }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            toast.success('Registered successfuly!', {
                position: toast.POSITION.TOP_CENTER
            });
            navigate("../login");
        }).catch((response) => {
            toast.error(response.response.data.error.message, {
                position: toast.POSITION.TOP_CENTER
            });
        });
    }

    return (
        <div className="register-container">
            <div className="reg-image">
                <img src={RegisterImg} alt="Register image" />
            </div>
            <div className="form-reg">
                <h2>Register</h2>
                <form className="form" id="form" onSubmit={submit}>
                    <label className="label-r" htmlFor="email">Email:</label>
                    <input className="input-r" type="email" id="email" name="email" required onChange={e => setEmail(e.target.value)} />
                    <label className="label-r" htmlFor="password">Password:</label>
                    <input className="input-r" type="password" id="password" name="password" minLength="8" required onChange={e => setPassword(e.target.value)} />
                    <label className="label-r" htmlFor="surname">Surname:</label>
                    <input className="input-r" type="text" id="surname" name="surname" required onChange={e => setSurname(e.target.value)} />
                    <label className="label-r" htmlFor="name">Name:</label>
                    <input className="input-r" type="text" id="name" name="name" required onChange={e => setName(e.target.value)} />
                    <div className="reg-button-container">
                        <Link className="button" to="../login">Login</Link>
                        <input className="button" id="register-button" type="submit" value="Sign up" />
                    </div>
                </form>
            </div>
        </div>

    )
}
