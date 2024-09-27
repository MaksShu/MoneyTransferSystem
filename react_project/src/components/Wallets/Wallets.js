import React, { useEffect, useState } from 'react'
import './wallets.scss'
import './walletsResponsive.scss'
import GetWallets from '../GetWallets/GetWallets'
import add from '../../images/add.png'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Wallets() {
    const baseURL = 'http://localhost:5000/wallet'

    const [seed, setSeed] = useState(1);
    const reset = () => {
        setSeed(Math.random());
    }

    const create_wallet = e => {

        const token = sessionStorage.getItem('JWT');

        const body = { funds: 0 }

        axios.post(baseURL, body, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            toast.success('Successfuly created new wallet!', {
                position: toast.POSITION.TOP_CENTER
            });
            reset();
        }).catch((response) => {
            toast.error(response.response.error.message, {
                position: toast.POSITION.TOP_CENTER
            });
        });
    }

    return (
        <div className="wallets-container">
            <GetWallets refresh={seed}/>
            <div className='add-button-div'>
                <img onClick={create_wallet} className='add-button' src={add} alt='add button'></img>
            </div>
        </div>
    )
}
