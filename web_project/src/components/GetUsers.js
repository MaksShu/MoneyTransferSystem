import { React, useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router';

const baseURL = "http://localhost:5000/users";


export default function GetUsers() {
    const [post, setPost] = useState(null);

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
            setPost(response);
        }).catch((response) => {
            setPost(response);
        });
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    } else if (post.status != 200) {
        return <div>Error: {post.response.data.msg}</div>;
    } else {
        return <>{post.data.Users.map(item => (
            <div className="c-user user" key={item.id}>
                <h1>{item.email}</h1>
                <h2>User</h2>
                <a className="user-button button">Wallets</a>
            </div>
        ))}</>
    }
}


