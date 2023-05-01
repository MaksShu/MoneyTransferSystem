import React, { useEffect, useState } from 'react'
import '../responsive.scss'
import '../style.scss'
import { Link, useNavigate } from 'react-router-dom'
import ChangeImg from '../images/change_user.png'
import axios from 'axios'

const baseURL = "http://localhost:5000/user";

export default function Change() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [id, setId] = useState();

    const navigate = useNavigate();

    const token = sessionStorage.getItem('JWT');

    useEffect(() => {
        if (sessionStorage.getItem('JWT') == null) {
            navigate("../");
        }

        axios.get(baseURL, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            const data = response.data;
            setId(data.id);
            setEmail(data.email);
            setSurname(data.last_name);
            setName(data.first_name);
        }).catch((response) => {
            alert(response.data.error.message);
        });
    }, []);

    const submit = e => {
        e.preventDefault();

        let body;
        if (password != null && password != '') {
            body = { email, password, first_name: name, last_name: surname }
        }
        else {
            body = { email, first_name: name, last_name: surname }
        }

        const token = sessionStorage.getItem('JWT');

        axios.put(baseURL + '/' + id, body, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            alert('Success!');
            navigate("../change");
        }).catch((response) => {
            alert(response.response.data.error.message);
        });
    }

    return (
        <div className="register-container">
            <div className="form-change form-reg form-container">
                <h2>Change User</h2>
                <form className="form" id="form" onSubmit={submit}>
                    <label className="label-r" htmlFor="email">Email:</label>
                    <input className="input-r" type="email" id="email" name="email" value={email} required onChange={e => setEmail(e.target.value)} />
                    <label className="label-r" htmlFor="password">Password:</label>
                    <input className="input-r" type="password" id="password" name="password" value={password} minLength="8" onChange={e => setPassword(e.target.value)} />
                    <label className="label-r" htmlFor="surname">Surname:</label>
                    <input className="input-r" type="text" id="surname" name="surname" value={surname} required onChange={e => setSurname(e.target.value)} />
                    <label className="label-r" htmlFor="name">Name:</label>
                    <input className="input-r" type="text" id="name" name="name" value={name} required onChange={e => setName(e.target.value)} />
                    <div className="button-container">
                        <Link className="button" to="../">Cancel</Link>
                        <input id="change-button" className="button" type="submit" value="Submit" />
                    </div>
                </form>
            </div>
            <div className="change-image reg-image">
                <img src={ChangeImg} alt="Change user image" />
            </div>
        </div>

        /* <script src="change.js"></script> */
    )
}
