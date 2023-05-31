import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './chat.scss'
import axios from "axios";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [isConnectionOpen, setConnectionOpen] = useState(false);
    const [messageBody, setMessageBody] = useState("");

    const navigate = useNavigate();
    const token = sessionStorage.getItem('JWT');

    const ws = useRef();
    const [username, setUsername] = useState('');

    const sendMessage = () => {
        if (messageBody) {
            ws.current.send(
                JSON.stringify({
                    sender: username,
                    body: messageBody,
                })
            );
            setMessageBody("");
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem('JWT') == null) {
            navigate("../");
        }

        const baseURL = "http://localhost:5000/user";

        axios.get(baseURL, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            const data = response.data;
            setUsername(data.first_name + ' ' + data.last_name);
        }).catch((response) => {
            alert(response.data.error.message);
        });

        ws.current = new WebSocket("ws://localhost:8080");

        ws.current.onopen = () => {
            console.log("Connection opened");
            setConnectionOpen(true);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((_messages) => [..._messages, data]);
        };

        return () => {
            console.log("Cleaning up...");
            ws.current.close();
        };
    }, []);

    const scrollTarget = useRef(null);

    useEffect(() => {
        if (scrollTarget.current) {
            scrollTarget.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length]);

    return (
        <div className='chat-page-container'>
            <div className="container">
                <h1>Chat</h1>
                <h2>Your username: {username} </h2>
                <div className="chat-container">
                    <div className="chat">
                        {messages.map((value, index) => {
                            if (value.sender === username) {
                                return (
                                    <div key={index} className="my-message-container">
                                        <div className="my-message">
                                            <p className="client">{username} at {new Date(value.sentAt).toLocaleTimeString(undefined, {timeStyle: "short",})}{" "}</p>
                                            <p className="message">{value.body}</p>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={index} className="another-message-container">
                                        <div className="another-message">
                                            <p className="client">{value.sender} at {new Date(value.sentAt).toLocaleTimeString(undefined, {timeStyle: "short",})}{" "}</p>
                                            <p className="message">{value.body}</p>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                        <div ref={scrollTarget}/>
                    </div>
                    <div className="input-chat-container">
                        <input
                            className="input-chat"
                            type="text"
                            placeholder="Chat message ..."
                            onChange={(e) => setMessageBody(e.target.value)}
                            value={messageBody}
                        ></input>
                        <button className="submit-chat" onClick={sendMessage} disabled={!isConnectionOpen}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}