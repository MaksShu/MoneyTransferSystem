import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import './getTransfers.scss';
import './getTransfersResponsive.scss';

export default function GetTransfers() {
    const [post, setPost] = useState(null);

    const navigate = useNavigate();
    const token = sessionStorage.getItem('JWT');
    const id = sessionStorage.getItem('CurrentWallet');
    const baseURL = "http://localhost:5000/wallet/";

    useEffect(() => {
        if (sessionStorage.getItem('JWT') == null) {
            navigate("../");
        }

        if(id != null){
            axios.get(baseURL+id+'/transfers', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                // console.log(response);
                setPost(response);
            }).catch((response) => {
                // console.log(response);
                setPost(response);
            });
        }
    }, []);

    if (id==null){
        return <div>You haven`t chosen a wallet!</div>;
    }
    else if (!post) {
        return <div>Loading...</div>;
    } else if (post.status != 200) {
        return <div>Error: {post.response.data.msg}</div>;
    } else {
        if(post.data.Transfers.length == 0){
            return <div>No transfers found</div>;
        }else{
            return <>{post.data.Transfers.map(item => (
                <div className="transfer" role='listitem' key={item.id}>
                    <div className="transfer-block">
                        <h2><c className='heading'>From:</c> <h3>#{item.from_wallet_id}</h3></h2>
                        <h2><c className='heading'>To:</c> <h3>#{item.to_wallet_id}</h3></h2>
                        <h2><c className='heading'>Amount:</c> <h3>${item.amount}</h3></h2>
                        <h2><c className='heading'>Date&Time:</c> <h3>{item.datetime.substring(0, item.datetime.indexOf(".")).replace('T',' ')}</h3></h2>
                    </div>
                </div>
            ))}</>
        } 
    }
}
