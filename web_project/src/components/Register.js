import { React, useEffect, useState } from 'react';
import '../style.scss';
import '../responsive.scss';
import { Link, useNavigate } from 'react-router-dom';
import RegisteImg from '../images/register_image.png';
import axios from "axios";

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
            alert('Success!');
            navigate("../login");
        }).catch((response) => {
            alert(response.response.data.error.message);
        });
    }

    return (
        <div className="register-container">
            <div className="reg-image">
                <img src={RegisteImg} alt="Register image" />
            </div>
            <div className="form-reg form-container">
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
                    <div className="button-container">
                        <Link className="button" to="../login">Login</Link>
                        <input className="button" id="register-button" type="submit" value="Sign up" />
                    </div>
                </form>
            </div>
        </div>

    )
}
