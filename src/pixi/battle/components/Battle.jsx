import React, { useRef, useEffect } from 'react';
import * as PIXI from "pixi.js";
import Skill from "./Skill";
import backgroundImage from '../imgs/Rectangle 12290.png';




const Battle = () => {
    useEffect(() => {
        // 기본 배경크기 설정
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true
        });

        // 뒷 배경화면
        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

    }
    return <div ref={pixiContainer} className="outlet-container"></div>;
}

export default Battle;