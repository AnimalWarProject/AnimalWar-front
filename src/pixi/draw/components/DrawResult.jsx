import {useEffect, useRef, useState} from "react";
import * as PIXI from "pixi.js";
import back from "../imgs/AnyConv.com__Rectangle 12299.webp";
import {useLocation, useNavigate} from "react-router-dom";

const DrawResult = () => {
    const canvasRef = useRef(null);
    const location = useLocation();
    const resultData = JSON.stringify(location.state);


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


        const profileBox = new PIXI.Graphics(); // 큰 틀
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 5; i++) {
                const profileInnerBox1 = new PIXI.Graphics(); // 작은 틀
                profileInnerBox1.beginFill(0xffffff, 0.5);
                const InnerBoxWidth = 150;
                const InnerBoxHeight = 210;
                profileBox.drawRoundedRect(75 + (i * 160), 70 + (j * 250), InnerBoxWidth, InnerBoxHeight, 40);
            }
        }

        console.log("result 결과 : " + resultData)


        app.stage.addChild(profileBox);
    }, []);

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default DrawResult;