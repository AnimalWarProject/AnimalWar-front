import classes from "./Chatting.module.css"
import Rectangle4 from "../imgs/Rectangle 4.png"
import sendIcon from "../imgs/send.png"
import plusIcon from "../imgs/plusIcon.png"
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import randomColor from 'random-color';





const Chatting = () => {
    const [inputText, setInputText] = useState('');
    const maxLength = 100; // 최대 글자 수
    const [isFocused, setIsFocused] = useState(false);
    const wrapRef = useRef();
    const [nickName, setNickName] = useState('GUEST');
    const [profileImage, setProfileImage] = useState('')
    const [showMessage, setShowMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [greetings, setGreetings] = useState([]);
    const [userColor, serUserColor] = useState('yellow');


    useEffect(() => {


        const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJuaWNrTmFtZSI6Imdvb2Rib3kiLCJ1c2VyVVVJRCI6IjBhOGE2MDFhLTkxNGQtNDQxZi1iZmMzLTFhMDAwZGU0YWRiNyIsImlkIjoianVua2kiLCJwcm9maWxlSW1hZ2UiOiJDOlxcVXNlcnNcXFBsYXlkYXRhXFxEZXNrdG9wXFxEQlxcQ0FUKFBORylcXExFR0VORCIsInN1YiI6Imp1bmtpIiwiZXhwIjoxNjk5NTAyODE4fQ.VMl_BLEFs9fZFbK2LCcRbQaP2NBpPGs_5MsOI5DljLA';

        axios.get('http://localhost:8000/api/v1/user', {
            headers : {
                Authorization: token,
                ContentType : 'application/json'
            }
        }).then((res) => {

            setNickName(res.data.nickName);
            setProfileImage(res.data.profileImage)
        }).catch((err) => {
            console.log(err)
        })


        const socket = new SockJS('http://localhost:8082/stomp-endpoint'); // #1 socket열기(server와 연결) // npm install stompjs
        const stomp = Stomp.over(socket); // STOMP 클라이언트를 통해 STOMP 프로토콜을 사용하여 메시지를 전송 및 수신


        stomp.connect({}, (frame) => {
            setStompClient(stomp);
            console.log('Connected: ' + frame); // STOMP 클라이언트를 서버와 연결하고, 연결에 성공하면 콜백 함수를 실행.. {}는 헤더(연결에 대한 추가 설정)

            // #2'/topic/greetings'을 구독
            stomp.subscribe('/topic/greetings', (greeting) => { // 메시지를 파싱하고 표시
                const parseMessage = JSON.parse(greeting.body)
                setGreetings(prevState => [...prevState, parseMessage.message])
            });
        });




        // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
        return () => {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
        };




    }, []);


// Feat : 채팅에 유저마다 닉네임 색깔 지정
    function getRandomColor(nickName) {
        // nickName을 기반으로 고유한 색상 생성
        const seed = parseInt(nickName, 36); // userId를 36진수로 파싱
        return randomColor(seed).hexString(); // 색상을 반환
    }




// Feat : 메시지 보내기
    const sendName = () => {
        const obj = {
            'nickname': nickName || 'GUEST',
            'content': inputText
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
    }

    const handleBlur = () => {
        // setIsFocused(false);
        wrapRef.current.style.position = 'absolute';
        wrapRef.current.style.height = ' 21rem';
        wrapRef.current.style.top = '49%';
    }

    const messageStyle = {
        height: isFocused ? '80%' : '100%', // 커서가 입력 필드에 있을 때와 없을 때의 너비 조절
    };

    const keydownHandler = (e) => {
        if (e.key === 'Enter') {
            sendName();
            setInputText('')
        }
    }






    return (
        <section className={classes.Wrap} ref={wrapRef}>
            <div className={classes.box}>
                <div className={classes.title}>CHATTING</div>
                <div className={classes.message} style={messageStyle}>
                    <div className={classes.message_title}>GOOD CHATTING PLZ!</div>

                    {greetings.map((item, idx) => (
                        <div key={idx} className={classes.message_container}>
                            <img className={classes.profileImg} src={profileImage}/>
                            <div className={classes.profileNickname} style={{ color: getRandomColor(nickName)}}>{nickName}</div>
                            <div className={classes.messageRecord}>{item}</div>
                        </div>
                    ))}

                </div>

                <div className={classes.send_box}>
                    <button className={classes.send_plus_button}>
                        <img src={plusIcon}/>
                    </button>

                    <input className={classes.send_input}
                           value={inputText}
                           onChange={handleInputChange}
                           onFocus={handleFocus}
                           onBlur={handleBlur}
                           onKeyDown={keydownHandler}
                           maxLength={maxLength} />
                    <button className={classes.send_button}
                            onClick={sendName}
                    >
                        <img src={sendIcon}/>
                    </button>
                </div>



            </div>
        </section>
    );
}



export default Chatting;