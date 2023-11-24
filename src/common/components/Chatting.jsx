import classes from './Chatting.module.css';
import Rectangle4 from '../imgs/Rectangle 4.png';
import sendIcon from '../imgs/send.png';
import plusIcon from '../imgs/plusIcon.png';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import randomColor from 'random-color';
import {colors} from "@mui/material";

const Chatting = () => {
    const [inputText, setInputText] = useState('');
    const maxLength = 100; // 최대 글자 수
    const [isFocused, setIsFocused] = useState(false);
    const wrapRef = useRef();
    const [nickName, setNickName] = useState('GUEST');
    const [profileImage, setProfileImage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [greetings, setGreetings] = useState([]);
    const [UUID, setUUID] = useState('')
    const scrollRef = useRef();
    const [uuidColors, setUuidColors] = useState({});



    // Feat : 채팅에 유저마다 닉네임 색깔 지정
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Feat : 메시지 보내기
    const sendName = () => {
        const obj = {
            uuid: UUID,
            nickname: nickName,
            content: inputText,
        };
        stompClient.send('/app/hello', {}, JSON.stringify(obj));
    };

    // Feat : 채팅 길이 제한
    const handleInputChange = (event) => {
        const text = event.target.value;
        setInputText(text);
        // 입력된 텍스트 길이가 최대 길이를 초과하지 않도록 확인
        if (text.length <= maxLength) {
            setInputText(text);
        } else {
            alert('100자를 초과하였습니다.'); // 100자를 초과한 경우 알림
        }
    };

    // Feat : 커서를 올려두었을 때 채팅창 커지게 하기
    const handleFocus = () => {
        // setIsFocused(true);
        wrapRef.current.style.position = 'absolute'; //GameTemplate.css의 box-container에 position: relative; 이렇게 주면 위치를 변동하곘다는거임..
        wrapRef.current.style.height = '97%';
        wrapRef.current.style.top = '2%';
    };

    const handleBlur = () => {
        // setIsFocused(false);
        wrapRef.current.style.position = 'absolute';
        wrapRef.current.style.height = ' 21rem';
        wrapRef.current.style.top = '49%';
    };

    const messageStyle = {
        height: isFocused ? '80%' : '100%', // 커서가 입력 필드에 있을 때와 없을 때의 너비 조절
    };

    const keydownHandler = (e) => {
        if (e.key === 'Enter') {
            sendName();
            setInputText('');
            // scrollRef.current가 현재 컨테이너의 DOM 요소를 가리키고 있다고 가정합니다.
            const container = scrollRef.current;
            // 스크롤을 가장 아래로 내리기
            container.scrollTop = container.scrollHeight;
        }
    };


    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        axios
            .get('http://localhost:8000/api/v1/user', {
                headers: {
                    ContentType: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res) => {
                setUUID(res.data.uuid);
                setNickName(res.data.nickName);
                setProfileImage(res.data.profileImage);
            })
            .catch((err) => {
                console.log(err);
            });

        const socket = new SockJS('http://localhost:8082/stomp-endpoint'); // #1 socket열기(server와 연결) // npm install stompjs
        const stomp = Stomp.over(socket); // STOMP 클라이언트를 통해 STOMP 프로토콜을 사용하여 메시지를 전송 및 수신

        stomp.connect({}, (frame) => {
            setStompClient(stomp);
            console.log('Connected: ' + frame); // STOMP 클라이언트를 서버와 연결하고, 연결에 성공하면 콜백 함수를 실행.. {}는 헤더(연결에 대한 추가 설정)

            // #2'/topic/greetings'을 구독
            stomp.subscribe('/topic/greetings', (greeting) => {
                // 메시지를 파싱하고 표시
                const parseMessage = JSON.parse(greeting.body);
                // uuid별 랜덤 색상 부여
                setUuidColors((prevColors) => ({
                    ...prevColors,
                    [parseMessage.uuid]: prevColors[parseMessage.uuid] || getRandomColor(), // 현재 도착한 채팅 메시지의 UUID에 이미 부여된 색이 있다면 그 값을 사용하고, 없다면 새로운 색상 부여..
                }));
                setGreetings((prevState) => [...prevState, parseMessage]);
            });
        });

        // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
        return () => {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
        };
    }, []);





    return (
        <section className={classes.Wrap} ref={wrapRef}>
            <div className={classes.box}>
                <div className={classes.title}>CHATTING</div>
                <div ref={scrollRef} className={classes.message} style={messageStyle}>
                    <div className={classes.message_title}>GOOD CHATTING PLZ!</div>

                    {greetings.map((item, idx) => (
                        <div key={idx} className={classes.message_container}>
                            <img className={classes.profileImg}
                                // style={{  width: '50px', height: '50px', objectFit: 'cover'}}
                                src={profileImage}
                            />
                            <div className={classes.profileNickname} style={{color: uuidColors[item.uuid]} }>{item.nickname}</div>
                            <div className={classes.messageRecord}>{item.message}</div>
                        </div>
                    ))}
                </div>

                <div className={classes.send_box}>
                    <button className={classes.send_plus_button}>
                        <img src={plusIcon} />
                    </button>

                    <input
                        className={classes.send_input}
                        value={inputText}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={keydownHandler}
                        maxLength={maxLength}
                    />
                    <button className={classes.send_button} onClick={sendName}>
                        <img src={sendIcon} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Chatting;
