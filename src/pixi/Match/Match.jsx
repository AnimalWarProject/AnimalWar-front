import * as PIXI from 'pixi.js';
import { useEffect, useRef } from 'react';
import back from './imgs/Rectangle12273.png';
import test from './imgs/Rectangle 3.png';

const Match = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
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

        for (let i = 0; i < 6; i++) {
            const box1 = new PIXI.Graphics();
            box1.beginFill(0xffffff, 0.5);
            const boxWidth = canvasWidth * 0.5;
            const boxHeight = canvasHeight * 0.1;
            box1.drawRoundedRect(300, 80 + i * 80, boxWidth, boxHeight, 20);
            profileBox.addChild(box1);

            const column = new PIXI.Graphics();
            column.beginFill(0xffc000);
            const columnWidth = canvasWidth * 0.13;
            const columnHeight = canvasHeight * 0.09;
            column.drawRoundedRect(320, 82 + i * 80, columnWidth, columnHeight, 10);
            profileBox.addChild(column);

            const textStyle = new PIXI.TextStyle({
                fill: 0x0f1828,
                fontSize: 24,
                fontFamily: 'Arial',
            });

            const text = new PIXI.Text('닉네임', textStyle);
            column.addChild(text);
            text.x = 340;
            text.y = 100 + i * 80;
        }

        app.stage.addChild(profileBox);

        // Cleanup on component unmount
        return () => {
            app.destroy();
        };
    }, []);

    return <div ref={canvasRef}></div>;
};

export default Match;