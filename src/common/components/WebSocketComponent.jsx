
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebSocketComponent = () => {
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS(`http://localhost:8082/stomp-endpoint`); // WebSocket 서버 주소
        const stomp = Stomp.over(socket);

        stomp.connect({}, (frame) => {
            // 연결 성공 시 실행될 코드
            console.log('Connected to WebSocket');
            setStompClient(stomp);

            stomp.subscribe('/topic/greetings', (message) => {
                // 메시지가 도착했을 때 실행될 코드

            });

        }, (error) => {
            // 연결 실패 시 실행될 코드

        });

        return () => {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
        };

    }, []);

    return (
        <div>

        </div>
    );
};

export default WebSocketComponent;