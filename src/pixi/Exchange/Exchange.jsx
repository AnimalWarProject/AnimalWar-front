import React, { useEffect, useRef, useState } from "react";
import back from './imgs/Rectangle 12416.webp';
import arrow1 from './imgs/ARROW 1.webp';
import * as PIXI from 'pixi.js';

import foodImg from '../../../src/common/imgs/Food.webp'
import ironImg from '../../../src/common/imgs/Iron.webp'
import woodImg from '../../../src/common/imgs/Wood.webp'
import gold from '../../../src/common/imgs/Gold.webp'
import axios from "axios";
import { ButtonContainer } from "@pixi/ui";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-use-history";

const Exchange = React.memo(() => {


    const history = useHistory();
    const canvasRef = useRef(null);
    const canvasWidth = 960;
    const canvasHeight = 640;



    //데이터 받아오기 
    const [userData, setUserData] = useState([]);

    const [wood, setWood] = useState();
    const [iron, setIron] = useState();
    const [food, setFood] = useState();


    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJuaWNrTmFtZSI6IuygleykgOq4sCIsInVzZXJVVUlEIjoiZDMzM2JmNmQtZGEzNS00ZGFhLWIxZTYtMTg2OTllYzQxOWVlIiwiaWQiOiJ0aGtpbTIiLCJzdWIiOiJ0aGtpbTIiLCJleHAiOjE3MDY1NDA2NDd9.3so3znBSh4i3LgQleiMbvvgI2Qq7DK5vtBXIFNairOI'

    const postExchange = async () =>
        await axios
            .post(`http://localhost:8000/api/v1/exchange`, {}, {
                headers: {
                    Authorization: token,
                }
            })
            .then((response) => {

            });

    useEffect(() => {

        const getTokenData = () =>
            axios
                .get(`http://localhost:8000/api/v1/user`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    setUserData(response.data);
                    setWood(response.data.wood);
                    setIron(response.data.iron);
                    setFood(response.data.food);
                    setIsDataLoaded(true);

                });


        if (!isDataLoaded) {
            getTokenData();
        }


    }, [isDataLoaded]);


    useEffect(() => {

        if (isDataLoaded) {




            const app = new PIXI.Application({
                width: canvasWidth,
                height: canvasHeight,
            });

            // Use ref to append the PIXI application view to the DOM.
            if (canvasRef.current) {
                canvasRef.current.appendChild(app.view);
            }


            // 백그라운드 사진
            const background = PIXI.Sprite.from(back);
            background.width = app.screen.width;
            background.height = app.screen.height;

            app.stage.addChild(background);

            // 엄청 큰 모서리가 둥근 하얀틀

            const whiteBox = new PIXI.Graphics();
            whiteBox.beginFill(0xffffff, 0.5);
            const boxWidth = canvasWidth * 0.87;
            const boxHeight = canvasHeight * 0.85;
            whiteBox.drawRoundedRect(62, 40, boxWidth, boxHeight, 40);

            app.stage.addChild(whiteBox);


            //왼쪽 하얀틀

            const leftBox = new PIXI.Graphics();
            leftBox.beginFill(0xffffff, 0.5);
            const leftBoxWidth = canvasWidth * 0.4;
            const leftBoxHeight = canvasHeight * 0.7;
            leftBox.drawRoundedRect(82, 60, leftBoxWidth, leftBoxHeight, 40);

            app.stage.addChild(leftBox);


            //나무 철 식량 틀

            const imgs = [woodImg, ironImg, foodImg];

            const remain = {
                '잔여 목재': wood,
                '잔여 철': iron,
                '잔여 식량': food
            };




            for (let i = 0; i < 3; i++) {

                const matBox = new PIXI.Graphics();
                matBox.beginFill(0xffffff, 0.5);
                matBox.lineStyle(2, 0x000);
                const matBoxWidth = canvasWidth * 0.3;
                const matBoxHeight = canvasHeight * 0.15;
                matBox.drawRoundedRect(110, 120 + i * (matBoxHeight + 20), matBoxWidth, matBoxHeight, 40);

                matBox.addChild(matBox);
                app.stage.addChild(matBox);

                const img = PIXI.Sprite.from(imgs[i]);

                img.width = canvasWidth * 0.1;
                img.height = canvasWidth * 0.08;

                img.x = canvasWidth * 0.13;
                img.y = canvasHeight * 0.2 + i * (canvasHeight * 0.15 + 20);
                app.stage.addChild(img);

                //교환 비율 양

                const amountBox = new PIXI.Graphics();
                amountBox.beginFill(0xD4F1FE);
                amountBox.lineStyle(2, 0x000);
                const amountBoxWidth = canvasWidth * 0.15;
                const amountBoxHeight = canvasHeight * 0.05;
                amountBox.drawRect(230, 140 + i * (matBoxHeight + 20), amountBoxWidth, amountBoxHeight);

                app.stage.addChild(amountBox);

                const textStyle = new PIXI.TextStyle({
                    fill: 0x0F1828,
                    fontSize: 20, // 폰트 크기
                    fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
                });

                const text = new PIXI.Text('20000', textStyle);

                //Object.keys(remain)[i]

                text.x = 270;
                text.y = 142 + i * (matBoxHeight + 20);
                app.stage.addChild(text);
                amountBox.addChild(text);

                const text2Style = new PIXI.TextStyle({
                    fill: 0x0F1828,
                    fontSize: 15, // 폰트 크기
                    fontWeight: 'bold',
                    fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
                });

                const text2 = new PIXI.Text(Object.keys(remain)[i] + " :" + Object.values(remain)[i], text2Style);

                text2.x = 220;
                text2.y = 180 + i * (matBoxHeight + 20);
                app.stage.addChild(text2);

            }

            //오른쪽 하얀틀

            const rightBox = new PIXI.Graphics();
            rightBox.beginFill(0xffffff, 0.5);
            const rightBoxWidth = canvasWidth * 0.4;
            const rightBoxHeight = canvasHeight * 0.7;
            rightBox.drawRoundedRect(482, 60, rightBoxWidth, rightBoxHeight, 40);

            app.stage.addChild(rightBox);

            //돈주머니 하얀 틀
            const matBox = new PIXI.Graphics();
            matBox.beginFill(0xffffff, 0.5);
            matBox.lineStyle(2, 0x000);
            const matBoxWidth = canvasWidth * 0.3;
            const matBoxHeight = canvasHeight * 0.15;
            matBox.drawRoundedRect(540, 240, matBoxWidth, matBoxHeight, 40);

            matBox.addChild(matBox);
            app.stage.addChild(matBox);

            const textStyle = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 40, // 폰트 크기
                fontWeight: 'bold',
                fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
            });

            const text = new PIXI.Text("1000", textStyle);


            text.x = 660;
            text.y = 265;
            app.stage.addChild(text);
            matBox.addChild(text);



            const img = PIXI.Sprite.from(gold);

            img.width = canvasWidth * 0.1;
            img.height = canvasWidth * 0.08;

            img.x = canvasWidth * 0.57;
            img.y = canvasHeight * 0.39;
            app.stage.addChild(img);


            //애로우1
            const arrow = PIXI.Sprite.from(arrow1);

            arrow.x = canvasWidth * 0.45;
            arrow.y = canvasHeight * 0.4;
            app.stage.addChild(arrow);



            //교환 시작 버튼 

            const button = new ButtonContainer(
                new PIXI.Graphics()
                    .beginFill(0x1EB563)
                    .drawRoundedRect(canvasWidth * 0.7, canvasHeight * 0.8, 150, 60, 50)
            )

            app.stage.addChild(button);


            //버튼 액션 
            button.onPress.connect(async () => {




                try {
                    // postExchange 함수를 비동기로 호출하고 요청이 끝날 때까지 기다립니다.
                    await postExchange();

                    // postExchange 요청이 성공적으로 완료된 후에 실행할 로직을 여기에 추가합니다.
                    console.log('postExchange 요청이 완료되었습니다.');

                    // 페이지를 새로 고침할 경우

                    window.location.reload();

                } catch (error) {
                    // 요청이 실패한 경우 에러 처리
                    console.error('postExchange 요청이 실패했습니다.', error);
                    toast.error("교환 실패 !!  자원이 없습니다");
                }

            }

            );


            //교환 시작 텍스트 스프라이트
            const textStyle2 = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24, // 폰트 크기
                fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
            });
            const text2 = new PIXI.Text("교환하기", textStyle2);

            text2.x = canvasWidth * 0.73;
            text2.y = canvasHeight * 0.83;
            app.stage.addChild(text2);


        }



    }, [isDataLoaded, wood])

    return (<div ref={canvasRef}>

        <ToastContainer />
    </div>);
})

export default Exchange;