import { React, useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router';
import './getWallets.scss'
import './getWalletsResponsive.scss'
import del from '../../images/delete.png'
import transfer from '../../images/money.png'

const baseURL = "http://localhost:5000/wallet";


export default function GetWallets() {
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

    const delURL = 'http://localhost:5000/wallet/'

    const delete_wallet = e => {
        if (window.confirm("Do you really want to delete a wallet?")) {
            const token = sessionStorage.getItem('JWT');

            console.log(e);

            const id = e.target.accessKey;

            axios.delete(delURL+id, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                alert('Success!');
                window.location.reload(false);
            }).catch((response) => {
                // console.log(response);
                alert(response.response.data.error);
            });
        }
    }

    const go_to_transfers = e => {
        sessionStorage.setItem('CurrentWallet', e.target.accessKey);

        navigate('../transfers');
    }

    const go_to_maketransfer = e => {
        sessionStorage.setItem('CurrentWallet', e.target.accessKey);

        navigate('../make-transfer');
    }

    const go_to_deposit = e => {
        sessionStorage.setItem('CurrentWallet', e.target.accessKey);

        navigate('../deposit');
    }

    if (!post) {
        return <div>Loading...</div>;
    } else if (post.status != 200) {
        return <div>Error: {post.response.data.msg}</div>;
    } else {
        return <>{post.data.Wallets.map(item => (
            <div className="wallet" key={item.id}>
                <div className="block">
                    <h2>#{item.id}</h2>
                    <img onClick={go_to_transfers} src={transfer} accessKey={item.id} className="round-button"></img>
                    <img onClick={delete_wallet} accessKey={item.id} src={del} className="delete-button"></img>
                </div>
                <div className="block">
                    <h1>${item.funds}</h1><button onClick={go_to_deposit} accessKey={item.id} className="deposit-button">Deposit</button>
                </div>
                <a className="transfer-button" onClick={go_to_maketransfer} accessKey={item.id}>Make transfer</a>
            </div>
        ))}</>
    }
}