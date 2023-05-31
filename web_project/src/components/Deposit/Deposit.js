import React, { useState } from 'react'
import './deposit.scss'
import './depositResponsive.scss'
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Deposit() {
    const id = sessionStorage.getItem('CurrentWallet');
    const [reciever, setReciever] = useState();
    const [amount, setAmount] = useState();

    const navigate = useNavigate();
    const baseURL = "http://localhost:5000/wallet/";

    if (id == null) 
    { 
        return (
            <div className="maketransfer-container">
                <div>You haven`t chosen a wallet!</div>
            </div>
        )
    }

    const submit = e => {
        e.preventDefault();

        const body = {'funds': amount}

        const token = sessionStorage.getItem('JWT');

        axios.put(baseURL+id+'/deposit', body, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            alert('Success!');
            navigate("../wallets");
        }).catch((response) => {
            // console.log(response);
            alert(response.response.data.error.message);
        });
    }

    return (
        <div className='maketransfer-container'>
            <div className='form-deposit form-transfer'>
                <h2>Deposit</h2>
                <form className="form" id="form" onSubmit={submit}>
                    <label className="label-t">Wallet:</label>
                    <input className="input-t" value={id} readOnly />
                    <label className="label-t" htmlFor='amount'>Amount:</label>
                    <input className="input-t" type="number" name='amount' id='amount' required onChange={e => setAmount(e.target.value)} />
                    <div className="transfer-button-container change-button-container">
                        <Link className="cancel-button" to="../wallets">Cancel</Link>
                        <input id="button" className="cancel-button" type="submit" value="Submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}
