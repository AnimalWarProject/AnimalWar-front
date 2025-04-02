import {useEffect, useRef, useState} from "react";
import * as PIXI from "pixi.js";
import back from "../imgs/AnyConv.com__Rectangle 12299.webp";
import { useLocation, useNavigate } from 'react-router-dom';
const DrawResult = () => {
    const INVImg = `${process.env.PUBLIC_URL}/objectImgs`;
    const canvasRef = useRef(null);
    const location = useLocation();
    const resultData = location.state;
    const nav = useNavigate();

    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;
        const app = new PIXI.Application({
            background: '#1099bb',
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

        if (Array.isArray(resultData) && resultData.length > 1) {
            const rows = 2;
            const columns = 5;
            const itemWidth = 150;
            const itemHeight = 210;


            const profileBox = new PIXI.Graphics();
            profileBox.beginFill(0xffffff, 0.5);
            const profileWidth = canvasWidth * 0.85;
            const profileHeight = canvasHeight * 0.85;
            profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

            resultData.slice(0, rows * columns).forEach((item, index) => {
                const rowIndex = Math.floor(index / columns);
                const colIndex = index % columns;

                const profileInnerBox = new PIXI.Graphics();
                profileInnerBox.beginFill(0xffffff, 0.5);
                const x = 75 + colIndex * (itemWidth + 10);
                const y = 90 + rowIndex * (itemHeight + 10);
                profileInnerBox.drawRoundedRect(x, y, itemWidth, itemHeight, 40);

                const textStyle = new PIXI.TextStyle({
                    fill: 0x0f1828,
                    fontSize: 24,
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                });

                const manyTextStyle = new PIXI.TextStyle({
                    fill: 0x0f1828,
                    fontSize: 12,
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                });

                let imagePath = `${INVImg}/animals/${item.type}/${item.imagePath}`;
                if (item.type === 1) {
                    imagePath = `${INVImg}/buildings/${item.imagePath}`;
                }
                const texture = PIXI.Texture.from(imagePath);
                const imageSprite = new PIXI.Sprite(texture);
                // imageSprite.anchor.set(0.5)
                imageSprite.x = 80 + colIndex * (itemWidth + 10); 
                imageSprite.y = 110 + rowIndex * (itemHeight + 10); 
                imageSprite.width = 140; 
                imageSprite.height = 120; 

                const text = new PIXI.Text(item.name, manyTextStyle);
                text.anchor.set(0.5);
                text.x = x + itemWidth / 2;
                text.y = y + itemHeight * 0.9;

                const outResultBtn = new PIXI.Graphics();
                outResultBtn.beginFill(0x3CFBFF, 0.7);
                const outResultBtnWidth = 130;
                const outResultBtnHeight = 36;
                outResultBtn.drawRoundedRect(700, 595, outResultBtnWidth, outResultBtnHeight, 10);
                const outResultText = new PIXI.Text('돌아가기', textStyle);
                outResultBtn.addChild(outResultText);
                outResultText.x = 715;
                outResultText.y = 600;
                const outResultContainer = new PIXI.Container();
                outResultContainer.interactive = true;
                outResultContainer.buttonMode = true;
                outResultContainer.addChild(outResultBtn);
                outResultContainer.on('pointertap', () => {
                    nav('/draw');
                });

                profileBox.addChild(profileInnerBox);
                profileBox.addChild(imageSprite);
                profileBox.addChild(text);
                profileBox.addChild(outResultContainer);

            });

            app.stage.addChild(profileBox);
        } else if (resultData.length === 1) {

            const profileBox = new PIXI.Graphics();
            profileBox.beginFill(0xffffff, 0.5);
            const profileWidth = canvasWidth * 0.85;
            const profileHeight = canvasHeight * 0.85;
            profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

            const profileInnerBox = new PIXI.Graphics();
            profileInnerBox.beginFill(0xffffff, 0.5);
            const InnerBoxWidth = profileWidth / 2;
            const InnerBoxHeight = 480;
            profileInnerBox.drawRoundedRect(250, 70, InnerBoxWidth, InnerBoxHeight, 40);

            const item = resultData[0];

            const textStyle = new PIXI.TextStyle({
                fill: 0x0f1828,
                fontSize: 24,
                fontFamily: 'Arial',
                fontWeight: 'bold',
            });

            let imagePath = `${INVImg}/animals/${item.type}/${item.imagePath}`;
            if (item.type === 1) {
                imagePath = `${INVImg}/buildings/${item.imagePath}`;
            }
            const texture = PIXI.Texture.from(imagePath);
            const imageSprite = new PIXI.Sprite(texture);
            imageSprite.anchor.set(0.5)
            imageSprite.x = 450;
            imageSprite.y = 270;
            imageSprite.width = 380;
            imageSprite.height = 350;

            const text = new PIXI.Text(item.name, textStyle);
            text.anchor.set(0.5);
            text.x = 450;
            text.y = 500;

            const outResultBtn = new PIXI.Graphics();
            outResultBtn.beginFill(0x3CFBFF, 0.7);
            const outResultBtnWidth = 130;
            const outResultBtnHeight = 36;
            outResultBtn.drawRoundedRect(700, 595, outResultBtnWidth, outResultBtnHeight, 10);
            const outResultText = new PIXI.Text('돌아가기', textStyle);
            outResultBtn.addChild(outResultText);
            outResultText.x = 715;
            outResultText.y = 600;
            const outResultContainer = new PIXI.Container();
            outResultContainer.interactive = true;
            outResultContainer.buttonMode = true;
            outResultContainer.addChild(outResultBtn);
            outResultContainer.on('pointertap', () => {
                nav('/draw');
            });

            app.stage.addChild(profileInnerBox);
            app.stage.addChild(profileBox);
            profileBox.addChild(text);
            app.stage.addChild(imageSprite);
            app.stage.addChild(outResultContainer);
        }
    }, []);

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default DrawResult;