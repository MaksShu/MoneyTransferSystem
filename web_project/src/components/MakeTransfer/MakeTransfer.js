import React, { useState } from 'react'
import './makeTransfer.scss'
import './makeTransferResponsive.scss';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default function MakeTransfer() {
    const id = sessionStorage.getItem('CurrentWallet');
    const [reciever, setReciever] = useState();
    const [amount, setAmount] = useState();

    const navigate = useNavigate();
    const baseURL = "http://localhost:5000/wallet/make-transfer";

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

        const body = {'from_wallet_id': id, 'to_wallet_id': reciever, 'amount': amount}

        const token = sessionStorage.getItem('JWT');

        axios.post(baseURL, body, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            alert('Success!');
            navigate("../transfers");
        }).catch((response) => {
            console.log(response);
            alert(response.response.data.error.message);
        });
    }

    return (
        <div className="maketransfer-container">
            <div className="form-transfer">
                <h2>Make Transfer</h2>
                <form className="form" id="form" onSubmit={submit}>
                    <label className="label-t">Sender wallet:</label>
                    <input className="input-t" value={id} readonly/>
                    <label className="label-t">Reciever wallet:</label>
                    <input className="input-t" value={reciever} type='number' required onChange={e => setReciever(e.target.value)} />
                    <label className="label-t">Amount:</label>
                    <input className="input-t" value={amount} required onChange={e => setAmount(e.target.value)} />
                    <div className="transfer-button-container change-button-container">
                        <Link className="cancel-button" to="../wallets">Cancel</Link>
                        <input id="button" className="cancel-button" type="submit" value="Submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}
