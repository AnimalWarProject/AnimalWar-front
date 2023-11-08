import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function Chatting() {
    const [stompClient, setStompClient] = useState(null);
    const [id, setId] = useState(null);
    const [nickName, setNickName] = useState(null);
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [greetings, setGreetings] = useState([]);

    useEffect(() => {
        parseToken();
        connect();

        return () => {
            disconnect();
        };
    }, []);

    const parseToken = () => {
        const url = 'http://localhost:8080/api/v1/user/me';
        const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJuaWNrTmFtZSI6Imdvb2Rib3kiLCJpZCI6Imp1bmtpIiwic3ViIjojanVua2kiLCJleHAiOjE2OTc3ODk1MzR9.xbClRoOdXXEeI8k2AfbpUE2jsaLX_zT6JUdJ1WD-e3k';

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('서버 응답:', data);
                setId(data.id);
                setNickName(data.nickName);
            })
            .catch(error => {
                console.error('에러 발생:', error);
            });
    };

    const connect = () => {
        const socket = new SockJS('/stomp-endpoint');
        const stomp = Stomp.over(socket);
        stomp.connect({}, frame => {
            setConnected(true);
            console.log('Connected: ' + frame);
            setStompClient(stomp);
            stomp.subscribe('/topic/greetings', greeting => {
                showGreeting(JSON.parse(greeting.body));
            });
        });
    };

    const disconnect = () => {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        setConnected(false);
        console.log("Disconnected");
    };

    const showGreeting = message => {
        setGreetings(prevGreetings => [
            ...prevGreetings,
            `${message.name} : ${message.message}`
        ]);
    };

    const sendName = () => {
        const obj = {
            'name': nickName || 'GUEST',
            'content': message
        };
        stompClient.send('/app/hello', {}, JSON.stringify(obj));
    };

    return (
        <div>
            <button disabled={connected} onClick={connect}>
                Connect
            </button>
            <button disabled={!connected} onClick={disconnect}>
                Disconnect
            </button>
            <form onSubmit={e => e.preventDefault()}>
                <input
                    type="text"
                    id="content"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button onClick={sendName}>Send</button>
            </form>
            <div id="greetings">
                {greetings.map((greeting, index) => (
                    <div key={index}>{greeting}</div>
                ))}
            </div>
        </div>
    );
}

export default Chatting;
