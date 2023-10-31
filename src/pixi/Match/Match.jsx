import * as PIXI from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import back from './imgs/Rectangle12273.png';
import test from './imgs/Rectangle 3.png';
import axios from 'axios';

const Match = () => {
    const canvasRef = useRef(null);

    //데이터 받아오기 
    const [userData, setUserData] = useState([]);

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // const token = localStorage.getItem("token");

    useEffect(() => {

        const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJuaWNrTmFtZSI6IuygleykgOq4sCIsInVzZXJVVUlEIjoiZDMzM2JmNmQtZGEzNS00ZGFhLWIxZTYtMTg2OTllYzQxOWVlIiwiaWQiOiJ0aGtpbTIiLCJzdWIiOiJ0aGtpbTIiLCJleHAiOjE2OTg3ODcxMzR9.VFNDBmnD9iGQIYrotUM-r5ePjwmbfI5XXrHhOCq924M'
        const getTokenData = () =>
            axios
                .get(`http://localhost:8000/api/v1/user`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    setUserData(response.data);
                    setIsDataLoaded(true);
                    console.log(response.data);
                });


        if (!isDataLoaded) {
            getTokenData();
        }


    }, [isDataLoaded])
    //데이터 끝


    useEffect(() => {

        if (isDataLoaded) {
            const canvasWidth = 960;
            const canvasHeight = 640;

            const app = new PIXI.Application({
                background: '#1099bb',
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

            const profileBox = new PIXI.Graphics();
            profileBox.beginFill(0xffffff, 0.5);
            const profileWidth = canvasWidth * 0.85;
            const profileHeight = canvasHeight * 0.85;
            profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

            const imageTexture = PIXI.Texture.from(test);
            const imageSprite = new PIXI.Sprite(imageTexture);
            imageSprite.width = 146;
            imageSprite.height = 127;
            imageSprite.x = 120;
            imageSprite.y = 70;
            profileBox.addChild(imageSprite);

            const array = ['닉네임', '공격력', '방어력', '  체 력', '  종 족', '대표지형'];
            const content = [userData.nickName, userData.attackPower, userData.defensePower, userData.life, userData.species, userData.landForm];


            for (let i = 0; i < 6; i++) {
                const box1 = new PIXI.Graphics();
                box1.beginFill(0xffffff, 0.5);
                const boxWidth = canvasWidth * 0.5;
                const boxHeight = canvasHeight * 0.08;
                box1.drawRoundedRect(300, 80 + i * 70, boxWidth, boxHeight, 20);
                profileBox.addChild(box1);

                const column = new PIXI.Graphics();
                column.beginFill(0xffc000);
                const columnWidth = canvasWidth * 0.13;
                const columnHeight = canvasHeight * 0.07;
                column.drawRoundedRect(320, 82 + i * 70, columnWidth, columnHeight, 10);
                profileBox.addChild(column);

                // 텍스트 스프라이트를 생성합니다.
                const textStyle = new PIXI.TextStyle({
                    fill: 0x0F1828,
                    fontSize: 24, // 폰트 크기
                    fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
                });

                const text = new PIXI.Text(array[i], textStyle);
                column.addChild(text);
                text.x = 340;
                text.y = 92 + i * 70;

                // 컨텐츠 텍스트 스프라이트

                const textStyle2 = new PIXI.TextStyle({
                    fill: 0x0F1828,
                    fontSize: 24, // 폰트 크기
                    fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
                });
                const text2 = new PIXI.Text(content[i], textStyle2);

                text2.x = 500;
                text2.y = 95 + i * 70;
                column.addChild(text2);
            }

            //매칭 시작 버튼 



            const box1 = new PIXI.Graphics();
            box1.beginFill(0xFFC000);
            const boxWidth = canvasWidth * 0.16;
            const boxHeight = canvasHeight * 0.1;


            box1.drawRoundedRect(canvasWidth * 0.7, canvasHeight * 0.78, boxWidth, boxHeight, 50);
            profileBox.addChild(box1);


            // 매칭 시작 텍스트 스프라이트

            const textStyle2 = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24, // 폰트 크기
                fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
            });
            const text2 = new PIXI.Text("매칭시작", textStyle2);

            text2.x = canvasWidth * 0.73;
            text2.y = canvasHeight * 0.81;
            profileBox.addChild(text2);



            // const buttonContainer = new PIXI.Container();

            // buttonContainer.addChild(box1);
            // buttonContainer.interative = true;
            // buttonContainer.buttonMode = true;

            // buttonContainer.x = 500;
            // buttonContainer.y = 500;


            // const button = new Button(
            //     new PIXI.Graphics()
            //         .beginFill(0xFFC000)
            //         .drawRoundedRect(canvasWidth * 0.7, canvasHeight * 0.78, boxWidth, boxHeight, 50)
            // );

            // button.onPress.connect(() => console.log('onPress'));

            // profileBox.addChild(button.view);







            app.stage.addChild(profileBox);

        }


        // // Cleanup on component unmount
        // return () => {
        //     app.destroy();
        // };
    }, [isDataLoaded, userData]);

    return (
        <div>
            {/* {!isDataLoaded && <div><img src={back}></img></div>} */}
            <div ref={canvasRef}></div>

        </div>

    )
};

export default Match;
