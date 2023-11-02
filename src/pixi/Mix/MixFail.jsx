import {useEffect, useRef} from "react";
import failMix from './imgs/FAILMIX 1.png'
import * as PIXI from "pixi.js";
import mixBackground from "./imgs/Rectangle 12348.png";

const MixFail = () => {
    const canvasRef = useRef(null);



    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        // 글꼴
        const textStyle = new PIXI.TextStyle({
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: "bold",
        });

        const app = new PIXI.Application({
            background: '#1099bb',
            width: canvasWidth,
            height: canvasHeight,
        });

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }

        const background = PIXI.Sprite.from(mixBackground);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const profileBox = new PIXI.Graphics();
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);
        app.stage.addChild(profileBox);

        // 실패 이미지
        const container = new PIXI.Container();
        container.x = 455;
        container.y = 270;
        container.width = 615;
        container.height = 507;
        app.stage.addChild(container);


        // add a bunch of sprites
        const ash = PIXI.Sprite.from(failMix);
        ash.anchor.set(0.5);
        ash.x = canvasWidth / 2 - container.width; // 스프라이트를 수평 중앙에 배치
        ash.y = canvasHeight / 2 - 100; // 스프라이트를 수직 중앙에 배치
        container.addChild(ash);
        profileBox.addChild(ash)


        //
        const failText =  new PIXI.Text('합성에 성공하지 못했습니다. \n\n       재만 남아버렸네요.', textStyle);
        failText.anchor.set(0.5);
        failText.x = ash.x - 20;
        failText.y = ash.y + 240;
        profileBox.addChild(failText);
    });


    return <div ref={canvasRef}></div>;
};

export default MixFail;