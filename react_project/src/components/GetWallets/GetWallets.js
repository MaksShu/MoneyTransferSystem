import { React, useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router';
import './getWallets.scss'
import './getWalletsResponsive.scss'
import del from '../../images/delete.png'
import transfer from '../../images/money.png'
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const baseURL = "http://localhost:5000/wallet";


export default function GetWallets(props) {
    const [post, setPost] = useState(null);

    const navigate = useNavigate();
    const token = sessionStorage.getItem('JWT');

    useEffect(() => {
        if (sessionStorage.getItem('JWT') == null) {
            toast.warning('Please, login to access this page!', {
                position: toast.POSITION.TOP_CENTER
            });
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

    const update = () => {
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
    }

    useEffect(() => {
        update();
    }, [props.refresh]);

    const delURL = 'http://localhost:5000/wallet/'

    const delete_wallet = e => {
        confirmAlert({
            title: 'Do you really want to delete wallet?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const token = sessionStorage.getItem('JWT');

                    const id = e.target.accessKey;

                    axios.delete(delURL+id, {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }).then((response) => {
                        toast.success('Successfuly deleted wallet!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                        update();
                    }).catch((response) => {
                        // console.log(response);
                        toast.error(response.response.data.error, {
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
            <div className="wallet" role='listitem' key={item.id}>
                <div className="block">
                    <h2>#{item.id}</h2>
                    <img onClick={go_to_transfers} role='transfers' src={transfer} accessKey={item.id} className="round-button"></img>
                    <img onClick={delete_wallet} role='delete' accessKey={item.id} src={del} className="delete-button"></img>
                </div>
                <div className="block">
                    <h1>${item.funds/100}</h1><button onClick={go_to_deposit} accessKey={item.id} className="deposit-button">Deposit</button>
                </div>
                <a className="transfer-button" alt='transfer button' onClick={go_to_maketransfer} accessKey={item.id}>Make transfer</a>
            </div>
        ))}</>
    }
}