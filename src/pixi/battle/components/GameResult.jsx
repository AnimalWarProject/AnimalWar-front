import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import backgroundImage from '../imgs/Rectangle 12290.png';


const GameResult = () => {
    const pixiContainer = useRef(null);


    useEffect(() => {
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true,
        });
        pixiContainer.current.appendChild(app.view);

        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        // 배틀 큰틀 담는 컨테이너
        const bigBoxContainer = new PIXI.Container();
        app.stage.addChild(bigBoxContainer);

        // 게임결과 큰틀 박스
        const bigBox = new PIXI.Graphics();
        bigBox.beginFill(0xffffff, 0.2);
        const bigBoxWidth = 850;
        const bigBoxHeight = 540;
        const bigBoxCornerRadius = 10;
        bigBox.drawRoundedRect(50, 50, bigBoxWidth, bigBoxHeight, bigBoxCornerRadius);
        bigBox.endFill();
        bigBoxContainer.addChild(bigBox);


    }, []);

    return <div ref={pixiContainer} className="outlet-container"></div>;

};

export default GameResult;
