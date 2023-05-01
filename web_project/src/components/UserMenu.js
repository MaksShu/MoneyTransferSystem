import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const baseURL = "http://localhost:5000/user";

export default function UserMenu() {
    const navigate = useNavigate();

    const logout = e => {
        if (sessionStorage.getItem('JWT') != null) {
            sessionStorage.removeItem('JWT');
            navigate('../');
        }
    }

    const deleteUser = e => {
        if (window.confirm("Do you really want to delete account?")) {
            const token = sessionStorage.getItem('JWT');

            axios.delete(baseURL, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                alert('Success!');
                sessionStorage.removeItem('JWT');
                navigate('../');
            }).catch((response) => {
                alert(response.data.error.message);
            });
        }
    }

    if (sessionStorage.getItem('JWT') == null) {
        return <li className="dropdown-menu-li"><Link to="../login">Login</Link></li>
    }

    return <>
        <li className="dropdown-menu-li"><Link to="../change">Change</Link></li>
        <li className="dropdown-menu-li"><a id="logout-button" onClick={logout}>Log out</a></li>
        <li className="dropdown-menu-li"><a id="delete-button" onClick={deleteUser}>Delete</a></li>
    </>
}
