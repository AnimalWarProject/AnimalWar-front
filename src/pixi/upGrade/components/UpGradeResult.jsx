import back from "../image/Rectangle 12374.png";
import pig from "../image/PIG 12.png";
import {useEffect, useRef, useState} from "react";
import * as PIXI from "pixi.js";
import result1 from "../image/result-1.png";
import result2 from "../image/result-2.png";
import result3 from "../image/result-3.png";
import result4 from "../image/result-4.png";
import result5 from "../image/result-5.png";
const UpGradeLoading = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const textStyle = new PIXI.TextStyle({ // 글꼴
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: "bold",
        });

        const app = new PIXI.Application({
            backgroundColor: 0x1099bb,
            width: canvasWidth,
            height: canvasHeight,
        });

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }

        const background = PIXI.Sprite.from(back); // 뒷 배경사진
        background.width = app.screen.width;
        background.height = app.screen.height;


        const profileBox = new PIXI.Graphics(); // 큰 틀
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(70, 40, profileWidth, profileHeight, 40);

        const result = PIXI.Sprite.from(pig) // 강화 된 사진
        result.width = 270;
        result.height = 256;
        result.anchor.set(0.5)
        result.x = background.width / 2;
        result.y = background.height / 2;

        const images = [result1, result2, result3, result4, result5]; // 강화사진
        const textureArray = [];
        for (let i = 0; i < images.length; i++) {
            textureArray.push(PIXI.Texture.from(images[i]));
        }
        const animatedSprite = new PIXI.AnimatedSprite(textureArray);
        animatedSprite.animationSpeed = 0.05;
        animatedSprite.width = 800;
        animatedSprite.height = 500;
        animatedSprite.play();
        animatedSprite.anchor.set(0.5);
        animatedSprite.x = background.width / 2;
        animatedSprite.y = background.height / 2;


        app.stage.addChild(background);
        app.stage.addChild(profileBox);
        app.stage.addChild(animatedSprite);
        app.stage.addChild(result);
    }, []);

    return <div ref={canvasRef} className="outlet-container"></div>
};

export default UpGradeLoading;