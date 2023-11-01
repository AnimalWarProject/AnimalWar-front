import * as PIXI from 'pixi.js';
import back from './imgs/Rectangle12273.png';
import { useEffect, useRef, useState } from 'react';
import clockImg from './imgs/Rectangle 12282.png';
import axios from 'axios';
import { useLocation } from 'react-router';


const MatchComplete = () => {

    const canvasRef = useRef(null);

    const location = useLocation();
    const data = location.state;
    console.log(data);


    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const app = new PIXI.Application({
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

        //하얀 내 반투명 박스
        const profileBox = new PIXI.Graphics();
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.4;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

        app.stage.addChild(profileBox);




        //하얀 적 반투명 박스

        const profileBox2 = new PIXI.Graphics();
        profileBox2.beginFill(0xffffff, 0.5);
        const profileWidth2 = canvasWidth * 0.4;
        const profileHeight2 = canvasHeight * 0.85;
        profileBox.drawRoundedRect(100 + profileWidth2, 40, profileWidth, profileHeight, 40);

        app.stage.addChild(profileBox);


    }, [])

    return <div ref={canvasRef}></div>;

}

export default MatchComplete;