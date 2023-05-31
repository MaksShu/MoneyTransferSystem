import React, { useEffect, useState } from 'react'
import './changeResponsive.scss'
import './change.scss'
import { Link, useNavigate } from 'react-router-dom'
import ChangeImg from '../../images/change_user.png'
import axios from 'axios'

const baseURL = "http://localhost:5000/user";

export default function Change() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [id, setId] = useState('');

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
        <div className="change-container">
            <div className="form-change">
                <h2>Change User</h2>
                <form className="form" id="form" onSubmit={submit}>
                    <label className="label-c" htmlFor="email">Email:</label>
                    <input className="input-c" type="email" id="email" name="emailinp" value={email} required onChange={e => setEmail(e.target.value)} />
                    <label className="label-c" htmlFor="password">Password:</label>
                    <input className="input-c" type="password" id="password" name="passwordinp" value={password} minLength="8" onChange={e => setPassword(e.target.value)} />
                    <label className="label-c" htmlFor="surname">Surname:</label>
                    <input className="input-c" type="text" id="surname" name="surnameinp" value={surname} required onChange={e => setSurname(e.target.value)} />
                    <label className="label-c" htmlFor="name">Name:</label>
                    <input className="input-c" type="text" id="name" name="nameinp" value={name} required onChange={e => setName(e.target.value)} />
                    <div className="change-button-container">
                        <Link className="cancel-button" to="../">Cancel</Link>
                        <input id="button" className="cancel-button" type="submit" value="Submit" />
                    </div>
                </form>
            </div>
            <div className="change-image">
                <img src={ChangeImg} alt="Change user image" />
            </div>
        </div>

    )
}
