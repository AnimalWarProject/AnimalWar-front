import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import backgroundImage from '../imgs/Rectangle 12290.png';
import victory from '../imgs/Victory.png';
import {useLocation} from "react-router";
import { api, URL } from '../../../network/api';


const WinnerResult = () => {
    const pixiContainer = useRef(null);
    const location = useLocation();
    const data = location.state;
    const [atkGold, setAtkGold] = useState(data.state.state.state.attacker.gold);
    const [defGold, setDefGold] = useState(data.state.state.state.depender.gold);
    const [atkPoint, setAtkPoint] = useState(data.state.state.state.attacker.battlePoint);
    const [atkRank, setAtkRank] = useState();



    const sendResultDataToServer = async () => {
        const requestBody = {
            attacker: {
                gold : data.state.state.state.attacker.gold,
                battlePoint: data.state.state.state.attacker.battlePoint
            },
            defender: {
                gold : data.state.state.state.depender.gold,
                battlePoint: data.state.state.state.depender.battlePoint
            }
        }
        const updateToken = localStorage.getItem('updateToken');
        const response = await api('', 'POST', requestBody, {
            headers: {
                Authorization: `Bearer ${updateToken}`,
            },
        });
    }

    useEffect(() => {
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true,
        });
        pixiContainer.current.appendChild(app.view);

        // 뒷 배경 화면
        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        // 배틀 큰틀 담는 컨테이너
        const bigBoxContainer = new PIXI.Container();
        app.stage.addChild(bigBoxContainer);


        const imageBox = (imageUrl) => {
            const container = new PIXI.Container();
            const isVictory = true;

            // 결과 이미지

            const resultImageTexture = PIXI.Texture.from(imageUrl);
            const resultImage = new PIXI.Sprite(resultImageTexture);

            resultImage.width = 220;
            resultImage.height = 220;
            resultImage.x = 370;
            resultImage.y = 55;
            container.addChild(resultImage);
            app.stage.addChild(container);

        }
        imageBox(victory);


        // 게임결과 큰틀 박스
        const bigBox = new PIXI.Graphics();
        bigBox.beginFill(0xffffff, 0.4);
        const bigBoxWidth = 850;
        const bigBoxHeight = 540;
        const bigBoxCornerRadius = 10;
        bigBox.drawRoundedRect(50, 50, bigBoxWidth, bigBoxHeight, bigBoxCornerRadius);
        bigBox.endFill();
        bigBoxContainer.addChild(bigBox);

        const smallContainer = new PIXI.Container();
        app.stage.addChild(smallContainer);


        const createSmallBox = (x, y, width, height, cornerRadius) => {
            const smallBox = new PIXI.Graphics();
            smallBox.beginFill(0xffffff, 0.6);
            smallBox.drawRoundedRect(x, y, width, height, cornerRadius);
            smallBox.endFill();
            smallContainer.addChild(smallBox);

            return smallBox;
        };
        const smallBoxWidth = 745;
        const smallBoxHeight = 90;
        const smallBoxCornerRadius = 10;
        createSmallBox(100, 310, smallBoxWidth, smallBoxHeight, smallBoxCornerRadius);
        createSmallBox(100, 440, smallBoxWidth, smallBoxHeight, smallBoxCornerRadius);


        const updatedAtkGold = 1000;


        const addGoldText = (text, x, y, width, height, cornerRadius, fontSize, fontWeight,
                                isGoldText, updatedAtkGold) => {
            const container = new PIXI.Container();
            const important = new PIXI.Graphics();
            important.lineStyle(0);
            important.beginFill('#FFC000');
            important.drawRoundedRect(x , y, width, height, cornerRadius);
            important.endFill();
            container.addChild(important);

            // 글꼴
            const message = new PIXI.Text(text, {
                fontSize: fontSize || 30,
                fontWeight: fontWeight || 'normal',
                fill: 0x0f1828,
                align: 'center',
                fontFamily: 'Arial'
            });
            message.anchor.set(0.5);
            message.x = x + width / 2;
            message.y = y + height/ 2;
            container.addChild(message);

            if (isGoldText) {
                const goldText = new PIXI.Text( "➔  " + updatedAtkGold + " 상승 ",
                    {
                        fontSize: 22,
                        fill: 0x0f1828,
                        align: 'justify',
                        fontWeight: 'bolder',
                        fontFamily: 'Arial'
                });
                goldText.anchor.set(0, 0.5);
                goldText.x = x + 170;
                goldText.y = y + 28;
                container.addChild(goldText);
            }

            app.stage.addChild(container);
        };


        const updatedAtkPoint = 20;
        // 배틀포인트 크기 및 위치 조정
        const addPointText = (text, x, y, width, height, cornerRadius, fontSize, fontWeight,
                             isPointText, updatedAtkPoint) => {

            const container = new PIXI.Container();
            const important = new PIXI.Graphics();
            important.lineStyle(0);
            important.beginFill('#FFC000');
            important.drawRoundedRect(x , y, width, height, cornerRadius);
            important.endFill();
            container.addChild(important);

            // 글꼴
            const message = new PIXI.Text(text, {
                fontSize: fontSize || 27,
                fontWeight: fontWeight || 'normal',
                fill: 0x0f1828,
                align: 'center',
                fontFamily: 'Arial'
            });
            message.anchor.set(0.5);
            message.x = x + width / 2;
            message.y = y + height/ 2;
            container.addChild(message);


            if (isPointText) {
                // 업데이트 할 배틀 포인트

                const pointText = new PIXI.Text( "➔  " + updatedAtkPoint + " 상승 ",
                    {
                        fontSize: 22,
                        fill: 0x0f1828,
                        align: 'justify',
                        fontWeight: 'bolder',
                        fontFamily: 'Arial'
                    });
                pointText.anchor.set(0, 0.5);
                pointText.x = x + 170;
                pointText.y = y + 28;
                container.addChild(pointText);
            }
            app.stage.addChild(container);
        };


        // // 랭크 박스  크기 및 위치 조정
        // const addRankText = (text, x, y, width, height, cornerRadius, fontSize, fontWeight,
        //                      isRankText, currentRank, changeRank) => {
        //     const container = new PIXI.Container();
        //     const important = new PIXI.Graphics();
        //
        //     important.lineStyle(0);
        //     important.beginFill('#FFC000');
        //     important.drawRoundedRect(x, y, width, height, cornerRadius);
        //     important.endFill();
        //     container.addChild(important);
        //
        //     // 글꼴
        //     const message = new PIXI.Text(text, {
        //         fontSize: fontSize || 27,
        //         fontWeight: fontWeight || 'normal',
        //         fill: 0x0f1828,
        //         align: 'center',
        //         fontFamily: 'Arial'
        //     });
        //     message.anchor.set(0.5);
        //     message.x = x + width / 2;
        //     message.y = y + height / 2;
        //     container.addChild(message);
        //
        //     if (isRankText) {
        //         let rankChangeText;
        //         if (changeRank > 0) {
        //             rankChangeText = `${changeRank} 상승 ➔ ${currentRank + changeRank}위`;
        //         } else if (changeRank < 0) {
        //             rankChangeText = `${Math.abs(changeRank)} 하락 ➔ ${currentRank + changeRank}위`;
        //         } else {
        //             rankChangeText = `유지 ${currentRank}위`;
        //         }
        //
        //         const rankText = new PIXI.Text(rankChangeText, {
        //             fontSize: 18,
        //             fill: 0x0f1828,
        //             align: 'justify',
        //             fontWeight: 'bolder',
        //             fontFamily: 'Arial'
        //         });
        //         rankText.anchor.set(0, 0.5);
        //         rankText.x = x + 170;
        //         rankText.y = y + 23;
        //         container.addChild(rankText);
        //     }
        //     app.stage.addChild(container);
        // };



        // 골드 박스  크기 및 위치 조정
        const addMatch = (text, x, y, width, height, cornerRadius, fontSize, fontWeight) => {
            const container = new PIXI.Container();
            const important = new PIXI.Graphics();
            important.lineStyle(0);
            important.beginFill('#FFC000');
            important.drawRoundedRect(x , y, width, height, cornerRadius);
            important.endFill();
            container.addChild(important);

            // 글꼴
            const message = new PIXI.Text(text, {
                fontSize: fontSize || 27,
                fontWeight: fontWeight || 'normal',
                fill: 0x0f1828,
                align: 'center',
                fontFamily: 'Arial'
            });
            message.anchor.set(0.5);
            message.x = x + width / 2;
            message.y = y + height/ 2;
            container.addChild(message);

            const matchText = new PIXI.Text(
                {
                    fontSize: 18,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial'
                    });
            matchText.anchor.set(0, 0.5);
            matchText.x = x + 170;
            matchText.y = y + 23;

            const handleClick0 = () => {
                console.log(`${text}이(가) 클릭되었습니다.`);

                if (text === '추가 매칭') {
                    // '전투 시작'이 클릭된 경우 리다이렉션 수행
                    gsap.to(container, { alpha: 0.5, duration: 0.5, onComplete: () => {
                            window.location = URL + '/battle';
                        } });
                }
            };
            container.interactive = true;
            container.buttonMode = true;
            container.on('click', handleClick0);

            app.stage.addChild(container);
        };


        addGoldText('골      드', 115, 325, 155, 60, 10, 22, 'bolder', true, updatedAtkGold);
        addPointText('배틀 포인트',  115, 455, 155, 60, 10, 22, 'bolder', true, updatedAtkPoint);
        addMatch('추가 매칭',  770, 595, 126, 39, 20, 18, 'bolder');
        // addRankText('랭킹 순위', 110, 490, 150, 50, 10, 21, 'bolder', true, 111, 13);

    }, []);

    return <div ref={pixiContainer} className="outlet-container"></div>;

};

export default WinnerResult;
