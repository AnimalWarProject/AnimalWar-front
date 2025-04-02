import React, { useEffect, useRef, useState } from 'react';
import back from './imgs/Rectangle 12416.webp';
import arrow1 from './imgs/ARROW 1.webp';
import * as PIXI from 'pixi.js';

import foodImg from '../../../src/common/imgs/Food.webp';
import ironImg from '../../../src/common/imgs/Iron.webp';
import woodImg from '../../../src/common/imgs/Wood.webp';
import goldImg from '../../../src/common/imgs/Gold.webp';
import { ButtonContainer } from '@pixi/ui';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from 'react-router-use-history';
import { api } from '../../network/api';

const Exchange = () => {
    const history = useHistory();
    const canvasRef = useRef(null);
    const canvasWidth = 960;
    const canvasHeight = 640;
    const [wood, setWood] = useState("");
    const [iron, setIron] = useState("");
    const [food, setFood] = useState("");
    const [gold, setGold] = useState("");
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const token = 'Bearer ' + localStorage.getItem('accessToken');

    const getTokenData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data: user } = await api('/api/v1/user', 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log(user);
            setWood(user.wood);
            setIron(user.iron);
            setFood(user.food);
            setGold(user.gold);
            setIsDataLoaded(true);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const postExchange = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data: user } = await api('/api/v1/exchange', 'POST', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    }



    useEffect(() => {
        if (!isDataLoaded) { 
            getTokenData();
        }


        if (isDataLoaded) {
            const app = new PIXI.Application({
                width: canvasWidth,
                height: canvasHeight,
            });


            if (canvasRef.current) {
                canvasRef.current.appendChild(app.view);
            }


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
                '잔여 식량': food,
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
                amountBox.beginFill(0xd4f1fe);
                amountBox.lineStyle(2, 0x000);
                const amountBoxWidth = canvasWidth * 0.13;
                const amountBoxHeight = canvasHeight * 0.05;
                amountBox.drawRect(230, 140 + i * (matBoxHeight + 20), amountBoxWidth, amountBoxHeight);

                app.stage.addChild(amountBox);

                const textStyle = new PIXI.TextStyle({
                    fill: 0x0f1828,
                    fontSize: 20,
                    fontFamily: 'Arial', 
                });

                const text = new PIXI.Text('2000', textStyle);



                text.x = 270;
                text.y = 142 + i * (matBoxHeight + 20);
                app.stage.addChild(text);
                amountBox.addChild(text);
            }

            const text2Style = new PIXI.TextStyle({
                fill: 0x0f1828,
                fontSize: 15, 
                fontWeight: 'bold',
                fontFamily: 'Arial', 
            });

            const woodText = new PIXI.Text(Object.keys(remain)[0] + ' :' + Object.values(remain)[0], text2Style);

            woodText.x = 220;
            woodText.y = 180;
            app.stage.addChild(woodText);

            const ironText = new PIXI.Text(Object.keys(remain)[1] + ' :' + Object.values(remain)[1], text2Style);

            ironText.x = 220;
            ironText.y = 180 + 1 * (canvasHeight * 0.15 + 20);

            app.stage.addChild(ironText);

            const foodText = new PIXI.Text(Object.keys(remain)[2] + ' :' + Object.values(remain)[2], text2Style);

            foodText.x = 220;
            foodText.y = 180 + 2 * (canvasHeight * 0.15 + 20);
            app.stage.addChild(foodText);

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
                fill: 0x0f1828,
                fontSize: 40, 
                fontWeight: 'bold',
                fontFamily: 'Arial', 
            });

            const text = new PIXI.Text('1000', textStyle);

            text.x = 660;
            text.y = 265;
            app.stage.addChild(text);
            matBox.addChild(text);

            //잔여 골드
            const goldText = new PIXI.Text(`잔여 골드 : ${gold}`, text2Style);

            goldText.x = 600;
            goldText.y = 350;
            app.stage.addChild(goldText);

            const img = PIXI.Sprite.from(goldImg);

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
                    .beginFill(0x1eb563)
                    .drawRoundedRect(canvasWidth * 0.7, canvasHeight * 0.8, 150, 60, 50)
            );

            app.stage.addChild(button);

            let count = 0;

            //버튼 액션
            button.onPress.connect(async () => {
                try {
                    await postExchange();

                    console.log('postExchange 요청이 완료되었습니다.');




                    count++;

                    const newWood = wood - count * 2000;

                    const newIron = iron - count * 2000;
                    const newFood = food - count * 2000;

                    const newGold = gold + count * 1000;


                    if (newWood < 0 || newIron < 0 || newFood < 0) {
                        throw new Error('에러');
                    }

                    woodText.text = `잔여 목재 :${newWood}`;
                    ironText.text = `잔여 철 :${newIron}`;
                    foodText.text = `잔여 식량 :${newFood}`;
                    goldText.text = `잔여 골드 : ${newGold}`;



                    const starTexture = PIXI.Texture.from(goldImg); 
                    const numberOfStars = 10;

                    for (let i = 0; i < numberOfStars; i++) {
                        const star = new PIXI.Sprite(starTexture);
                        star.anchor.set(0.5); 
                        star.x = Math.random() * app.screen.width;
                        star.y = Math.random() * app.screen.height;
                        star.rotation = Math.random() * Math.PI * 2;
                        star.scale.set(0.5 + Math.random() * 0.5);

                        background.addChild(star);

                        // 별이 아래로 떨어지는 애니메이션 설정
                        const speed = 3 + Math.random() * 2;
                        app.ticker.add(() => {
                            star.y += speed;
                            star.rotation += 0.1;
                            if (star.y > app.screen.height) {

                                app.stage.removeChild(star);
                            }
                        });
                    }

                } catch (error) {
                    // 요청이 실패한 경우 에러 처리
                    if (error.response && error.response.status === 400) {
                        // 400 에러 처리
                        console.error('postExchange 요청이 실패했습니다. 400 에러 발생', error);
                        toast.error('교환 실패 !!  자원이 없습니다');
                    } else {
                        console.error('postExchange 요청이 실패했습니다.', error);
                        toast.error('교환 실패 !!  자원이 없습니다');
                    }
                }
            });

            //교환 시작 텍스트 스프라이트
            const textStyle2 = new PIXI.TextStyle({
                fill: 0x0f1828,
                fontSize: 24,
                fontFamily: 'Arial',
            });
            const text2 = new PIXI.Text('교환하기', textStyle2);

            text2.x = canvasWidth * 0.73;
            text2.y = canvasHeight * 0.83;
            app.stage.addChild(text2);

            //교환 안내문 텍스트 스프라이트
            const textStyle3 = new PIXI.TextStyle({
                fill: 0x0f1828,
                fontSize: 24, 
                fontFamily: 'Arial',
            });
            const text3 = new PIXI.Text('각 자원 2000개 = 1000골드', textStyle3);

            text3.x = canvasWidth * 0.13;
            text3.y = canvasHeight * 0.83;
            app.stage.addChild(text3);
        }
    }, [isDataLoaded]);

    return (
        <div ref={canvasRef}>
            <ToastContainer />
        </div>
    );
};

export default Exchange;
