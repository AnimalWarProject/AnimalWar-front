import * as PIXI from 'pixi.js';
import back from './imgs/Rectangle12273.png';
import { useEffect, useRef, useState } from 'react';
import clockImg from './imgs/Rectangle 12282.png';
import axios from 'axios';
import { useHistory } from 'react-router-use-history';
import { api } from '../../network/api';


const MatchProcess = () => {

    const canvasRef = useRef(null);

    const history = useHistory();

    //데이터 받아오기 
    const [userData, setUserData] = useState([]);

    //데이터를 확실히 받았는지 판단여부
    const [isDataLoaded, setIsDataLoaded] = useState(false);



    // const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJuaWNrTmFtZSI6IuygleykgOq4sCIsInVzZXJVVUlEIjoiZDMzM2JmNmQtZGEzNS00ZGFhLWIxZTYtMTg2OTllYzQxOWVlIiwiaWQiOiJ0aGtpbTIiLCJzdWIiOiJ0aGtpbTIiLCJleHAiOjE3MDYwMDg3MjV9.nK449IpFyRtKlnRGgBS6b6i02P2DUvPjjPc5qw2xzng'
    // const getTokenData = async () =>
    //     await axios
    //         .post(`http://localhost:8000/api/v1/match`, {}, {
    //             headers: {
    //                 Authorization: token,
    //             }
    //         })
    //         .then((response) => {
    //             setUserData(response.data);
    //             setIsDataLoaded(true);
    //             console.log(response.data);
    //         });

    const postTokenData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data: user } = await api('/api/v1/match', 'POST', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            setUserData(user);
            setIsDataLoaded(true);
            console.log(user);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };



    useEffect(() => {
        if (!isDataLoaded) {
            postTokenData()
        }

    }, [isDataLoaded])

    useEffect(() => {
        // setTimeout(() => history.push("/match3"), 3000)
        if (isDataLoaded) {
            setTimeout(() => history.push("/match3", { state: userData }), 3000)

        }
    }, [isDataLoaded])




    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const app = new PIXI.Application({
            width: canvasWidth,
            height: canvasHeight,
        });

        // Use ref to append the PIXI application view to the DOM.
        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);

        }

        const background = PIXI.Sprite.from(back);
        background.width = app.screen.width;
        background.height = app.screen.height;


        app.stage.addChild(background);

        //하얀 반투명 박스
        const profileBox = new PIXI.Graphics();
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

        app.stage.addChild(profileBox);


        const clock = PIXI.Texture.from(clockImg);

        const c = new PIXI.Sprite(clock);

        app.stage.addChild(c);

        // 스프라이트의 회전 중심점 (pivot)을 설정
        // c.pivot.x = c.width * 0.5 // 중심점을 가로 중앙으로 이동
        // c.pivot.y = c.height * 0.5; // 중심점을 세로 중앙으로 이동

        c.anchor.set(0.5); // 중심점을 스프라이트 중앙으로 설정

        c.x = app.renderer.width * 0.5;
        c.y = app.renderer.height * 0.5;


        app.ticker.add(() => {

            c.rotation += 0.01;
        })

        // 매칭 대기중이라는 텍스트 스프라이트
        const textStyle = new PIXI.TextStyle({
            fill: 0x0F1828,
            fontSize: 24, // 폰트 크기
            fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
        });

        const text = new PIXI.Text("상대방을 찾고있습니다.", textStyle);
        app.stage.addChild(text);
        text.x = 350;
        text.y = 92 + 370;

    }, [])

    return <div ref={canvasRef}></div>;

}

export default MatchProcess;