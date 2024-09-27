import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import './userMenu.scss';
import './userMenuResponsive.scss';

const baseURL = "http://localhost:5000/user";

export default function UserMenu() {
    const navigate = useNavigate();

    const logout = e => {
        if (sessionStorage.getItem('JWT') != null) {
            sessionStorage.removeItem('JWT');
            sessionStorage.removeItem('CurrentWallet');
            toast.success('Log out user successfuly!', {
                position: toast.POSITION.TOP_CENTER
            });
            navigate('../');
        }
    }

    const deleteUser = e => {
        confirmAlert({
            title: 'Do you really want to delete user?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const token = sessionStorage.getItem('JWT');

                    axios.delete(baseURL, {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }).then((response) => {
                        toast.success('Deleted user successfuly!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                        sessionStorage.removeItem('JWT');
                        sessionStorage.removeItem('CurrentWallet');
                        navigate('../');
                    }).catch((response) => {
                        toast.error(response.data.error.message, {
                            position: toast.POSITION.TOP_CENTER
                        });
                    });
                }
              },
              {
                label: 'No',
              }
            ]
        });
    }

    if (sessionStorage.getItem('JWT') == null) {
        return <li className="dropdown-menu-li"><Link to="../login">Login</Link></li>
    }

    return <>
        <li className="dropdown-menu-li"><Link to="../change">Change</Link></li>
        <li className="dropdown-menu-li"><Link to="../chat">Chat</Link></li>
        <li className="dropdown-menu-li"><a id="logout-button" onClick={logout}>Log out</a></li>
        <li className="dropdown-menu-li"><a id="delete-button" onClick={deleteUser}>Delete</a></li>
    </>
}
