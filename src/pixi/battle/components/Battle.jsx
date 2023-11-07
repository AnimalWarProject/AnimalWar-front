import React, { useRef, useEffect } from 'react';
import classes from './Battle.module.css';
import * as PIXI from "pixi.js";
import backgroundImage from '../imgs/Rectangle 12290.png';

// 유형별 스킬 선택하기
// 1. 공격형, 방어형, 유틸형 스킬들 중에 하나씩 골라 전투에 임하게 해야한다.
// 2. 스킬들은 각 6개씩이며,  유형별로 고를 수 있게 해야되며,스크롤도 가능해야한다.
// 3. 고른 스킬들만 사용할 수 있어야 한다.

const Battle = () => {
    const pixiContainer = useRef(null);

    useEffect(() => {
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true });
        pixiContainer.current.appendChild(app.view);

        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);


        const addRoundedText = (text, x, y, width, height, cornerRadius, color) => {
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(0);
            graphics.beginFill('#FFC000');
            graphics.drawRoundedRect(x - width / 2, y - height / 2, width, height, cornerRadius);
            graphics.endFill();
            app.stage.addChild(graphics);

            const message = new PIXI.Text(text, {
                fontSize: 21,
                fill: 0x0f1828,
                align: 'center',
                fontWeight: 'bold',
                fontFamily: 'Arial'
            })
            message.anchor.set(0.5);
            message.x = x;
            message.y = y;
            app.stage.addChild(message);
        };


        addRoundedText('공격형 스킬', app.renderer.width / 4.55, app.renderer.height / 7, 177, 60, 18, 0x0f1828);
        addRoundedText('수비형 스킬', app.renderer.width / 1.95, app.renderer.height / 7, 177, 60, 18, 0x0f1828);
        addRoundedText('유틸형 스킬', app.renderer.width / 1.25, app.renderer.height / 7, 177, 60, 18, 0x0f1828);


        return () => app.destroy(true);
    }, []);

    return <div ref={pixiContainer} />;
};

export default Battle;