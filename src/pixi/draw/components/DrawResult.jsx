import {useEffect, useRef, useState} from "react";
import * as PIXI from "pixi.js";
import back from "../imgs/AnyConv.com__Rectangle 12299.webp";
import {useLocation, useNavigate} from "react-router-dom";

const DrawResult = () => {
    const canvasRef = useRef(null);
    const location = useLocation();
    const resultData = location.state;

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
            // 여러 개의 데이터 출력
            // 행과 열의 개수를 지정
            const rows = 2;
            const columns = 5;
            const itemWidth = 150;
            const itemHeight = 210;

            const profileBox = new PIXI.Graphics(); // 큰 틀
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
                    fontSize: 18,
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                });
                const text = new PIXI.Text(item.name, textStyle);
                text.anchor.set(0.5);
                text.x = x + itemWidth / 2;
                text.y = y + itemHeight * 0.9;

                profileBox.addChild(profileInnerBox);
                profileBox.addChild(text);
            });

            app.stage.addChild(profileBox);
        } else if (resultData.length === 1) {
            // 1개의 데이터 출력
            const profileBox = new PIXI.Graphics(); // 큰 틀
            profileBox.beginFill(0xffffff, 0.5);
            const profileWidth = canvasWidth * 0.85;
            const profileHeight = canvasHeight * 0.85;
            profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

            const profileInnerBox = new PIXI.Graphics(); // 작은 틀
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

            const text = new PIXI.Text(item.name, textStyle);
            text.anchor.set(0.5);
            text.x = 450;
            text.y = 500;

            app.stage.addChild(profileInnerBox);
            app.stage.addChild(profileBox);
            profileBox.addChild(text);
        }
    }, [resultData]);

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default DrawResult;