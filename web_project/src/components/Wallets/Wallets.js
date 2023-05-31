import React, { useEffect, useState } from 'react'
import './wallets.scss'
import './walletsResponsive.scss'
import GetWallets from '../GetWallets/GetWallets'
import add from '../../images/add.png'
import axios from 'axios'

export default function Wallets() {
    const [reload, setReload] = useState([]);

    const baseURL = 'http://localhost:5000/wallet'

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
            alert(response.data.message);
            setReload(true);
        }).catch((response) => {
            //console.log(response);
            alert(response.response.error.message);
        });
    }

    return (
        <div className="wallets-container">
            <GetWallets />
            <div className='add-button-div' name={reload}>
                <img onClick={create_wallet} className='add-button' src={add} alt='add button'></img>
            </div>
        </div>
    )
}
